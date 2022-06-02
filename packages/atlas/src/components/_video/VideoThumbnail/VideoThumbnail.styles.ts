import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { cVar, square } from '@/styles'

const sharedOverlayStyles = css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding-top: 56.25%;
  transition: ${cVar('animationTransitionFast')};
`

export type SlotPosition = 'topLeft' | 'topRight' | 'center' | 'bottomLeft' | 'bottomRight'

const getSlotPosition = (slotPosition: SlotPosition) => {
  switch (slotPosition) {
    case 'topLeft':
      return css`
        top: 8px;
        left: 8px;
      `
    case 'topRight':
      return css`
        top: 8px;
        right: 8px;
      `
    case 'center':
      return css`
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      `
    case 'bottomLeft':
      return css`
        bottom: 8px;
        left: 8px;
      `
    case 'bottomRight':
      return css`
        bottom: 8px;
        right: 8px;
      `
  }
}

type SlotsContainerProps = {
  position: SlotPosition
  type?: 'default' | 'hover'
  halfWidth?: boolean
}

export const SlotContainer = styled.div<SlotsContainerProps>`
  position: absolute;
  user-select: none;
  max-width: ${({ halfWidth }) => (halfWidth ? '50%' : 'unset')};
  ${({ position }) => getSlotPosition(position)};

  opacity: ${({ type = 'default' }) => (type === 'hover' ? 0 : 1)};
  transition: opacity ${cVar('animationTransitionFast')};
`

export const ContentOverlay = styled.div`
  ${sharedOverlayStyles};

  position: relative;
  background: ${cVar('colorCoreBaseBlack')};
  transition: transform ${cVar('animationTransitionFast')};
  display: flex;
  justify-content: center;
`

export const ContentContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  ${square('100%')};
`

export const ThumbnailImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  ${square('100%')};

  object-fit: contain;
`

export const ThumbnailBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  ${square('100%')};

  background: ${cVar('colorBackground')};
`

export const SlotsOverlay = styled.div`
  ${sharedOverlayStyles}
`

type HoverOverlayProps = {
  loading?: boolean
}

export const HoverOverlay = styled('div', { shouldForwardProp: (prop) => prop !== 'loading' })<HoverOverlayProps>`
  ${sharedOverlayStyles};

  background: ${({ loading }) => (loading ? 'none ' : cVar('colorBackgroundOverlay'))};
  opacity: 0;
`

type VideoThumbnailContainerProps = {
  clickable: boolean
  activeDisabled: boolean
  isPlaylist: boolean
}

export const PlaylistOverlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  transition: ${cVar('animationTransitionFast')};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${cVar('colorBackgroundOverlay')};
  width: 50%;
`

export const VideoThumbnailContainer = styled(Link, {
  shouldForwardProp: (prop) => !(prop === 'clickable' || prop === 'activeDisabled' || prop === 'isPlaylist'),
})<VideoThumbnailContainerProps>`
  min-width: 166px;
  display: block;
  position: relative;
  background-color: ${cVar('colorCoreBaseBlack')};
  transition: background-color ${cVar('animationTransitionFast')};

  ::before {
    width: 100%;
    height: 100%;
    content: ' ';
    display: block;
    position: absolute;
    transition: all ${cVar('animationTransitionFast')};
    left: 0;
    right: 0;
    margin: 0 auto;
  }

  ::after {
    width: 100%;
    height: 100%;
    content: ' ';
    display: block;
    position: absolute;
    top: 0;
    z-index: -1;
    transition: all ${cVar('animationTransitionFast')};
    left: 0;
    right: 0;
    margin: 0 auto;
  }

  :hover {
    ${({ clickable }) =>
      clickable &&
      css`
        cursor: pointer;

        ${HoverOverlay}, ${SlotContainer} {
          opacity: 1;
        }
      `}
    ${({ clickable, isPlaylist }) =>
      !isPlaylist &&
      clickable &&
      css`
        background-color: ${cVar('colorBackgroundPrimary')};

        ${ContentOverlay}, ${HoverOverlay}, ${SlotsOverlay} {
          transform: translate(-8px, -8px);
        }
      `}
    ${({ clickable, isPlaylist }) =>
      isPlaylist &&
      clickable &&
      css`
        &::before {
          background-color: ${cVar('colorBackgroundPrimary')};
          width: calc(100% - 16px * 2);
        }

        &::after {
          background-color: ${cVar('colorBackgroundPrimaryMuted')};
          transform: translate(0, 8px);
          width: calc(100% - 24px * 2);
        }

        ${ContentOverlay}, ${HoverOverlay}, ${PlaylistOverlay}, ${SlotsOverlay}, {
          transform: translate(0, -8px);
        }
        ${PlaylistOverlay} {
          opacity: 0;
        }
      `}
  }

  ${({ clickable, activeDisabled }) =>
    clickable &&
    !activeDisabled &&
    css`
      :active {
        ${ContentOverlay}, ${HoverOverlay}, ${SlotsOverlay} {
          transform: translate(0, 0);
        }
      }
    `}
`

export const ThumbnailSkeletonLoader = styled(SkeletonLoader)`
  ${square('100%')}

  position: absolute;
  top: 0;
  left: 0;
`
