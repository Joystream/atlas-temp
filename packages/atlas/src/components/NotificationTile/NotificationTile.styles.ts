import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { cVar, sizes } from '@/styles'

type Variant = 'default' | 'compact'

type NotificationWrapperProps = {
  read?: boolean
  selected?: boolean
  loading?: boolean
  variant: Variant
}

const getNotificationWrapperStyles = ({ read, selected, loading, variant }: NotificationWrapperProps) => {
  if (selected) {
    return css`
      background-color: ${cVar('colorBackgroundElevated')};
    `
  }
  if (!read) {
    return css`
      background-color: ${variant === 'default' ? cVar('colorBackground') : cVar('colorBackgroundMutedAlpha')};

      :hover {
        background-color: ${cVar('colorBackgroundStrong')};
      }
    `
  }
  if (loading) {
    return
  }

  return css`
    background-color: ${variant === 'default' ? cVar('colorBackgroundMuted') : 'transparent'};

    :hover {
      background-color: ${cVar('colorBackground')};
    }
  `
}

const getReadNotificationVariant = ({ read, variant }: NotificationWrapperProps) =>
  !read &&
  css`
    ::after {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      width: ${variant === 'default' ? 4 : 2}px;
      height: 100%;
      background-color: ${cVar('colorBackgroundPrimary')};
    }
  `

const shouldForwardWrapperProps = (prop: PropertyKey) => prop !== 'loading' && prop !== 'read'

export const Wrapper = styled('div', { shouldForwardProp: shouldForwardWrapperProps })<NotificationWrapperProps>`
  ${getNotificationWrapperStyles};
  ${getReadNotificationVariant};

  display: flex;
  align-items: center;
  position: relative;
  padding: ${({ variant }) => (variant === 'default' ? sizes(4) : `${sizes(2)} ${sizes(4)}`)};
  padding-left: ${({ variant }) => variant === 'default' && sizes(5)};
  transition: background-color ${cVar('animationTransitionFast')};
`

export const Title = styled.div`
  margin-bottom: ${sizes(0.5)};
`

type AvatarWrapperProps = {
  tileVariant: Variant
}

export const AvatarWrapper = styled.div<AvatarWrapperProps>`
  margin: 0 ${sizes(4)};
  margin-left: ${({ tileVariant }) => sizes(tileVariant === 'default' ? 4 : 0)};
  margin-right: ${({ tileVariant }) => sizes(tileVariant === 'default' ? 4 : 3)};
`

export const Content = styled.div`
  width: 100%;
`

export const CheckboxSkeleton = styled(SkeletonLoader)`
  border-radius: 2px;
`
