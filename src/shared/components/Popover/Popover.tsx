import React from 'react'
import useMeasure from 'react-use-measure'

import {
  ContentContainer,
  FooterContainer,
  HeaderContainer,
  MAX_CONTENT_HEIGHT,
  PopoverContainer,
} from './Popover.styles'
import { PopoverBaseProps } from './PopoverBase'

type PopoverProps = {
  header?: string
  content: React.ReactNode
  footer?: React.ReactNode
} & PopoverBaseProps

export const Popover: React.FC<PopoverProps> = ({ isVisible, header, content, footer, ...rest }) => {
  const [containerRef, containerBounds] = useMeasure()

  if (!isVisible) return null
  const isScrollable = containerBounds.height >= MAX_CONTENT_HEIGHT
  return (
    <PopoverContainer {...rest} isVisible={isVisible}>
      {header && (
        <HeaderContainer isScrollable={isScrollable} variant="h6">
          {header}
        </HeaderContainer>
      )}
      <ContentContainer ref={containerRef}>{content}</ContentContainer>
      {footer && <FooterContainer isScrollable={isScrollable}>{footer}</FooterContainer>}
    </PopoverContainer>
  )
}
