import { forwardRef, useRef } from 'react'
import { CSSTransition } from 'react-transition-group'

import { Text } from '@/components/Text'
import { Tooltip, TooltipProps } from '@/components/Tooltip'
import { ButtonProps } from '@/components/_buttons/Button'
import { SvgActionInformative } from '@/components/_icons'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { transitions } from '@/styles'

import {
  ActionBarContainer,
  ActionButtonPrimary,
  ActionButtonPrimaryTooltip,
  DetailsIconWrapper,
  DraftsBadgeContainer,
  SecondaryButton,
  StyledPrimaryText,
  StyledSecondaryText,
} from './ActionBar.styles'

export type ActionDialogButtonProps = {
  text?: string
  tooltip?: TooltipProps
} & Omit<ButtonProps, 'children'>

type ActionDialogInfoBadge = {
  text: string
  tooltip?: TooltipProps
}

export type ActionBarProps = {
  primaryText?: string
  secondaryText?: string
  infoBadge?: ActionDialogInfoBadge
  primaryButton: ActionDialogButtonProps
  secondaryButton?: ActionDialogButtonProps
  isActive?: boolean
  className?: string
}

export const ActionBar = forwardRef<HTMLDivElement, ActionBarProps>(
  ({ primaryText, isActive = true, secondaryText, className, primaryButton, secondaryButton, infoBadge }, ref) => {
    const smMatch = useMediaMatch('sm')
    const infoBadgeRef = useRef(null)

    return (
      <ActionBarContainer ref={ref} className={className} isActive={isActive}>
        <StyledPrimaryText variant={smMatch ? 'h400' : 'h200'}>{primaryText}</StyledPrimaryText>
        <StyledSecondaryText variant="t100" secondary>
          {secondaryText}
        </StyledSecondaryText>
        {infoBadge ? (
          <>
            <DraftsBadgeContainer ref={infoBadgeRef}>
              <Text variant={smMatch ? 't200' : 't100'} secondary>
                {infoBadge?.text}
              </Text>
              <DetailsIconWrapper>
                <SvgActionInformative />
              </DetailsIconWrapper>
            </DraftsBadgeContainer>
            <Tooltip reference={infoBadgeRef} placement="top-end" {...infoBadge?.tooltip} />
          </>
        ) : null}
        <CSSTransition
          in={!!secondaryButton}
          timeout={parseInt(transitions.timings.sharp)}
          classNames={transitions.names.fade}
          mountOnEnter
          unmountOnExit
        >
          <SecondaryButton {...secondaryButton} variant="secondary" size={smMatch ? 'large' : 'medium'}>
            {secondaryButton?.text}
          </SecondaryButton>
        </CSSTransition>
        <ActionButtonPrimaryTooltip placement="top-end" {...primaryButton?.tooltip}>
          <ActionButtonPrimary {...primaryButton} size={smMatch ? 'large' : 'medium'} type="submit">
            {primaryButton.text}
          </ActionButtonPrimary>
        </ActionButtonPrimaryTooltip>
      </ActionBarContainer>
    )
  }
)

ActionBar.displayName = 'ActionBar'
