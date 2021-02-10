import React from 'react'
import styled from '@emotion/styled'
import { ErrorBoundary } from '@sentry/react'
import { usePersonalData } from '@/hooks'
import { sub } from 'date-fns'
import { ErrorFallback, CoverVideo, InfiniteVideoGrid, InterruptedVideosGallery, ViewWrapper } from '@/components'
import useVideosConnection from '@/api/hooks/videosConnection'
import { transitions } from '@/shared/theme'

const MIN_FOLLOWED_CHANNELS_VIDEOS = 16
// last three months
const MIN_DATE_FOLLOWED_CHANNELS_VIDEOS = sub(new Date(), { months: 3 })

const HomeView: React.FC = () => {
  const {
    state: { followedChannels },
  } = usePersonalData()

  const channelIdIn = followedChannels.map((channel) => channel.id)
  const followingAnyChannels = channelIdIn.length > 0

  const { videosConnection, loading, error } = useVideosConnection(
    {
      channelIdIn,
      createdAtGte: MIN_DATE_FOLLOWED_CHANNELS_VIDEOS,
    },
    { skip: !followingAnyChannels }
  )

  const followedChannelsVideosCount = videosConnection?.totalCount
  const shouldShowFollowedChannels =
    followedChannelsVideosCount && followedChannelsVideosCount > MIN_FOLLOWED_CHANNELS_VIDEOS

  if (error) {
    throw error
  }
  return (
    <ViewWrapper>
      <CoverVideo />
      <Container className={transitions.names.slide}>
        <InterruptedVideosGallery />
        <ErrorBoundary fallback={ErrorFallback}>
          <StyledInfiniteVideoGrid
            title={shouldShowFollowedChannels ? 'Recent Videos From Followed Channels' : 'Recent Videos'}
            channelIdIn={shouldShowFollowedChannels ? channelIdIn : null}
            createdAtGte={shouldShowFollowedChannels ? MIN_DATE_FOLLOWED_CHANNELS_VIDEOS : null}
            ready={!loading || !followingAnyChannels}
          />
        </ErrorBoundary>
      </Container>
    </ViewWrapper>
  )
}

const Container = styled.div`
  position: relative;
  & > * {
    margin-bottom: 3rem;
  }
`

const StyledInfiniteVideoGrid = styled(InfiniteVideoGrid)`
  margin: 0;
  padding-bottom: 4rem;
`

export default HomeView
