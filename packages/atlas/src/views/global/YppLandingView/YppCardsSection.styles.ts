import styled from '@emotion/styled'

import { LayoutGrid } from '@/components/LayoutGrid'
import { media, sizes } from '@/styles'

import { imageShadow } from './YppLandingView.styles'

export const CardsWithImagesContainer = styled.div`
  display: grid;
  gap: ${sizes(16)};
  ${media.md} {
    gap: ${sizes(24)};
  }
`

export const CardImageRow = styled(LayoutGrid)`
  ${media.sm} {
    align-items: center;
    justify-items: center;
  }
`

type ImageContainerProps = {
  positionOnMobile?: 'center' | 'unset' | 'flex-end'
  hiddenOverflow?: boolean
}

export const ImageContainer = styled.div<ImageContainerProps>`
  overflow: ${({ hiddenOverflow }) => (hiddenOverflow ? 'hidden' : 'unset')};
  position: relative;
  display: flex;
  justify-content: ${({ positionOnMobile = 'unset' }) => positionOnMobile};
  ${media.sm} {
    justify-content: unset;
  }
`

export const CardImage = styled.img<{ absolute?: boolean; dropShadow?: boolean }>`
  width: 100%;
  min-width: 480px;
  max-width: 640px;
  position: ${({ absolute }) => (absolute ? 'absolute' : 'relative')};
  z-index: ${({ absolute }) => (absolute ? 0 : 1)};

  ${({ dropShadow }) => dropShadow && imageShadow};
`
