import React from 'react'
import useMeasure from 'react-use-measure'

import { PopoverProps } from './Popover'
import {
  ContentContainer,
  FooterContainer,
  HeaderContainer,
  MAX_CONTENT_HEIGHT,
  PopoverContainer,
} from './PopoverDialog.styles'

type PopoverDialogProps = {
  header?: string
  content: React.ReactNode
  footer?: React.ReactNode
} & PopoverProps

export const PopoverDialog: React.FC<PopoverDialogProps> = ({ header, content, footer, children, ...rest }) => {
  const [containerRef, containerBounds] = useMeasure()

  const isScrollable = containerBounds.height >= MAX_CONTENT_HEIGHT
  return (
    <PopoverContainer
      {...rest}
      content={
        <>
          {header && (
            <HeaderContainer isScrollable={isScrollable} variant="h6">
              {header}
            </HeaderContainer>
          )}
          <ContentContainer ref={containerRef}>{content}</ContentContainer>
          {footer && <FooterContainer isScrollable={isScrollable}>{footer}</FooterContainer>}
        </>
      }
    >
      {children}
    </PopoverContainer>
  )
}
