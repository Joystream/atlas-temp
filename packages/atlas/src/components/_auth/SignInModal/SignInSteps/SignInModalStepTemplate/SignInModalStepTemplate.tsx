import { FC, PropsWithChildren, ReactNode } from 'react'

import { Information } from '@/components/Information'
import { Text } from '@/components/Text'
import { Loader } from '@/components/_loaders/Loader'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import {
  AnimatedContainer,
  BackgroundImage,
  BackgroundImageOverlay,
  ContentContainer,
  CustomBackgroundContainer,
  HeaderContainer,
  LogoContainer,
  StyledAtlasLogoShort,
} from './SignInModalStepTemplate.styles'

type SignInModalStepTemplateProps = PropsWithChildren<{
  title: string
  subtitle: ReactNode
  tooltipText?: string
  loader?: boolean
  hasNavigatedBack: boolean
  darkBackground?: boolean
  backgroundImage?: string
  formNode?: ReactNode
}>

export const SignInModalStepTemplate: FC<SignInModalStepTemplateProps> = ({
  title,
  subtitle,
  tooltipText,
  children,
  loader,
  hasNavigatedBack,
  darkBackground,
  backgroundImage,
  formNode,
}) => {
  const smMatch = useMediaMatch('sm')

  return (
    <>
      <CustomBackgroundContainer darkBackground={darkBackground} hasDivider={!!(backgroundImage || darkBackground)}>
        {backgroundImage && (
          <>
            <BackgroundImage src={backgroundImage} alt="" />
            <BackgroundImageOverlay />
          </>
        )}
        <AnimatedContainer hasNavigatedBack={hasNavigatedBack}>
          <LogoContainer>{loader ? <Loader variant="medium" /> : <StyledAtlasLogoShort />}</LogoContainer>
          <HeaderContainer>
            <Text as="h3" variant={smMatch ? 'h500' : 'h400'}>
              {title}
            </Text>
            {tooltipText ? <Information text={tooltipText} placement="top" multiline /> : null}
          </HeaderContainer>
          <Text variant="t200" as="span" color="colorText">
            {subtitle}
          </Text>
          {children && <ContentContainer>{children}</ContentContainer>}
        </AnimatedContainer>
      </CustomBackgroundContainer>
      <AnimatedContainer hasNavigatedBack={hasNavigatedBack}>{formNode}</AnimatedContainer>
    </>
  )
}
