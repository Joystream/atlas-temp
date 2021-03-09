import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { useVideos, useVideosConnection } from '@/api/hooks'
import { VideoPreview } from '@/components'
import { useDrafts } from '@/hooks'
import { Grid, Pagination, Tabs, DismissibleMessage } from '@/shared/components'
import { colors, sizes } from '@/shared/theme'
import ActionBarMyVideos from './ActionBarMyVideos'
import { StyledText, ViewContainer } from './MyVideos.styles'

const tabs = ['All Videos', 'Published', 'Drafts', 'Unlisted']

const testChannelId = '100'
const INITIAL_VIDEOS_PER_ROW = 4
// not yet doable
// TODO: adjust action bar to the real fee
// TODO: Unlisted videos
// TODO: on edit video callbacks
// TODO: on delete video callbacks
// TODO: dynamic channels (not hardcoded)
// TODO: No videos screen (this was deleted from figma??)
// doable
// TODO: add total video count to the useVideos hook
// TODO: how is the action bar supossed to work?
export const MyVideosView = () => {
  const [videosPerRow, setVideosPerRow] = useState(INITIAL_VIDEOS_PER_ROW)
  // Drafts calls can run into race conditions
  const { drafts, removeDraft, removeAllDrafts, addDraft } = useDrafts('video', testChannelId)
  const [currentTab, setCurrentTab] = useState(0)
  const { currentPage, setCurrentPage } = usePagination(currentTab)
  const { selectedVideosIds, setselectedVideosIds, deselectVideos } = useVideoSelection(currentTab)

  // we need the total video count from somewhere
  const { videosConnection, loading: loadingVideosConnection, error: errorVideosConnection } = useVideosConnection({
    channelId: testChannelId,
  })
  const videosPerPage = 2 * videosPerRow
  const { loading, videos, error, fetchMore } = useVideos(
    {
      limit: videosPerPage,
      offset: videosPerPage * (currentPage - 1),
      channelId: testChannelId,
    },
    {
      // notifyOnNetworkStatusChange: true,
      nextFetchPolicy: 'cache-first',
    }
  )

  // hook to tests draft should be deleted before final
  useEffect(() => {
    const createDrafts = async () => {
      await removeAllDrafts()
      for (let i = 0; i < 32; i++) {
        await addDraft({
          channelId: testChannelId,
          title: i.toString(),
          // title: Math.random().toString(36),
          description: 'string',
          isPublic: true,
          hasMarketing: false,
          isExplicit: false,
        })
      }
    }
    createDrafts()
    return () => {
      removeAllDrafts()
    }
  }, [])

  const currentTabName = tabs[currentTab]
  const isDraftTab = currentTabName === 'Drafts'
  const isLoading = loading || (videos?.length === 0 && (videosConnection?.totalCount ?? 0) > 0)
  const isActionBarActive = selectedVideosIds.length > 0
  const placeholderItems = Array.from({ length: isLoading ? videosPerPage : 0 }, () => ({
    id: undefined,
    progress: undefined,
  }))
  const videosWPlaceholders = [...(videos || []), ...placeholderItems]
  // console.log({
  //   videosWPlaceholders,
  //   drafts,
  //   placeholderItems,
  //   videos,
  //   loading,
  //   isLoading,
  //   error,
  //   currentTabName,
  //   currentPage,
  // })

  const handleVideoSelect = (id: string, isSelected: boolean) => {
    if (selectedVideosIds.includes(id)) {
      setselectedVideosIds(selectedVideosIds.filter((_id) => _id !== id))
    } else {
      setselectedVideosIds([...selectedVideosIds, id])
    }
  }
  const handleOnResizeGrid = (sizes: number[]) => setVideosPerRow(sizes.length)
  const handleDeselect = () => deselectVideos()
  const handleDelete = () => {
    if (isDraftTab) {
      removeDraft(selectedVideosIds)
      handleDeselect()
    }
  }
  return (
    <ViewContainer>
      <StyledText variant="h2">My Videos</StyledText>
      <TabsContainer>
        <Tabs initialIndex={0} tabs={tabs} onSelectTab={setCurrentTab} />
      </TabsContainer>
      {isDraftTab && (
        // Should this really be dismissable?
        <StyledDismissibleMessage
          id="video-draft-saved-locally-warning"
          title={'Video Drafts are saved locally'}
          description={
            'This mean you can only access one on the device you used to create it. Clearing your browser history will delete all your drafts.'
          }
        />
      )}
      {currentTabName !== 'Drafts' && (
        <Grid onResize={handleOnResizeGrid}>
          {videosWPlaceholders
            // this makes for a smoother transition between pages
            .slice(0, videosPerPage)
            .map((video, idx) => (
              <VideoPreview
                key={idx + '-' + currentTabName + '-' + currentPage}
                id={video.id}
                showChannel={false}
                isLoading={loading}
                publisherMode
                isSelected={!!video.id && selectedVideosIds.includes(video.id)}
                isAnyVideoSelected={selectedVideosIds.length > 0}
                onSelectClick={(isSelected) => {
                  video.id && handleVideoSelect(video.id, isSelected)
                }}
              />
            ))}
        </Grid>
      )}
      {isDraftTab && (
        <Grid onResize={handleOnResizeGrid}>
          {drafts
            // pagination slice
            .slice(videosPerPage * (currentPage - 1), (currentPage - 1) * videosPerPage + videosPerPage)
            .map((draft, idx) => (
              <VideoPreview
                key={idx + '-' + currentTabName + '-' + currentPage}
                id={draft.id}
                showChannel={false}
                publisherMode
                videoPublishState="draft"
                isSelected={selectedVideosIds.includes(draft.id)}
                isAnyVideoSelected={selectedVideosIds.length > 0}
                onSelectClick={(isSelected) => {
                  draft.id && handleVideoSelect(draft.id, isSelected)
                }}
                onEditVideoClick={() => ({})}
                onDeleteVideoClick={() => {
                  removeDraft(draft.id)
                }}
              />
            ))}
        </Grid>
      )}
      <PaginationContainer extraPaddingBottom={isActionBarActive}>
        <Pagination
          onChangePage={(page) => {
            setCurrentPage(page)
          }}
          onMouseEnterPage={(page) => {
            currentTabName !== 'Drafts' &&
              fetchMore({
                variables: {
                  // substract 1 coz offset index starts at 0
                  offset: videosPerPage * (page - 1),
                  limit: videosPerPage,
                },
              })
          }}
          page={currentPage}
          itemsPerPage={videosPerPage}
          totalCount={isDraftTab ? drafts.length : videosConnection?.totalCount}
        ></Pagination>
      </PaginationContainer>
      {isActionBarActive && (
        <ActionBarMyVideos
          videosSelectedCount={selectedVideosIds.length}
          fee={isDraftTab ? 0 : 0.2} // fake fee for now
          onDelete={handleDelete}
          onCancel={handleDeselect}
          onDeselect={handleDeselect}
        />
      )}
    </ViewContainer>
  )
}

export default MyVideosView

const usePagination = (currentTab: number) => {
  const [currentPage, setCurrentPage] = useState(1)
  // reset the pagination when changing tabs
  useEffect(() => {
    setCurrentPage(1)
  }, [currentTab])
  return { currentPage, setCurrentPage }
}

const useVideoSelection = (currentTab: number) => {
  const [selectedVideosIds, setselectedVideosIds] = useState<string[]>([])
  const deselectVideos = () => setselectedVideosIds([])
  // reset the video selection when changing tabs
  useEffect(() => {
    setselectedVideosIds([])
  }, [currentTab])
  return { selectedVideosIds, setselectedVideosIds, deselectVideos }
}

const TabsContainer = styled.div`
  padding-top: ${sizes(8)};
  margin-bottom: ${sizes(8)};
  border-bottom: solid 1px ${colors.gray[800]};
`

type PaginationContainerProps = { extraPaddingBottom?: boolean }
const PaginationContainer = styled.div<PaginationContainerProps>`
  padding-top: ${sizes(6)};
  padding-bottom: ${({ extraPaddingBottom }) => (extraPaddingBottom ? sizes(24) : sizes(16))};
  display: flex;
  align-items: center;
  justify-content: center;
`

const StyledDismissibleMessage = styled(DismissibleMessage)`
  margin-bottom: ${sizes(8)};
`
