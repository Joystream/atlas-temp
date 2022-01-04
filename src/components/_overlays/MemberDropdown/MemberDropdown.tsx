import { easings, useSpringRef, useTransition } from '@react-spring/web'
import React, { useEffect, useRef, useState } from 'react'
import mergeRefs from 'react-merge-refs'
import { useLocation, useNavigate } from 'react-router'
import useMeasure from 'react-use-measure'

import { useChannel } from '@/api/hooks'
import { Avatar } from '@/components/Avatar'
import { ListItem } from '@/components/ListItem'
import { Text } from '@/components/Text'
import {
  SvgActionAddVideo,
  SvgActionChevronL,
  SvgActionChevronR,
  SvgActionJoyToken,
  SvgActionMember,
  SvgActionNewChannel,
  SvgActionPlay,
  SvgActionPlus,
} from '@/components/_icons'
import { SvgActionSwitchMember } from '@/components/_icons/ActionSwitchMember'
import { IconWrapper } from '@/components/_icons/IconWrapper'
import { absoluteRoutes } from '@/config/routes'
import { AssetType, useAsset } from '@/providers/assets'
import { useUser } from '@/providers/user'
import { cVar } from '@/styles'

import {
  AnimatedContainer,
  BalanceContainer,
  BlurredBG,
  ChannelsSectionTitle,
  Container,
  Divider,
  Filter,
  InnerContainer,
  LearnAboutTjoyLink,
  MemberInfoContainer,
  SectionContainer,
  StyledAvatar,
  SwitchMemberItemListContainer,
  TjoyContainer,
} from './MemberDropdown.styles'

export type MemberDropdownProps = {
  isActive: boolean
  publisher?: boolean
  closeDropdown?: () => void
  onChannelChange?: (channelId: string) => void
}

export const MemberDropdown = React.forwardRef<HTMLDivElement, MemberDropdownProps>(
  ({ publisher, isActive, closeDropdown, onChannelChange }, ref) => {
    const [isSwitchingMember, setIsSwitchingMember] = useState(false)
    const { pathname } = useLocation()
    const [isAnimatingSwitchMember, setIsAnimatingSwitchMember] = useState(false)
    const navigate = useNavigate()
    const { activeChannelId, activeMembership, setActiveUser, memberships, signIn } = useUser()
    const containerRef = useRef<HTMLDivElement>(null)

    const [measureContainerRef, { height: containerHeight }] = useMeasure()
    const transRef = useSpringRef()
    const transitions = useTransition(isSwitchingMember, {
      ref: transRef,
      key: null,
      from: { opacity: 0, x: 280 * (isSwitchingMember ? 1 : -1) },
      enter: { opacity: 1, x: 0 },
      leave: { opacity: 0, x: -280 * (isSwitchingMember ? 1 : -1) },
      config: {
        duration: 250,
        easing: easings.easeOutCirc,
      },
      onRest: () => setIsAnimatingSwitchMember(false),
      onStart: () => setIsAnimatingSwitchMember(true),
    })

    const hasOneMember = memberships?.length === 1

    const handleAddNewChannel = () => {
      navigate(absoluteRoutes.studio.newChannel())
      closeDropdown?.()
    }
    const handleGoToJoystream = () => {
      navigate(absoluteRoutes.viewer.index())
      closeDropdown?.()
    }
    const handleGoToStudio = () => {
      navigate(absoluteRoutes.studio.index())
      closeDropdown?.()
    }
    // TODO: add navigation
    const handleGoToMyProfile = () => {
      closeDropdown?.()
    }
    const handleAddNewMember = () => {
      signIn()
      closeDropdown?.()
      setIsSwitchingMember(false)
    }
    const handleMemberChange = (memberId: string, accountId: string, channelId: string | null) => {
      setActiveUser({ accountId, memberId, channelId })
      if (channelId && pathname === absoluteRoutes.studio.newChannel()) {
        navigate(absoluteRoutes.studio.editChannel())
      }
      closeDropdown?.()
      setIsSwitchingMember(false)
    }

    useEffect(() => {
      if (!isActive) {
        return
      }
      const handleClickOutside = (event: Event) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          // stop propagation so drawer doesn't get triggered again on button click
          // prevent default so it doesn't trigger unwanted submit e.g. in Channel Edit View
          event.preventDefault()
          event.stopPropagation()
          closeDropdown?.()
        }
      }
      document.addEventListener('click', handleClickOutside, true)
      return () => {
        document.removeEventListener('click', handleClickOutside, true)
      }
    }, [closeDropdown, isActive])

    useEffect(() => {
      transRef.start()
    }, [isSwitchingMember, transRef])

    return (
      <Container ref={ref}>
        {/* 9999 prevents containerHeight from being 0 at when the component mounts */}
        <InnerContainer isActive={isActive} containerHeight={containerHeight || 9999}>
          {transitions((style, isSwitchingMemberMode) =>
            isSwitchingMemberMode ? (
              <AnimatedContainer isAnimatingSwitchMember={isAnimatingSwitchMember} style={style}>
                <div ref={mergeRefs([containerRef, measureContainerRef])}>
                  <SwitchMemberItemListContainer>
                    <ListItem
                      onClick={() => setIsSwitchingMember(false)}
                      nodeStart={<SvgActionChevronL />}
                      label="Switch member"
                      applyIconStylesNodeStart
                    />
                  </SwitchMemberItemListContainer>

                  <SectionContainer>
                    {memberships?.map((member) => (
                      <ListItem
                        key={member.id}
                        onClick={() => onChannelChange?.(member.id)}
                        nodeStart={<Avatar assetUrl={member.avatarUri} />}
                        label={member.handle ?? ''}
                        selected={member.id === activeMembership?.id}
                      />
                    ))}
                    <ListItem
                      nodeStart={<IconWrapper icon={<SvgActionNewChannel />} />}
                      onClick={() => handleAddNewMember()}
                      label="Add new member..."
                    />
                  </SectionContainer>
                </div>
              </AnimatedContainer>
            ) : (
              <AnimatedContainer isAnimatingSwitchMember={isAnimatingSwitchMember} style={style}>
                <div ref={mergeRefs([containerRef, measureContainerRef])}>
                  <BlurredBG url={activeMembership?.avatarUri}>
                    <Filter />
                    <MemberInfoContainer>
                      <StyledAvatar size="fill" assetUrl={activeMembership?.avatarUri} />
                      <div>
                        {/* Using invisible unicode character ZERO WIDTH NON-JOINER (U+200C) 
                \ to preserve the space while member handle loads */}
                        <Text variant="h400">{activeMembership?.handle ?? '‌‌ '}</Text>
                        <TjoyContainer>
                          <BalanceContainer>
                            <SvgActionJoyToken />
                            <Text variant="t200-strong">12.5K</Text>
                          </BalanceContainer>
                          <Divider />
                          <LearnAboutTjoyLink
                            variant="t100"
                            as="a"
                            // @ts-ignore our types don't allow this but its fine here
                            href="https://www.joystream.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                            secondary
                            color={cVar('colorCoreNeutral200Lighten')}
                          >
                            Learn about tJOY
                          </LearnAboutTjoyLink>
                        </TjoyContainer>
                      </div>
                    </MemberInfoContainer>
                  </BlurredBG>
                  <SectionContainer>
                    {publisher ? (
                      <ListItem
                        onClick={handleGoToJoystream}
                        nodeStart={<IconWrapper icon={<SvgActionPlay />} />}
                        label="Go to Joystream"
                      />
                    ) : (
                      <>
                        <ListItem
                          onClick={handleGoToStudio}
                          nodeStart={<IconWrapper icon={<SvgActionAddVideo />} />}
                          label="Go to Studio"
                        />
                        <ListItem
                          onClick={handleGoToMyProfile}
                          nodeStart={<IconWrapper icon={<SvgActionMember />} />}
                          label="My profile"
                        />
                      </>
                    )}
                    <ListItem
                      nodeStart={<IconWrapper icon={hasOneMember ? <SvgActionPlus /> : <SvgActionSwitchMember />} />}
                      onClick={() => (hasOneMember ? handleAddNewMember() : setIsSwitchingMember(true))}
                      label={hasOneMember ? 'Add new member...' : 'Switch member'}
                      nodeEnd={hasOneMember === false && <SvgActionChevronR />}
                      applyIconStylesNodeEnd
                    />
                  </SectionContainer>
                  {publisher && (
                    <SectionContainer>
                      <ChannelsSectionTitle variant="t100" secondary>
                        Your channels
                      </ChannelsSectionTitle>
                      {activeMembership?.channels.map((channel) => (
                        <ChannelListItem
                          key={channel.id}
                          onClick={() => onChannelChange?.(channel.id)}
                          channelId={channel.id}
                          activeChannelId={activeChannelId}
                        />
                      ))}
                      <ListItem
                        onClick={handleAddNewChannel}
                        nodeStart={<IconWrapper icon={<SvgActionPlus />} />}
                        label="Add new channel..."
                      />
                    </SectionContainer>
                  )}
                </div>
              </AnimatedContainer>
            )
          )}
        </InnerContainer>
      </Container>
    )
  }
)
MemberDropdown.displayName = 'MemberDropdown'

const ChannelListItem: React.FC<{ channelId: string; activeChannelId: string | null; onClick: () => void }> = ({
  activeChannelId,
  channelId,
  onClick,
}) => {
  const { channel } = useChannel(channelId)
  const { url: avatarPhotoUrl, isLoadingAsset } = useAsset({
    entity: channel,
    assetType: AssetType.AVATAR,
  })
  return (
    <ListItem
      onClick={onClick}
      nodeStart={<Avatar assetUrl={avatarPhotoUrl} loading={isLoadingAsset} />}
      label={channel?.title ?? ''}
      caption={channel ? `${channel?.follows} followers` : undefined}
      selected={activeChannelId === channel?.id}
    />
  )
}
