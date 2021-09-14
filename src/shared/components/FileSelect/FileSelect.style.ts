import styled from '@emotion/styled'
import { darken } from 'polished'
import { animated } from 'react-spring'

import { colors, media, sizes, transitions } from '@/shared/theme'

import { IconButton } from '../IconButton'
import { Text } from '../Text'

type DragAndDropAreaProps = {
  isDragAccept?: boolean
  isFileDialogActive?: boolean
}

type InfoContainerProps = {
  isLoading?: boolean
}

export const DragAndDropArea = styled.div<DragAndDropAreaProps>`
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 90%;
  display: flex;
  justify-content: center;
  transition: all ${transitions.timings.routing} ${transitions.easing};
  background: ${({ isDragAccept }) =>
    isDragAccept && `radial-gradient(55.47% 148.24% at 50% 50%, rgba(0, 0, 0, 0) 0%, rgba(64, 56, 255, 0.2) 100%) ;`};
  background-color: ${darken(0.16, colors.gray[600])};

  ::after {
    content: '';
    pointer-events: none;
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    border: 1px dashed
      ${({ isDragAccept, isFileDialogActive }) =>
        isDragAccept || isFileDialogActive ? colors.blue[500] : colors.gray[500]};
  }

  ${media.sm} {
    padding-top: 56.25%;
  }
`
export const InfoContainer = styled(animated.div)<InfoContainerProps>`
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

export const InfoInnerContainer = styled(animated.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const InfoHeading = styled(Text)`
  color: ${colors.blue[200]};
  display: block;
  margin: ${sizes(4)} 0 ${sizes(1)} 0;
`

export const InfoBackground = styled.div`
  width: 100%;
  position: absolute;
  z-index: -1;
  opacity: 0.2;
  background-color: ${colors.blue[500]};
  height: 100%;
`

export const InnerContainer = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  display: flex;
  text-align: center;
  max-width: 280px;
  height: 100%;

  ${media.sm} {
    max-width: 350px;
  }
`

export const Thumbnail = styled.img`
  position: absolute;
  top: 0;
  max-width: 100%;
  height: 100%;
  object-fit: contain;
  cursor: pointer;
  display: block;

  ${media.xs} {
    object-fit: initial;
  }
`

export const DismissButton = styled(IconButton)`
  margin-left: 10px;
`

export const Title = styled(Text)`
  margin-top: ${sizes(2)};

  ${media.sm} {
    margin-top: ${sizes(4)};
  }
`

export const Paragraph = styled(Text)`
  margin-top: ${sizes(4)};

  ${media.sm} {
    margin-top: ${sizes(8)};
  }
`

export const ButtonsGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: ${sizes(4)} 0 ${sizes(2)} 0;

  ${media.sm} {
    margin: ${sizes(8)} 0 ${sizes(4)} 0;
  }
`

export const DragDropText = styled(Text)`
  display: none;

  ${media.sm} {
    display: initial;
    margin-right: ${sizes(5)};
  }
`
