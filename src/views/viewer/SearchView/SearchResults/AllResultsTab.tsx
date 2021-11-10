import styled from '@emotion/styled'
import React from 'react'

import { BasicChannelFieldsFragment, VideoFieldsFragment } from '@/api/queries'
import { SkeletonLoader } from '@/components/SkeletonLoader'
import { Text } from '@/components/Text'
import { ChannelGallery } from '@/components/_channel/ChannelGallery'
import { VideoGallery } from '@/components/_video/VideoGallery'
import { sizes } from '@/theme'

type AllResultsTabProps = {
  videos: VideoFieldsFragment[]
  channels: BasicChannelFieldsFragment[]
  loading: boolean
}

export const AllResultsTab: React.FC<AllResultsTabProps> = ({ videos: allVideos, channels, loading }) => {
  return (
    <>
      {(allVideos.length > 0 || loading) && (
        <div>
          {loading ? (
            <SkeletonLoader width={200} height={16} bottomSpace={18} />
          ) : (
            <SectionHeader variant="h5">Videos</SectionHeader>
          )}
          <VideoGallery videos={allVideos} loading={loading} />
        </div>
      )}
      {(channels.length > 0 || loading) && (
        <div>
          {loading ? (
            <SkeletonLoader width={200} height={16} bottomSpace={18} />
          ) : (
            <SectionHeader variant="h5">Channels</SectionHeader>
          )}
          <ChannelGallery channels={channels} loading={loading} />
        </div>
      )}
    </>
  )
}

const SectionHeader = styled(Text)`
  margin: 0 0 ${sizes(4)};
`
