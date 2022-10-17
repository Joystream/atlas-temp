import { FC } from 'react'

import { Text } from '@/components/Text'
import { atlasConfig } from '@/config'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import {
  IllustrationWrapper,
  SignInDialogTextWrapper,
  StyledLargeComputer,
  StyledSvgLargeWall,
  StyledSvgOtherSignInDialogPatterns,
  StyledSvgOtherSignInMobileDialogPatterns,
} from './SignInDialogContent.styles'

type SignInDialogContentProps = {
  isMobileDevice: boolean
}

export const SignInDialogContent: FC<SignInDialogContentProps> = ({ isMobileDevice }) => {
  const smMatch = useMediaMatch('sm')
  return (
    <>
      <IllustrationWrapper isMobileDevice={isMobileDevice}>
        {isMobileDevice ? <StyledLargeComputer /> : <StyledSvgLargeWall />}
        {isMobileDevice ? <StyledSvgOtherSignInMobileDialogPatterns /> : <StyledSvgOtherSignInDialogPatterns />}
      </IllustrationWrapper>
      <SignInDialogTextWrapper>
        <Text as="h1" variant={smMatch ? 'h500' : 'h400'}>
          {isMobileDevice
            ? `${atlasConfig.general.appName} is best experienced on desktop`
            : 'Connect wallet to continue'}
        </Text>
        {!isMobileDevice ? (
          <Text as="p" variant="t200" color="colorText">
            Connect your wallet and sign in to a free Joystream membership to continue.
          </Text>
        ) : (
          <>
            <Text as="p" variant="t200" color="colorText">
              To continue, you'll need to connect a wallet and set up a free Joystream membership, which is best done on
              a desktop.
            </Text>
            <Text as="p" variant="t200" color="colorText">
              If you have a wallet app on your phone, tap “Connect anyway” to create your membership.
            </Text>
          </>
        )}
      </SignInDialogTextWrapper>
    </>
  )
}
