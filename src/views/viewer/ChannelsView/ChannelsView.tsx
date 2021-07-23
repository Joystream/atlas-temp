import styled from '@emotion/styled'
import React from 'react'

import { InfiniteChannelWithVideosGrid, ViewWrapper } from '@/components'
import { absoluteRoutes } from '@/config/routes'
import { CallToActionButton, CallToActionWrapper, Text } from '@/shared/components'
import { SvgNavChannels, SvgNavHome, SvgNavNew, SvgNavPopular } from '@/shared/icons'
import { sizes } from '@/shared/theme'

export const ChannelsView = () => {
  return (
    <StyledViewWrapper>
      <Header variant="h2">Browse channels</Header>
      <InfiniteChannelWithVideosGrid title="Channels in your language:" languageSelector onDemand />
      <CallToActionWrapper>
        <CallToActionButton
          label="Popular on Joystream"
          to={absoluteRoutes.viewer.popular()}
          colorVariant="red"
          icon={<SvgNavPopular />}
        />
        <CallToActionButton
          label="New & Noteworthy"
          to={absoluteRoutes.viewer.new()}
          colorVariant="green"
          icon={<SvgNavNew />}
        />
        <CallToActionButton
          label="Home"
          to={absoluteRoutes.viewer.index()}
          colorVariant="yellow"
          icon={<SvgNavHome />}
        />
      </CallToActionWrapper>
    </StyledViewWrapper>
  )
}

const Header = styled(Text)`
  margin: ${sizes(16)} 0;
`

const StyledViewWrapper = styled(ViewWrapper)`
  padding-bottom: ${sizes(10)};
`
