import styled from '@emotion/styled'

import { SvgActionInformative } from '@/components/_icons'
import { cVar, square } from '@/styles'

export const StyledSvgActionInformative = styled(SvgActionInformative)`
  path {
    transition: fill ${cVar('animationTransitionFast')};
    fill: ${cVar('colorText')};
  }
`

export const IconWrapper = styled.div`
  cursor: pointer;
  ${square(32)};
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  transition: background ${cVar('animationTransitionFast')};

  :active {
    background: ${cVar('colorBackgroundAlpha')};
    ${StyledSvgActionInformative} {
      path {
        fill: ${cVar('colorTextStrong')};
      }
    }
  }
  @media (hover: hover) {
    :hover {
      background: ${cVar('colorBackgroundAlpha')};
      ${StyledSvgActionInformative} {
        path {
          fill: ${cVar('colorTextStrong')};
        }
      }
    }
  }
`

export const TouchableWrapper = styled.div`
  padding: 8px;
  margin: -8px;
  :active ${IconWrapper} {
    background: ${cVar('colorBackgroundAlpha')};
    ${StyledSvgActionInformative} {
      path {
        fill: ${cVar('colorTextStrong')};
      }
    }
  }
`
