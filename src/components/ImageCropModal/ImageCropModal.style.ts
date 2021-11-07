import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { DialogModal } from '@/components/DialogModal'
import { SkeletonLoader } from '@/components/SkeletonLoader'
import { Slider } from '@/components/Slider'
import { Text } from '@/components/Text'
import { colors, sizes } from '@/theme'

export const StyledDialogModal = styled(DialogModal)`
  width: 536px;
`

const roundedCropperCss = css`
  .cropper-view-box,
  .cropper-face {
    border-radius: 50%;
  }
`

export const AlignInfoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: ${sizes(4)};
`

export const AlignInfo = styled(Text)`
  margin-left: ${sizes(2)};
`

export const HiddenInput = styled.input`
  opacity: 0;
  visibility: hidden;
  position: fixed;
  top: -99999px;
  left: -99999px;
`

const cropAreaSizeCss = css`
  width: 100%;
  height: 256px;
`

export const CropSkeletonLoader = styled(SkeletonLoader)`
  ${cropAreaSizeCss};
`

export const CropContainer = styled.div<{ rounded?: boolean; disabled?: boolean }>`
  ${cropAreaSizeCss};

  ${({ rounded }) => rounded && roundedCropperCss};

  .cropper-view-box {
    outline: none;

    ::after {
      content: '';
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      border-radius: ${({ rounded }) => (rounded ? '50%' : '0')};
      box-shadow: inset 0 0 0 2px ${colors.transparentWhite[32]};
    }
  }

  .cropper-modal {
    background-color: ${colors.transparentBlack[54]};
  }

  pointer-events: ${({ disabled }) => disabled && 'none'};
`

export const StyledImage = styled.img`
  display: block;
  max-width: 100%;
`

export const ZoomControl = styled.div`
  display: flex;
  align-items: center;
`

export const StyledSlider = styled(Slider)`
  margin: 0 ${sizes(4)};
  flex: 1;
`
