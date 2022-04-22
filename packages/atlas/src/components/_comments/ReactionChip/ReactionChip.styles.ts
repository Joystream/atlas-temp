import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { cVar, sizes } from '@/styles'

export type ReactionChipState = 'default' | 'disabled' | 'processing'
type ReactionChipButtonProps = {
  state: ReactionChipState
  active: boolean
}

const getStaticBackground = (props: ReactionChipButtonProps) => {
  switch (props.state) {
    case 'processing':
      return props.active ? cVar('colorBackgroundStrongAlpha') : cVar('colorBackgroundAlpha')
    default:
    case 'default':
    case 'disabled':
      return props.active ? cVar('colorBackgroundStrongAlpha') : 'none'
  }
}

const getHoverStyles = (props: ReactionChipButtonProps) => css`
  :hover,
  :focus {
    background: ${cVar('colorBackgroundStrongAlpha')};
    box-shadow: ${props.active ? `inset 0 0 0 1px ${cVar('colorBorderStrongAlpha')}` : 'none'};
  }

  :active {
    background: ${cVar('colorBackgroundAlpha')};
    box-shadow: ${props.active ? `inset 0 0 0 1px ${cVar('colorBorderAlpha')}` : 'none'};
  }
`

export const ReactionChipButton = styled.button<ReactionChipButtonProps>`
  border: none;
  background: ${getStaticBackground};
  box-shadow: ${({ active }) => (active ? `inset 0 0 0 1px ${cVar('colorBackgroundStrongAlpha')}` : 'none')};
  cursor: pointer;
  height: 32px;
  padding: ${sizes(2)};
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ state }) => state === 'default' && getHoverStyles};
`

export const EmojiContainer = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 16px;
  height: 16px;
`
