import axios, { AxiosError } from 'axios'
import { debounce } from 'lodash'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import * as rax from 'retry-axios'

import { useChannel, useVideos } from '@/api/hooks'
import { absoluteRoutes } from '@/config/routes'
import { useStorageProviders, useUser } from '@/hooks'
import { useStore } from '@/store'
import { createStorageNodeUrl } from '@/utils/asset'
import { Logger } from '@/utils/logger'

import { AssetUploadWithProgress, InputAssetUpload, StartFileUploadOptions, UploadManagerValue } from './types'

const RETRIES_COUNT = 3
const RETRY_DELAY = 1000
const UPLOADING_SNACKBAR_TIMEOUT = 8000
const UPLOADED_SNACKBAR_TIMEOUT = 13000

type GroupByParentObjectIdAcc = {
  [key: string]: AssetUploadWithProgress[]
}

const UploadManagerContext = React.createContext<UploadManagerValue | undefined>(undefined)
UploadManagerContext.displayName = 'UploadManagerContext'

export const UploadManagerProvider: React.FC = ({ children }) => {
  const navigate = useNavigate()
  const { getStorageProvider, markStorageProviderNotWorking } = useStorageProviders()

  const displaySnackbar = useStore((state) => state.displaySnackbar)
  const addAsset = useStore((state) => state.addAsset)
  const updateAsset = useStore((state) => state.updateAsset)
  const uploadsState = useStore((state) => state.uploadsState)
  const uploadsProgress = useStore((state) => state.uploadsProgress)
  const setUploadsProgress = useStore((state) => state.setUploadsProgress)
  const assetsFiles = useStore((state) => state.assetsFiles)
  const setAssetsFiles = useStore((state) => state.setAssetsFiles)

  // \/ workaround for now to not show completed uploads but not delete them since we may want to show history of uploads in the future
  const [ignoredAssetsIds, setIgnoredAssetsIds] = useState<string[]>([])
  const { activeChannelId } = useUser()
  const { loading: channelLoading } = useChannel(activeChannelId ?? '')
  const { loading: videosLoading } = useVideos(
    {
      where: {
        id_in: uploadsState.filter((item) => item.parentObject?.type === 'video').map((item) => item.parentObject.id),
      },
    },
    { skip: !uploadsState.length }
  )

  const pendingUploadingNotificationsCounts = useRef(0)
  const assetsNotificationsCount = useRef<{
    uploads: {
      [key: string]: number
    }
    uploaded: {
      [key: string]: number
    }
  }>({
    uploads: {},
    uploaded: {},
  })

  // Will set all incomplete assets' status to missing on initial mount
  const isInitialMount = useRef(true)
  useEffect(() => {
    if (!isInitialMount.current) {
      return
    }
    isInitialMount.current = false

    let missingAssetsCount = 0
    uploadsState.forEach((asset) => {
      if (asset.lastStatus !== 'completed') {
        updateAsset(asset.contentId, 'missing')
        missingAssetsCount++
      } else {
        setIgnoredAssetsIds((ignored) => [...ignored, asset.contentId])
      }
    })

    if (missingAssetsCount > 0) {
      displaySnackbar({
        title: `(${missingAssetsCount}) Asset${missingAssetsCount > 1 ? 's' : ''} waiting to resume upload`,
        description: 'Reconnect files to fix the issue',
        actionText: 'See',
        onActionClick: () => navigate(absoluteRoutes.studio.uploads()),
        iconType: 'warning',
      })
    }
  }, [updateAsset, uploadsState, displaySnackbar, navigate])

  const filteredUploadStateWithProgress: AssetUploadWithProgress[] = uploadsState
    .filter((asset) => asset.owner === activeChannelId && !ignoredAssetsIds.includes(asset.contentId))
    .map((asset) => ({
      ...asset,
      progress: uploadsProgress[asset.contentId] ?? 0,
    }))

  // Grouping all assets by parent id (videos, channel)
  const groupedUploadsState = Object.values(
    filteredUploadStateWithProgress.reduce((acc: GroupByParentObjectIdAcc, asset) => {
      if (!asset) {
        return acc
      }
      const key = asset.parentObject.id
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(asset)
      return acc
    }, {})
  )

  const displayUploadingNotification = useRef(
    debounce(() => {
      displaySnackbar({
        title:
          pendingUploadingNotificationsCounts.current > 1
            ? `${pendingUploadingNotificationsCounts.current} assets being uploaded`
            : 'Asset being uploaded',
        iconType: 'info',
        timeout: UPLOADING_SNACKBAR_TIMEOUT,
        actionText: 'See',
        onActionClick: () => navigate(absoluteRoutes.studio.uploads()),
      })
      pendingUploadingNotificationsCounts.current = 0
    }, 700)
  )

  const displayUploadedNotification = useRef(
    debounce((key) => {
      const uploaded = assetsNotificationsCount.current.uploaded[key]
      const uploads = assetsNotificationsCount.current.uploads[key]

      displaySnackbar({
        customId: key,
        title: `${uploaded}/${uploads} assets uploaded`,
        iconType: 'success',
        timeout: UPLOADED_SNACKBAR_TIMEOUT,
        actionText: 'See',
        onActionClick: () => navigate(absoluteRoutes.studio.uploads()),
      })
      if (uploaded === uploads) {
        assetsNotificationsCount.current.uploaded[key] = 0
        assetsNotificationsCount.current.uploads[key] = 0
      }
    }, 700)
  )

  const startFileUpload = useCallback(
    async (file: File | Blob | null, asset: InputAssetUpload, opts?: StartFileUploadOptions) => {
      let storageUrl: string, storageProviderId: string
      try {
        const storageProvider = getStorageProvider()
        if (!storageProvider) {
          return
        }
        storageUrl = storageProvider.url
        storageProviderId = storageProvider.id
      } catch (e) {
        Logger.error('Failed to find storage provider', e)
        return
      }

      Logger.debug(`Uploading to ${storageUrl}`)

      const setAssetUploadProgress = (progress: number) => {
        setUploadsProgress(asset.contentId, progress)
      }
      const fileInState = assetsFiles?.find((file) => file.contentId === asset.contentId)
      if (!fileInState && file) {
        setAssetsFiles({ contentId: asset.contentId, blob: file })
      }

      const assetKey = `${asset.parentObject.type}-${asset.parentObject.id}`

      try {
        rax.attach()
        const assetUrl = createStorageNodeUrl(asset.contentId, storageUrl)
        if (!fileInState && !file) {
          throw Error('File was not provided nor found')
        }
        if (!opts?.isReUpload && file) {
          addAsset({ ...asset, lastStatus: 'inProgress', size: file.size })
        }
        setAssetUploadProgress(0)

        const setUploadProgress = ({ loaded, total }: ProgressEvent) => {
          updateAsset(asset.contentId, 'inProgress')
          setAssetUploadProgress((loaded / total) * 100)
        }

        pendingUploadingNotificationsCounts.current++
        displayUploadingNotification.current()

        assetsNotificationsCount.current.uploads[assetKey] =
          (assetsNotificationsCount.current.uploads[assetKey] || 0) + 1

        await axios.put(assetUrl.toString(), opts?.changeHost ? fileInState?.blob : file, {
          headers: {
            // workaround for a bug in the storage node
            'Content-Type': '',
          },
          raxConfig: {
            retry: RETRIES_COUNT,
            noResponseRetries: RETRIES_COUNT,
            // add 400 to default list of codes to retry
            // seems storage node sometimes fails to calculate the IFPS hash correctly
            // trying again in that case should succeed
            statusCodesToRetry: [
              [100, 199],
              [400, 400],
              [429, 429],
              [500, 599],
            ],
            retryDelay: RETRY_DELAY,
            backoffType: 'static',
            onRetryAttempt: (err) => {
              const cfg = rax.getConfig(err)
              if (cfg?.currentRetryAttempt === 1) {
                updateAsset(asset.contentId, 'reconnecting')
              }
            },
          },
          onUploadProgress: setUploadProgress,
        })

        // Cancel delayed functions that would overwrite asset status back to 'inProgres'

        // TODO: remove assets from the same parent if all finished
        updateAsset(asset.contentId, 'completed')
        setAssetUploadProgress(100)
        assetsNotificationsCount.current.uploaded[assetKey] =
          (assetsNotificationsCount.current.uploaded[assetKey] || 0) + 1
        displayUploadedNotification.current(assetKey)
      } catch (e) {
        Logger.error('Failed to upload to storage provider', { storageUrl, error: e })
        updateAsset(asset.contentId, 'error')
        setAssetUploadProgress(0)

        const axiosError = e as AxiosError
        const networkFailure =
          axiosError.isAxiosError &&
          (!axiosError.response?.status || (axiosError.response.status < 400 && axiosError.response.status >= 500))
        if (networkFailure) {
          markStorageProviderNotWorking(storageProviderId)
        }

        const snackbarDescription = networkFailure ? 'Host is not responding' : 'Unexpected error occurred'
        displaySnackbar({
          title: 'Failed to upload asset',
          description: snackbarDescription,
          actionText: 'Go to uploads',
          onActionClick: () => navigate(absoluteRoutes.studio.uploads()),
          iconType: 'warning',
        })
      }
    },
    [
      addAsset,
      assetsFiles,
      displaySnackbar,
      getStorageProvider,
      markStorageProviderNotWorking,
      navigate,
      setAssetsFiles,
      setUploadsProgress,
      updateAsset,
    ]
  )

  const isLoading = channelLoading || videosLoading

  return (
    <UploadManagerContext.Provider
      value={{
        startFileUpload,
        isLoading,
        uploadsState: groupedUploadsState,
      }}
    >
      {children}
    </UploadManagerContext.Provider>
  )
}

export const useUploadsManager = () => {
  const ctx = useContext(UploadManagerContext)
  if (ctx === undefined) {
    throw new Error('useUploadsManager must be used within a UploadManagerProvider')
  }
  return ctx
}
