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
  FeeContainer,
  SecondaryButton,
  StyledInformation,
  StyledPrimaryText,
} from './ActionBar.styles'

import { NumberFormat } from '../NumberFormat'

export type ActionDialogButtonProps = {
  text?: string
  tooltip?: TooltipProps
} & Omit<ButtonProps, 'children'>

type ActionDialogInfoBadge = {
  text: string
  tooltip?: TooltipProps
}

export type ActionBarProps = {
  fee?: number
  infoBadge?: ActionDialogInfoBadge
  primaryButton: ActionDialogButtonProps
  secondaryButton?: ActionDialogButtonProps
  isActive?: boolean
  className?: string
}

export const ActionBar = forwardRef<HTMLDivElement, ActionBarProps>(
  ({ fee, isActive = true, className, primaryButton, secondaryButton, infoBadge }, ref) => {
    const smMatch = useMediaMatch('sm')
    const infoBadgeRef = useRef(null)

    return (
      <ActionBarContainer ref={ref} className={className} isActive={isActive}>
        <FeeContainer>
          <StyledPrimaryText variant={smMatch ? 'h400' : 'h200'}>
            Fee: <NumberFormat format="short" withToken value={fee ?? 0} />
          </StyledPrimaryText>
          <StyledInformation
            multiline
            icon
            placement="top-end"
            headerText="Blockchain transaction"
            text="This action requires a blockchain transaction, which comes with a fee."
          />
        </FeeContainer>
        {infoBadge ? (
          <>
            <DraftsBadgeContainer ref={infoBadgeRef}>
              <Text align="right" variant={smMatch ? 't200' : 't100'} secondary>
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
          <ActionButtonPrimary
            {...primaryButton}
            secondaryButtonExists={!!secondaryButton}
            size={smMatch ? 'large' : 'medium'}
            type="submit"
          >
            {primaryButton.text}
          </ActionButtonPrimary>
        </ActionButtonPrimaryTooltip>
      </ActionBarContainer>
    )
  }
)

ActionBar.displayName = 'ActionBar'
