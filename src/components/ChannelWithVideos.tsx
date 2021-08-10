import styled from '@emotion/styled'
import React, { FC, useState } from 'react'

import { GetVideosConnectionDocument, GetVideosConnectionQuery, GetVideosConnectionQueryVariables } from '@/api/queries'
import { useInfiniteGrid } from '@/components/InfiniteGrids/useInfiniteGrid'
import { VideoTile } from '@/components/VideoTile'
import { Grid } from '@/shared/components'
import { sizes } from '@/shared/theme'

import { TempChannelCard } from './TempChannelCard'

type ChannelWithVideosProps = {
  channelId?: string
}

const INITIAL_VIDEOS_PER_ROW = 4
const INITAL_ROWS = 1

export const ChannelWithVideos: FC<ChannelWithVideosProps> = ({ channelId }) => {
  const [videosPerRow, setVideosPerRow] = useState(INITIAL_VIDEOS_PER_ROW)
  const { displayedItems, placeholdersCount } = useInfiniteGrid<
    GetVideosConnectionQuery,
    GetVideosConnectionQuery['videosConnection'],
    GetVideosConnectionQueryVariables
  >({
    query: GetVideosConnectionDocument,
    isReady: !!channelId,
    skipCount: 0,
    queryVariables: {
      where: {
        channelId_eq: channelId,
        isPublic_eq: true,
        isCensored_eq: false,
      },
    },
    targetRowsCount: INITAL_ROWS,
    dataAccessor: (rawData) => rawData?.videosConnection,
    itemsPerRow: videosPerRow,
  })

  const placeholderItems = Array.from({ length: placeholdersCount }, () => ({ id: undefined }))
  const gridContent = (
    <>
      {[...displayedItems, ...placeholderItems]?.map((video, idx) => (
        <VideoTile id={video.id} key={`channels-with-videos-${idx}`} showChannel />
      ))}
    </>
  )

  return (
    <>
      <StyledChannelCard id={channelId} variant="secondary" />
      <Grid onResize={(sizes) => setVideosPerRow(sizes.length)}>{gridContent}</Grid>
    </>
  )
}

export const StyledChannelCard = styled(TempChannelCard)`
  margin-bottom: ${sizes(10)};
`
