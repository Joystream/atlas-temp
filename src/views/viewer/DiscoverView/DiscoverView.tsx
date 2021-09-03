import React from 'react'

import { useVideosConnection } from '@/api/hooks'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { GridItem } from '@/shared/components/LayoutGrid'
import { Text } from '@/shared/components/Text'
import { FeaturedVideoCategoryCard, VideoCategoryCard } from '@/shared/components/VideoCategoryCard'

import {
  BorderTextContainer,
  CategoriesContainer,
  FeaturedCategoriesContainer,
  StyledLimitedWidthContainer,
} from './DiscoverView.style'
import { featuredVideoCategories, videoCategories } from './data'

export const DiscoverView: React.FC = () => {
  const { videosConnection } = useVideosConnection({
    first: 0,
  })
  const isMdBreakpoint = useMediaMatch('md')
  return (
    <StyledLimitedWidthContainer big>
      <Text variant="h2">Discover</Text>
      <FeaturedCategoriesContainer>
        {featuredVideoCategories.map((category, i) => (
          <GridItem key={i} colSpan={{ sm: i === 0 ? 2 : 1, xl: 1 }}>
            <FeaturedVideoCategoryCard
              variant={isMdBreakpoint ? 'default' : 'compact'}
              title={category.title}
              videoTitle={category.videoTitle}
              videoUrl={category.videoUrl}
              color={category.color}
              icon={category.icon}
            />
          </GridItem>
        ))}
      </FeaturedCategoriesContainer>
      <BorderTextContainer>
        <Text variant="h4">All categories</Text>
      </BorderTextContainer>
      <CategoriesContainer>
        {Object.values(videoCategories).map((category, i) => (
          <VideoCategoryCard
            key={i}
            title={category.title}
            coverImg={category.coverImg}
            categoryId={category.id}
            color={category.color}
            icon={category.icon}
            videosTotalCount={videosConnection?.totalCount}
            variant={isMdBreakpoint ? 'default' : 'compact'}
          />
        ))}
      </CategoriesContainer>
    </StyledLimitedWidthContainer>
  )
}
