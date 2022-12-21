import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { SvgActionArrowRight, SvgAlertsInformative24 } from '@/assets/icons'
import { Tabs } from '@/components/Tabs'
import { Banner } from '@/components/Banner'
import { cVar, media, sizes } from '@/styles'

export const Header = styled.header`
  display: grid;
  gap: ${sizes(6)};
  margin: ${sizes(12)} 0;

  ${media.sm} {
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: ${sizes(12)};
  }
`

export const RewardsWrapper = styled.div`
  display: grid;
  gap: ${sizes(4)};
  margin-bottom: ${sizes(4)};

  ${media.md} {
    gap: ${sizes(6)};
    margin-bottom: ${sizes(6)};
  }
`

export const WidgetsWrapper = styled.section`
  display: grid;
  gap: ${sizes(4)};
  margin-bottom: ${sizes(4)};

  ${media.sm} {
    grid-template-columns: repeat(3, 1fr);
  }

  ${media.md} {
    margin-bottom: ${sizes(6)};
  }
`

const commonGridStyles = css`
  display: grid;
  align-items: center;
`

export const TierWrapper = styled.div`
  gap: ${sizes(4)};
  grid-template-columns: auto 1fr;
  ${commonGridStyles}

  ${media.sm} {
    grid-template-columns: repeat(2, auto);
  }
`

export const TierDescription = styled.div`
  gap: ${sizes(2)};
  grid-template-columns: auto 1fr;
  text-align: right;
  justify-items: left;
  ${commonGridStyles}

  ${media.sm} {
    grid-template-columns: repeat(2, auto);
  }
`

export const TierCount = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  align-items: center;
  gap: ${sizes(1)};
  justify-content: flex-end;
`

export const StyledSvgAlertsInformative24 = styled(SvgAlertsInformative24)`
  path {
    fill: ${cVar('colorTextStrong')};
  }
`
export const StyledTab = styled(Tabs)`
  margin-bottom: 24px;
`

export const SettingsInputsWrapper = styled.div`
  margin: 32px 0;
  display: grid;
  gap: ${sizes(8)};
  width: 100%;

  ${media.md} {
    max-width: 640px;
    margin: 56px auto;
  }
`

export const Divider = styled.div`
  margin: ${sizes(2)} 0;
  background-color: ${cVar('colorBackgroundMutedAlpha')};
  height: 1px;
  width: 100%;
`

export const StyledSvgActionArrowRight = styled(SvgActionArrowRight)`
  height: 11px;

  > *:last-child {
    margin-left: 2px;
  }
`

export const StyledBanner = styled(Banner)`
  margin-bottom: ${sizes(6)};
`
