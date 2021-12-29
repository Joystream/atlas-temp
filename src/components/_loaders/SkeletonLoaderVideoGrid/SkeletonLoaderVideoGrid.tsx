import React from 'react'

import { Grid } from '@/components/Grid'
import { VideoTile } from '@/components/_video/VideoTile_deprecated'

type SkeletonLoaderVideoGridProps = {
  videosCount?: number
}
export const SkeletonLoaderVideoGrid: React.FC<SkeletonLoaderVideoGridProps> = ({ videosCount = 10 }) => {
  return (
    <Grid>
      {Array.from({ length: videosCount }).map((_, idx) => (
        <VideoTile key={idx} />
      ))}
    </Grid>
  )
}
