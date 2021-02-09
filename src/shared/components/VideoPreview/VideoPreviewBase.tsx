import React, { useState } from 'react'
import {
  AvatarContainer,
  Container,
  CoverContainer,
  InfoContainer,
  MetaContainer,
  TextContainer,
  CoverWrapper,
  ChannelHandle,
  CoverDurationOverlay,
  CoverHoverOverlay,
  CoverImage,
  CoverPlayIcon,
  MetaText,
  ProgressBar,
  ProgressOverlay,
  StyledAvatar,
  TitleHeader,
} from './VideoPreviewBase.styles'
import styled from '@emotion/styled'
import Placeholder from '../Placeholder'
import { formatVideoViewsAndDate } from '@/utils/video'
import { formatDurationShort } from '@/utils/time'
import useResizeObserver from 'use-resize-observer'

type VideoPreviewBaseProps = {
  title?: string
  channelHandle?: string
  channelAvatarUrl?: string | null
  createdAt?: Date
  duration?: number
  // video watch progress in percent (0-100)
  progress?: number
  views?: number | null
  thumbnailUrl?: string
  isLoading?: boolean
  videoHref?: string
  channelHref?: string
  showChannel?: boolean
  showMeta?: boolean
  main?: boolean
  className?: string
  scalingFactor?: number
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
  onChannelClick?: (e: React.MouseEvent<HTMLElement>) => void
  onCoverResize?: (width: number | undefined, height: number | undefined) => void
}

export const MIN_VIDEO_PREVIEW_WIDTH = 300
const MAX_VIDEO_PREVIEW_WIDTH = 600
const MIN_SCALING_FACTOR = 1
const MAX_SCALING_FACTOR = 1.375
// Linear Interpolation, see https://en.wikipedia.org/wiki/Linear_interpolation
const calculateScalingFactor = (videoPreviewWidth: number) =>
  MIN_SCALING_FACTOR +
  ((videoPreviewWidth - MIN_VIDEO_PREVIEW_WIDTH) * (MAX_SCALING_FACTOR - MIN_SCALING_FACTOR)) /
    (MAX_VIDEO_PREVIEW_WIDTH - MIN_VIDEO_PREVIEW_WIDTH)

const VideoPreviewBase: React.FC<VideoPreviewBaseProps> = ({
  title,
  channelHandle,
  channelAvatarUrl,
  createdAt,
  duration,
  progress = 0,
  views,
  thumbnailUrl,
  onCoverResize,
  isLoading = true,
  showChannel = true,
  showMeta = true,
  main = false,
  onChannelClick,
  onClick,
  className,
}) => {
  const [scalingFactor, setScalingFactor] = useState(MIN_SCALING_FACTOR)
  const { ref: imgRef } = useResizeObserver<HTMLImageElement>({
    onResize: (size) => {
      const { width: videoPreviewWidth, height: videoPreviewHeight } = size
      if (onCoverResize) {
        onCoverResize(videoPreviewWidth, videoPreviewHeight)
      }
      if (videoPreviewWidth && !main) {
        setScalingFactor(calculateScalingFactor(videoPreviewWidth))
      }
    },
  })

  const channelClickable = !!onChannelClick

  const handleChannelClick = (e: React.MouseEvent<HTMLElement>) => {
    if (!onChannelClick) {
      return
    }
    e.stopPropagation()
    onChannelClick(e)
  }

  const clickable = !!onClick

  const displayChannel = showChannel && !main

  return (
    <Container main={main} className={className}>
      <CoverWrapper main={main} onClick={onClick}>
        <CoverContainer clickable={clickable}>
          {isLoading ? (
            <CoverPlaceholder />
          ) : (
            <>
              <CoverImage src={thumbnailUrl} ref={imgRef} alt={`${title} by ${channelHandle} thumbnail`} />
              {!!duration && <CoverDurationOverlay>{formatDurationShort(duration)}</CoverDurationOverlay>}
              {!!progress && (
                <ProgressOverlay>
                  <ProgressBar style={{ width: `${progress}%` }} />
                </ProgressOverlay>
              )}
              <CoverHoverOverlay>
                <CoverPlayIcon />
              </CoverHoverOverlay>
            </>
          )}
        </CoverContainer>
      </CoverWrapper>
      <InfoContainer main={main}>
        {displayChannel && (
          <AvatarContainer scalingFactor={scalingFactor}>
            {isLoading ? (
              <Placeholder rounded />
            ) : (
              <StyledAvatar
                handle={channelHandle}
                imageUrl={channelAvatarUrl}
                channelClickable={channelClickable}
                onClick={handleChannelClick}
              />
            )}
          </AvatarContainer>
        )}
        <TextContainer>
          {isLoading ? (
            <Placeholder height={main ? 45 : 18} width="60%" />
          ) : (
            <TitleHeader
              variant="h6"
              main={main}
              scalingFactor={scalingFactor}
              onClick={onClick}
              clickable={Boolean(onClick)}
            >
              {title}
            </TitleHeader>
          )}
          {displayChannel &&
            (isLoading ? (
              <SpacedPlaceholder height="12px" width="60%" />
            ) : (
              <ChannelHandle
                variant="subtitle2"
                channelClickable={channelClickable}
                onClick={handleChannelClick}
                scalingFactor={scalingFactor}
              >
                {channelHandle}
              </ChannelHandle>
            ))}
          {showMeta && (
            <MetaContainer main={main}>
              {isLoading ? (
                <SpacedPlaceholder height={main ? 16 : 12} width={main ? '40%' : '80%'} />
              ) : createdAt ? (
                <MetaText variant="subtitle2" main={main} scalingFactor={scalingFactor}>
                  {formatVideoViewsAndDate(views ?? null, createdAt, { fullViews: main })}
                </MetaText>
              ) : null}
            </MetaContainer>
          )}
        </TextContainer>
      </InfoContainer>
    </Container>
  )
}

const SpacedPlaceholder = styled(Placeholder)`
  margin-top: 6px;
`
const CoverPlaceholder = styled(Placeholder)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

export default VideoPreviewBase
