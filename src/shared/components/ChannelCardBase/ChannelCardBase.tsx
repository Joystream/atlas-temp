import React from 'react'

import { absoluteRoutes } from '@/config/routes'
import { formatNumberShort } from '@/utils/number'

import {
  ChannelCardAnchor,
  ChannelCardArticle,
  ChannelCardWrapper,
  ChannelFollows,
  ChannelTitle,
  FollowButton,
  InfoWrapper,
  RankingNumber,
  StyledAvatar,
} from './ChannelCardBase.style'

import { SkeletonLoader } from '../SkeletonLoader'

export type ChannelCardBaseProps = {
  id?: string | null
  rankingNumber?: number
  isLoading?: boolean
  title?: string | null
  follows?: number | null
  avatarUrl?: string | null
  isFollowing?: boolean
  onFollow?: (event: React.MouseEvent) => void
  className?: string
  onClick?: () => void
}

export const ChannelCardBase: React.FC<ChannelCardBaseProps> = ({
  id,
  rankingNumber,
  isLoading,
  title,
  follows,
  avatarUrl,
  isFollowing,
  onFollow,
  className,
  onClick,
}) => {
  const loading = isLoading || id === undefined
  const hasRanking = !!rankingNumber
  return (
    <ChannelCardWrapper className={className} hasRanking={hasRanking}>
      <ChannelCardArticle>
        {hasRanking && <RankingNumber>{rankingNumber}</RankingNumber>}
        {loading ? (
          <SkeletonLoader height="240px" width="300px" />
        ) : (
          <ChannelCardAnchor onClick={onClick} to={absoluteRoutes.viewer.channel(id || '')}>
            <StyledAvatar size="channel-card" loading={loading} assetUrl={avatarUrl} />
            <InfoWrapper>
              {loading ? (
                <SkeletonLoader width="120px" height="20px" bottomSpace="4px" />
              ) : (
                <ChannelTitle variant="h6">{title}</ChannelTitle>
              )}
              {loading ? (
                <SkeletonLoader width="80px" height="20px" bottomSpace="8px" />
              ) : (
                <ChannelFollows variant="body2" secondary>
                  {formatNumberShort(follows || 0)} followers
                </ChannelFollows>
              )}
              {loading ? (
                <SkeletonLoader width="90px" height="40px" />
              ) : (
                <FollowButton variant="secondary" size="small" onClick={onFollow}>
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </FollowButton>
              )}
            </InfoWrapper>
          </ChannelCardAnchor>
        )}
      </ChannelCardArticle>
    </ChannelCardWrapper>
  )
}
