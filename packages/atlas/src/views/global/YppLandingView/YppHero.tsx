import { FC } from 'react'
import { useParallax } from 'react-scroll-parallax'

import hero576 from '@/assets/images/ypp-hero/hero-576.webp'
import hero864 from '@/assets/images/ypp-hero/hero-864.webp'
import hero1152 from '@/assets/images/ypp-hero/hero-1152.webp'
import hero2304 from '@/assets/images/ypp-hero/hero-2304.webp'
import yt576 from '@/assets/images/ypp-hero/yt-576.webp'
import yt864 from '@/assets/images/ypp-hero/yt-864.webp'
import yt1152 from '@/assets/images/ypp-hero/yt-1152.webp'
import yt2304 from '@/assets/images/ypp-hero/yt-2304.webp'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { SvgActionChevronR } from '@/components/_icons'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import { BackImage, FrontImage, HeroImageWrapper } from './YppHero.styles'
import { BackgroundContainer, StyledLimitedWidthContainer } from './YppLandingView.styles'

type YppHeroProps = {
  onSignUpClick: () => void
}

export const YppHero: FC<YppHeroProps> = ({ onSignUpClick }) => {
  const mdMatch = useMediaMatch('md')
  const smMatch = useMediaMatch('sm')
  const endScroll = smMatch ? window.innerHeight / 3 : window.innerHeight
  const { ref: heroImageRef } = useParallax<HTMLImageElement>({
    startScroll: 0,
    endScroll,
    translateY: [0, -15],
  })
  return (
    <BackgroundContainer noBackground>
      <StyledLimitedWidthContainer centerText>
        <LayoutGrid>
          <GridItem as="header" colSpan={{ base: 12, sm: 8, lg: 6 }} colStart={{ sm: 3, lg: 4 }}>
            <Text
              as="h1"
              variant={mdMatch ? 'h800' : 'h600'}
              data-aos="fade-up"
              data-aos-delay="250"
              data-aos-offset="80"
              data-aos-easing="atlas-easing"
            >
              Connect your YouTube channel & get paid
            </Text>
            <Text
              as="p"
              variant="t300"
              color="colorText"
              margin={{ top: 4, bottom: 8 }}
              data-aos="fade-up"
              data-aos-delay="350"
              data-aos-offset="40"
              data-aos-easing="atlas-easing"
            >
              Reupload and backup your YouTube videos to receive a guaranteed payout in the YouTube Partner Program.
            </Text>
            <Button
              size="large"
              icon={<SvgActionChevronR />}
              iconPlacement="right"
              onClick={onSignUpClick}
              data-aos="fade-up"
              data-aos-delay="450"
              data-aos-offset="40"
              data-aos-easing="atlas-easing"
            >
              Sign up now
            </Button>
            <Text
              as="p"
              variant="t100"
              color="colorTextMuted"
              margin={{ top: 2 }}
              data-aos="fade-up"
              data-aos-delay="450"
              data-aos-offset="40"
              data-aos-easing="atlas-easing"
            >
              It takes 3 minutes and is 100% free.
            </Text>
          </GridItem>
        </LayoutGrid>
        <HeroImageWrapper data-aos="fade-up" data-aos-delay="550" data-aos-offset="80" data-aos-easing="atlas-easing">
          <BackImage
            srcSet={`${yt576} 576w, ${yt864} 864w, ${yt1152} 1152w, ${yt2304} 2304w`}
            alt="Hero back"
            width="1152"
            height="824"
          />
          <FrontImage
            ref={heroImageRef}
            srcSet={`${hero576} 576w, ${hero864} 864w, ${hero1152} 1152w, ${hero2304} 2304w`}
            alt="Hero front"
            width="1152"
            height="824"
          />
        </HeroImageWrapper>
      </StyledLimitedWidthContainer>
    </BackgroundContainer>
  )
}
