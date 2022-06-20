import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { Tooltip } from '@/components/Tooltip'
import { Button } from '@/components/_buttons/Button'
import { cVar, media, sizes, transitions, zIndex } from '@/styles'

import { Information } from '../Information'

type ActionBarContainerProps = {
  isActive?: boolean
}

export const ActionBarContainer = styled.div<ActionBarContainerProps>`
  background-color: ${cVar('colorBackground')};
  box-shadow: ${cVar('effectDividersTop')};
  display: grid;
  gap: ${sizes(4)};
  padding: ${sizes(4)};
  z-index: ${zIndex.transactionBar};
  transform: translateY(${({ isActive }) => (isActive ? '0' : '100%')});
  transition: transform ${transitions.timings.regular} ${transitions.easing};

  &.${transitions.names.fade}-enter-active {
    transition: opacity ${transitions.timings.loading} ${transitions.easing} 800ms !important;
  }

  grid-template:
    'primary-text badge' auto
    'secondary-button primary-button' auto / auto 1fr;

  ${media.sm} {
    grid-template: 'primary-text badge secondary-button primary-button' auto / 1fr max-content max-content max-content;
  }

  ${media.md} {
    padding: ${sizes(4)} ${sizes(8)};
  }
`

export const StyledPrimaryText = styled(Text)`
  align-self: center;
  padding: 6px 0;
`

export const ActionButtonPrimaryTooltip = styled(Tooltip)`
  display: contents;
`

export const StyledInformation = styled(Information)`
  margin-left: ${sizes(1)};
`

export const ActionButtonPrimary = styled(Button)<{ secondaryButtonExists: boolean }>`
  grid-area: primary-button;

  ${({ secondaryButtonExists }) =>
    !secondaryButtonExists &&
    css`
      grid-column: 1 / span 2;

      ${media.sm} {
        grid-column: -3 / span 2;
      }
    `}
`

export const SecondaryButton = styled(Button)`
  grid-area: secondary-button;
`

export const DraftsBadgeContainer = styled.div`
  grid-area: badge;
  user-select: none;
  margin-left: auto;
  padding: 0 ${sizes(2)};
  display: flex;
  align-items: center;
  justify-content: end;
  height: 100%;
  transition: background-color ${transitions.timings.sharp} ${transitions.easing};

  ${media.sm} {
    padding: 0 ${sizes(3)};
  }

  :hover {
    background-color: ${cVar('colorCoreNeutral700Lighten')};
  }
`

export const DetailsIconWrapper = styled.span`
  margin-left: ${sizes(2)};

  path {
    fill: ${cVar('colorText')};
  }
`

export const FeeContainer = styled.div`
  grid-area: primary-text;
  display: flex;
  align-items: center;
`
