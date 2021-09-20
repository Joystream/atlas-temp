import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { ExpandButton } from '@/shared/components/ExpandButton'
import { colors, sizes, transitions } from '@/shared/theme'

import { UploadStatusGroupSize } from './UploadStatusGroup'

type UploadStatusGroupProps = {
  isActive?: boolean
}

type DrawerProps = {
  maxHeight?: number
} & UploadStatusGroupProps

export const Container = styled.div`
  position: relative;
  margin-bottom: ${sizes(6)};
`

export const UploadStatusGroupContainer = styled.div<UploadStatusGroupProps>`
  position: relative;
  display: flex;
  align-items: center;
  padding: ${sizes(4)};
  width: 100%;
  height: ${sizes(20)};
  background-color: ${colors.gray[900]};
  cursor: pointer;
  transition: background-color ${transitions.timings.sharp} ${transitions.easing};
`

type ThumbnailProps = {
  size?: UploadStatusGroupSize
}

export const Thumbnail = styled.div<ThumbnailProps>`
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${colors.gray[700]};
  height: ${sizes(12)};

  ${({ size }) => {
    if (size === 'compact') {
      return css`
        width: ${sizes(12)};
      `
    }
    if (size === 'large') {
      return css`
        width: ${sizes(18)};
      `
    }
  }};
`
export const AssetsInfoContainer = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-left: ${sizes(4)};
  height: ${sizes(12)};
  color: ${colors.gray[300]};
`

export const UploadInfoContainer = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  margin-left: auto;
  width: fit-content;
  height: ${sizes(12)};
  color: ${colors.gray[300]};
  text-align: right;
`

export const StyledExpandButton = styled(ExpandButton)`
  margin-left: ${sizes(4)};
`

export const AssetsDrawerContainer = styled.div<DrawerProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  top: 0;
  width: 100%;
  max-height: ${({ isActive, maxHeight }) => (isActive ? `${maxHeight}px` : '0px')};
  background-color: ${colors.gray[800]};
  overflow: hidden;
  transition: max-height ${transitions.timings.loading} ${transitions.easing};
`
