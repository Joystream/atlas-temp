import styled from '@emotion/styled'

import { colors, media, sizes, transitions, typography, zIndex } from '@/shared/theme'

import { IconButton } from '../IconButton'
import { Text } from '../Text'

type CoverImageProps = {
  $src: string
}

export const MediaWrapper = styled.div`
  margin: 0 calc(-1 * var(--global-horizontal-padding));
  width: calc(100% + calc(2 * var(--global-horizontal-padding)));
  position: relative;
`

export const Media = styled.div`
  width: 100%;
  height: 0;
  padding-top: 25%;
  position: relative;
  z-index: ${zIndex.background};
`

export const CoverImage = styled.div<CoverImageProps>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: local;
  background-size: cover;
  background-image: url(${({ $src }) => $src});
`

export const CoverWrapper = styled.div`
  position: relative;
`

export const EditableControls = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  transition: opacity ${transitions.timings.loading} ${transitions.easing};

  ${media.medium} {
    background-color: ${colors.transparentBlack[54]};
    opacity: 0;

    :hover {
      opacity: 1;
    }
  }

  ${media.xlarge} {
    height: 80%;
  }
`

export const EditCoverDesktopOverlay = styled.div`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: ${colors.gray[200]};
  display: none;

  ${media.medium} {
    display: flex;
    cursor: pointer;
  }
`

export const EditCoverMobileButton = styled(IconButton)`
  position: absolute;
  left: var(--global-horizontal-padding);
  top: ${sizes(1)};
  background-color: ${colors.gray[800]};

  &:hover {
    background-color: ${colors.transparentBlack[54]};
  }
  ${media.medium} {
    display: none;
  }
`

export const EditButtonMessage = styled(Text)`
  font-weight: 700;
  font-family: ${typography.fonts.headers};
  line-height: 1;
  color: ${colors.gray[100]};
  margin-top: ${sizes(1)};
`

export const FailedUploadContainer = styled.div`
  position: absolute;
  top: ${sizes(16)};
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
`
