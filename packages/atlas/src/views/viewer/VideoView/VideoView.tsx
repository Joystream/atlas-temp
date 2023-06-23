import { generateVideoMetaTags } from '@joystream/atlas-meta-server/src/tags'
import BN from 'bn.js'
import { format } from 'date-fns'
import { throttle } from 'lodash-es'
import { FC, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { useParams } from 'react-router-dom'

import { useAddVideoView, useFullVideo } from '@/api/hooks/video'
import { SvgActionFlag, SvgActionMore, SvgActionShare } from '@/assets/icons'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { MinimizedPlayer } from '@/components/MinimizedPlayer/MinimizedPlayer'
import { NumberFormat } from '@/components/NumberFormat'
import { Tooltip } from '@/components/Tooltip'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { Button } from '@/components/_buttons/Button'
import { ChannelLink } from '@/components/_channel/ChannelLink'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { NftWidget, useNftWidget } from '@/components/_nft/NftWidget'
import { ContextMenu } from '@/components/_overlays/ContextMenu'
import { ReportModal } from '@/components/_overlays/ReportModal'
import { AvailableTrack } from '@/components/_video/VideoPlayer/SettingsButtonWithPopover'
import { atlasConfig } from '@/config'
import { displayCategories } from '@/config/categories'
import { useDisplaySignInDialog } from '@/hooks/useDisplaySignInDialog'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useNftTransactions } from '@/hooks/useNftTransactions'
import { useReactionTransactions } from '@/hooks/useReactionTransactions'
import useAnalytics from '@/hooks/useSegmentAnalytics'
import { useVideoStartTimestamp } from '@/hooks/useVideoStartTimestamp'
import { VideoReaction } from '@/joystream-lib/types'
import { useFee } from '@/providers/joystream/joystream.hooks'
import { useNftActions } from '@/providers/nftActions/nftActions.hooks'
import { useOverlayManager } from '@/providers/overlayManager'
import { usePersonalDataStore } from '@/providers/personalData'
import { useUser } from '@/providers/user/user.hooks'
import { transitions } from '@/styles'
import { SentryLogger } from '@/utils/logs'
import { formatDate } from '@/utils/time'

import { CommentsSection } from './CommentsSection'
import { MoreVideos } from './MoreVideos'
import { VideoDetails } from './VideoDetails'
import { VideoUnavailableError } from './VideoUnavailableError'
import {
  BlockedVideoGradientPlaceholder,
  BlockedVideoPlaceholder,
  ButtonsContainer,
  ChannelContainer,
  Meta,
  PlayerContainer,
  PlayerGridItem,
  PlayerGridWrapper,
  PlayerSkeletonLoader,
  PlayerWrapper,
  StyledReactionStepper,
  TitleContainer,
  TitleText,
  VideoUtils,
} from './VideoView.styles'

export const VideoView: FC = () => {
  const { id } = useParams()
  const { memberId, signIn, isLoggedIn } = useUser()
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [reactionFee, setReactionFee] = useState<BN | undefined>()
  const { openSignInDialog } = useDisplaySignInDialog({ interaction: true })
  const { openNftPutOnSale, openNftAcceptBid, openNftChangePrice, openNftPurchase, openNftSettlement, cancelNftSale } =
    useNftActions()
  const reactionPopoverDismissed = usePersonalDataStore((state) => state.reactionPopoverDismissed)
  const { loading, video, error } = useFullVideo(
    id ?? '',
    {
      onError: (error) => SentryLogger.error('Failed to load video data', 'VideoView', error),
    },
    // cancel video filters - if video is accessed directly with a link allowed it to be unlisted, and have un-uploaded assets
    {
      where: {
        isPublic_eq: undefined,
        thumbnailPhoto: {
          isAccepted_eq: undefined,
        },
        media: {
          isAccepted_eq: undefined,
        },
      },
    }
  )
  const [isInView, ref] = useIntersectionObserver()
  const [videoReactionProcessing, setVideoReactionProcessing] = useState(false)
  const [isCommenting, setIsCommenting] = useState<boolean>(false)
  const nftWidgetProps = useNftWidget(video)
  const { likeOrDislikeVideo } = useReactionTransactions()
  const { withdrawBid } = useNftTransactions()
  const { videoViewed, likeAdded, dislikeAdded } = useAnalytics()

  const mdMatch = useMediaMatch('md')
  const { addVideoView } = useAddVideoView()
  const {
    watchedVideos,
    cinematicView,
    actions: { updateWatchedVideos },
  } = usePersonalDataStore((state) => state)
  const videoCategory = video?.category ? video.category.id : null
  const belongsToCategories = videoCategory
    ? displayCategories.filter((category) => category.videoCategories.includes(videoCategory))
    : null

  const { anyOverlaysOpen } = useOverlayManager()
  const { ref: playerRef, inView: isPlayerInView } = useInView()
  const pausePlayNext = anyOverlaysOpen || !isPlayerInView || isCommenting

  const mediaUrl = video?.media?.resolvedUrl
  const thumbnailUrl = video?.thumbnailPhoto?.resolvedUrl
  const availableTracks = useMemo(() => {
    if (!video?.subtitles) return []

    return video.subtitles
      .filter((subtitle) => !!subtitle.asset && subtitle.asset?.resolvedUrl)
      .map((subtitle) => {
        const resolvedLanguageName = atlasConfig.derived.languagesLookup[subtitle.language || '']
        const url = subtitle.asset?.resolvedUrl
        return {
          label: subtitle.type === 'subtitles' ? resolvedLanguageName : `${resolvedLanguageName} (CC)`,
          language: subtitle.type === 'subtitles' ? subtitle.language : `${subtitle.language}-cc`,
          src: url,
        }
      })
      .filter((subtitles): subtitles is AvailableTrack => !!subtitles.language && !!subtitles.label && !!subtitles.src)
  }, [video?.subtitles])

  const videoMetaTags = useMemo(() => {
    if (!video || !thumbnailUrl) return {}
    return generateVideoMetaTags(
      video,
      thumbnailUrl,
      atlasConfig.general.appName,
      window.location.origin,
      atlasConfig.general.appTwitterId
    )
  }, [video, thumbnailUrl])
  const headTags = useHeadTags(video?.title, videoMetaTags)

  const [isShareDialogOpen, setShareDialogOpen] = useState(false)

  const savedVideoTimestamp = watchedVideos?.find((v) => v.id === video?.id)?.timestamp
  const startTimestamp = useVideoStartTimestamp(video?.duration, savedVideoTimestamp)

  const channelId = video?.channel?.id
  const channelName = video?.channel?.title
  const videoId = video?.id
  const numberOfLikes = video?.reactions.filter(({ reaction }) => reaction === 'LIKE').length
  const numberOfDislikes = video?.reactions.filter(({ reaction }) => reaction === 'UNLIKE').length
  const videoNotAvailable = !loading && !video

  const reactionStepperState = useMemo(() => {
    if (!video) {
      return 'loading'
    }
    if (videoReactionProcessing) {
      return 'processing'
    }
    const myReaction = video?.reactions.find(({ member: { id } }) => id === memberId)
    if (myReaction) {
      if (myReaction.reaction === 'LIKE') {
        return 'liked'
      }
      if (myReaction.reaction === 'UNLIKE') {
        return 'disliked'
      }
    }
    return 'default'
  }, [memberId, videoReactionProcessing, video])

  // Save the video timestamp
  // disabling eslint for this line since debounce is an external fn and eslint can't figure out its args, so it will complain.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleTimeUpdate = useCallback(
    throttle((time) => {
      if (video?.id) {
        updateWatchedVideos('INTERRUPTED', video.id, time)
      }
    }, 5000),
    [video?.id]
  )

  const handleVideoEnd = useCallback(() => {
    if (video?.id) {
      handleTimeUpdate.cancel()
      updateWatchedVideos('COMPLETED', video?.id)
    }
  }, [video?.id, handleTimeUpdate, updateWatchedVideos])

  const { getTxFee: getReactionFee } = useFee('reactToVideoTx')

  const handleCalculateFeeForPopover = async (reaction: VideoReaction) => {
    if (!memberId || !video?.id) return
    const fee = await getReactionFee([memberId, video?.id, reaction])
    setReactionFee(fee)
  }

  const handleReact = useCallback(
    async (reaction: VideoReaction) => {
      if (!isLoggedIn) {
        openSignInDialog({ onConfirm: signIn })
        return false
      } else if (video?.id) {
        setVideoReactionProcessing(true)
        const fee = reactionFee || (await getReactionFee([memberId || '', video?.id, reaction]))
        const reacted = await likeOrDislikeVideo(video.id, reaction, video.title, fee)
        reaction === 'like' ? likeAdded(video.id, memberId ?? 'no data') : dislikeAdded(video.id, memberId ?? 'no data')
        setVideoReactionProcessing(false)
        return reacted
      }
      return false
    },
    [getReactionFee, isLoggedIn, likeOrDislikeVideo, memberId, openSignInDialog, reactionFee, signIn, video]
  )

  // use Media Session API to provide rich metadata to the browser
  useEffect(() => {
    const supported = 'mediaSession' in navigator
    if (!supported || !video) {
      return
    }

    const artwork: MediaImage[] = thumbnailUrl ? [{ src: thumbnailUrl, type: 'image/webp', sizes: '640x360' }] : []

    navigator.mediaSession.metadata = new MediaMetadata({
      title: video.title || '',
      artist: video.channel.title || '',
      album: '',
      artwork: artwork,
    })

    return () => {
      navigator.mediaSession.metadata = null
    }
  }, [thumbnailUrl, video])

  const handleShare = () => {
    setShareDialogOpen(true)
  }

  const handleAddVideoView = useCallback(() => {
    if (!videoId || !channelId) {
      return
    }
    addVideoView({
      variables: {
        videoId,
      },
    }).catch((error) => {
      SentryLogger.error('Failed to increase video views', 'VideoView', error)
    })

    videoViewed(
      video?.id ?? 'no data',
      video?.channel.id ?? 'no data',
      video?.channel.title ?? 'no data',
      video?.description ?? 'no data',
      !!nftWidgetProps
    )
  }, [addVideoView, channelId, videoId])

  if (error) {
    return <ViewErrorFallback />
  }

  const isCinematic = cinematicView || !mdMatch
  const sideItems = (
    <GridItem colSpan={{ xxs: 12, md: 4 }}>
      {videoNotAvailable
        ? mdMatch && (
            <>
              {!cinematicView && <BlockedVideoPlaceholder />}
              <BlockedVideoGradientPlaceholder />
            </>
          )
        : !!nftWidgetProps && (
            <NftWidget
              {...nftWidgetProps}
              onNftPutOnSale={() => id && openNftPutOnSale(id)}
              onNftCancelSale={() => id && nftWidgetProps.saleType && cancelNftSale(id, nftWidgetProps.saleType)}
              onNftAcceptBid={() => id && openNftAcceptBid(id)}
              onNftChangePrice={() => id && openNftChangePrice(id)}
              onNftPurchase={() => id && openNftPurchase(id)}
              onNftSettlement={() => id && openNftSettlement(id)}
              onNftBuyNow={() => id && openNftPurchase(id, { fixedPrice: true })}
              onWithdrawBid={(bid, createdAt) => id && createdAt && bid && withdrawBid(id, bid, createdAt)}
            />
          )}
      <MoreVideos channelId={channelId} channelName={channelName} videoId={id} type="channel" />
      {belongsToCategories?.map((category) => (
        <MoreVideos
          key={category.id}
          categoryId={category?.id}
          categoryName={category.name}
          videoId={id}
          type="category"
        />
      ))}
    </GridItem>
  )

  const detailsItems = videoNotAvailable ? (
    mdMatch && <BlockedVideoGradientPlaceholder />
  ) : (
    <>
      <TitleContainer>
        {video ? (
          <TitleText as="h1" variant={mdMatch ? 'h500' : 'h400'}>
            {video.title}
          </TitleText>
        ) : (
          <SkeletonLoader height={mdMatch ? 56 : 32} width={400} />
        )}
        <VideoUtils>
          <Meta as="span" variant={mdMatch ? 't300' : 't100'} color="colorText">
            {video ? (
              <>
                <Tooltip
                  placement="top-start"
                  offsetY={8}
                  delay={[1000, null]}
                  text={`${formatDate(video.createdAt)} at ${format(video.createdAt, 'HH:mm')}`}
                >
                  {formatDate(video.createdAt)}
                </Tooltip>{' '}
                • <NumberFormat as="span" format="full" value={video.viewsNum} color="colorText" /> views
              </>
            ) : (
              <SkeletonLoader height={24} width={200} />
            )}
          </Meta>
          <StyledReactionStepper
            reactionPopoverDismissed={reactionPopoverDismissed || !isLoggedIn}
            onReact={handleReact}
            fee={reactionFee}
            onCalculateFee={handleCalculateFeeForPopover}
            state={reactionStepperState}
            likes={numberOfLikes}
            dislikes={numberOfDislikes}
          />
          <ButtonsContainer>
            <Button variant="tertiary" icon={<SvgActionShare />} onClick={handleShare}>
              Share
            </Button>
            <ContextMenu
              placement="bottom-end"
              items={[
                {
                  onClick: () => setShowReportDialog(true),
                  label: 'Report video',
                  nodeStart: <SvgActionFlag />,
                },
              ]}
              trigger={<Button icon={<SvgActionMore />} variant="tertiary" size="medium" />}
            />
            {video?.id && (
              <ReportModal
                show={showReportDialog}
                onClose={() => setShowReportDialog(false)}
                entityId={video?.id}
                type="video"
              />
            )}
          </ButtonsContainer>
        </VideoUtils>
      </TitleContainer>
      <ChannelContainer>
        <ChannelLink followButton id={channelId} textVariant="h300" avatarSize={40} />
      </ChannelContainer>
      <VideoDetails video={video} categoryData={belongsToCategories} />
    </>
  )

  return (
    <>
      {headTags}
      <PlayerGridWrapper cinematicView={isCinematic}>
        <PlayerWrapper cinematicView={isCinematic}>
          <PlayerGridItem colSpan={{ xxs: 12, md: cinematicView ? 12 : 8 }}>
            <PlayerContainer
              ref={ref}
              className={transitions.names.slide}
              cinematicView={cinematicView}
              noVideo={videoNotAvailable}
            >
              {videoNotAvailable ? (
                <VideoUnavailableError isCinematic={isCinematic} />
              ) : !loading && video ? (
                <MinimizedPlayer
                  author={video.channel.title}
                  title={video.title}
                  isInView={isInView}
                  onCloseShareDialog={() => setShareDialogOpen(false)}
                  onAddVideoView={handleAddVideoView}
                  isShareDialogOpen={isShareDialogOpen}
                  isVideoPending={!video?.media?.isAccepted}
                  videoId={video?.id}
                  autoplay
                  src={mediaUrl}
                  onEnd={handleVideoEnd}
                  onTimeUpdated={handleTimeUpdate}
                  startTime={startTimestamp}
                  isPlayNextDisabled={pausePlayNext}
                  ref={playerRef}
                  availableTextTracks={availableTracks}
                />
              ) : (
                <PlayerSkeletonLoader />
              )}
            </PlayerContainer>
            {!isCinematic && (
              <>
                {detailsItems}
                {!videoNotAvailable && (
                  <CommentsSection
                    video={video}
                    videoLoading={loading}
                    disabled={video ? !video?.isCommentSectionEnabled : undefined}
                    onCommentInputFocus={setIsCommenting}
                  />
                )}
              </>
            )}
          </PlayerGridItem>
          {!isCinematic && sideItems}
        </PlayerWrapper>
      </PlayerGridWrapper>
      <LimitedWidthContainer>
        {isCinematic && !(!mdMatch && videoNotAvailable) && (
          <LayoutGrid>
            <GridItem className={transitions.names.slide} colSpan={{ xxs: 12, md: cinematicView ? 8 : 12 }}>
              {detailsItems}
              {!videoNotAvailable && (
                <CommentsSection
                  video={video}
                  videoLoading={loading}
                  disabled={video ? !video?.isCommentSectionEnabled : undefined}
                  onCommentInputFocus={setIsCommenting}
                />
              )}
            </GridItem>
            {sideItems}
          </LayoutGrid>
        )}
      </LimitedWidthContainer>
    </>
  )
}

const useIntersectionObserver = (options: IntersectionObserverInit = {}): [boolean, RefObject<HTMLDivElement>] => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsIntersecting(entry.isIntersecting), options)

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [options])

  return [isIntersecting, ref]
}
