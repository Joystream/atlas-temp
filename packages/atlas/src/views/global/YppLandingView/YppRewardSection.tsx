import { FC, useRef, useState } from 'react'

import { Information } from '@/components/Information'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { TooltipText } from '@/components/Tooltip/Tooltip.styles'
import { TierCard } from '@/components/_ypp/TierCard'
import { atlasConfig } from '@/config'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import {
  BackgroundContainer,
  CenteredLayoutGrid,
  HeaderGridItem,
  StyledLimitedWidthContainer,
} from './YppLandingView.styles'
import { ColorAnchor, RewardsSubtitleGridItem, RewardsSubtitleWrapper } from './YppRewardSection.styles'

export const calculateReward = (
  amount: number | number[] | { min: number | null; max: number } | null,
  multiplier: number | number[],
  tier: number
) => {
  if (amount === null) {
    return null
  } else if (typeof amount === 'number') {
    return {
      type: 'number' as const,
      amount: amount * (typeof multiplier === 'number' ? multiplier : multiplier[tier]),
    }
  } else if (Array.isArray(amount)) {
    return {
      type: 'number' as const,
      amount: amount[tier],
    }
  } else {
    return { type: 'range' as const, min: amount.min, max: amount.max }
  }
}

export const YppRewardSection: FC = () => {
  const mdMatch = useMediaMatch('md')
  const tiers = atlasConfig.features.ypp.tiersDefinition?.tiers
  const rewards = atlasConfig.features.ypp.rewards
  const [activeTier, setActiveTier] = useState<number>((tiers && tiers.length - 1) || 0)
  const ref = useRef<HTMLDivElement>(null)

  if (!rewards?.length) {
    return null
  }

  return (
    <BackgroundContainer noBackground>
      <StyledLimitedWidthContainer as="section">
        <CenteredLayoutGrid>
          <HeaderGridItem as="header" colStart={{ sm: 3, lg: 4 }} colSpan={{ base: 12, sm: 8, lg: 6 }}>
            <Text
              variant={mdMatch ? 'h700' : 'h600'}
              as="h2"
              data-aos="fade-up"
              data-aos-delay="0"
              data-aos-offset="80"
              data-aos-easing="atlas-easing"
            >
              Rewards are based on channel popularity and content quality
            </Text>
            <Text
              variant="t300"
              as="p"
              margin={{ top: 4 }}
              color="colorText"
              data-aos="fade-up"
              data-aos-delay="100"
              data-aos-offset="40"
              data-aos-easing="atlas-easing"
            >
              Each participating channel is reviewed by the verification team and assigned to one of the reward tiers
              below
            </Text>
          </HeaderGridItem>
        </CenteredLayoutGrid>
        <LayoutGrid data-aos="fade-up" data-aos-delay="200" data-aos-offset="80" data-aos-easing="atlas-easing">
          {['bronze', 'silver', 'gold', 'diamond'].map((rank) => (
            <GridItem colSpan={{ base: 12, sm: 6, md: 3 }} key={rank}>
              <TierCard checks={['Well well', 'Hah']} rewards={[0, 0, 0]} />
            </GridItem>
          ))}
          <RewardsSubtitleGridItem colStart={{ base: 6 }} colSpan={{ base: 7, lg: 6 }}>
            <RewardsSubtitleWrapper>
              <Text variant="t200" as="p" color="colorText" margin={{ right: 1 }}>
                Payments are made in {atlasConfig.joystream.tokenTicker} tokens
              </Text>
              <Information
                interactive
                customContent={
                  <TooltipText as="span" variant="t100">
                    {atlasConfig.joystream.tokenTicker} token is a native crypto asset of Joystream blockchain. It is
                    used for platform governance, purchasing NFTs, trading creator tokens, and covering blockchain
                    processing fees. They are listed on{' '}
                    <ColorAnchor href="https://www.mexc.com/exchange/JOYSTREAM_USDT" target="__blank">
                      MEXC
                    </ColorAnchor>{' '}
                    exchange under "JOYSTREAM" ticker.
                  </TooltipText>
                }
                multiline
                reference={ref.current}
                delay={1000}
              />
            </RewardsSubtitleWrapper>
          </RewardsSubtitleGridItem>
        </LayoutGrid>
      </StyledLimitedWidthContainer>
    </BackgroundContainer>
  )
}
