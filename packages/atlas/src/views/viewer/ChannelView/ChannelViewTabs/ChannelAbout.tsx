import { FC } from 'react'

import { FullChannelFieldsFragment } from '@/api/queries'
import { GridItem } from '@/components/LayoutGrid/LayoutGrid'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { languages } from '@/config/languages'
import { absoluteRoutes } from '@/config/routes'
import { useMemberAvatar } from '@/providers/assets'
import { formatDate } from '@/utils/time'

import {
  Details,
  DetailsMember,
  DetailsText,
  MemberContainer,
  MemberLink,
  StyledAvatar,
  StyledLayoutGrid,
  TextContainer,
} from './ChannelAbout.styles'

type ChannelAboutProps = {
  channel?: FullChannelFieldsFragment | null
}

export const ChannelAbout: FC<ChannelAboutProps> = ({ channel }) => {
  const videoCount = channel?.activeVideosCounter
  const { url: memberAvatarUrl, isLoadingAsset: memberAvatarLoading } = useMemberAvatar(channel?.ownerMember)
  return (
    <StyledLayoutGrid>
      <GridItem colSpan={{ xxs: 12, sm: 8 }} rowStart={{ xxs: 2, sm: 1 }}>
        {!!channel?.description && (
          <TextContainer>
            <Text variant="h500">Description</Text>
            <Text variant="t300" color="default">
              {channel.description}
            </Text>
          </TextContainer>
        )}
      </GridItem>
      <GridItem colSpan={{ xxs: 12, sm: 3 }} colStart={{ sm: -4 }}>
        <DetailsText variant="h400">Details</DetailsText>

        <DetailsMember>
          <StyledAvatar size="small" assetUrl={memberAvatarUrl} loading={memberAvatarLoading} />
          <MemberContainer>
            <Text variant="t100" color="default">
              Owned by member
            </Text>
            <MemberLink to={absoluteRoutes.viewer.member(channel?.ownerMember?.handle)} variant="secondary">
              {channel?.ownerMember?.handle}
            </MemberLink>
          </MemberContainer>
        </DetailsMember>

        <Details>
          <Text variant="t100" color="default">
            Joined on
          </Text>
          <Text variant="t300">{channel?.createdAt ? formatDate(new Date(channel.createdAt)) : ''}</Text>
        </Details>

        <Details>
          <Text variant="t100" color="default">
            Num. of views
          </Text>
          {typeof channel?.views === 'number' ? (
            <NumberFormat variant="t300" value={channel.views} format="short" />
          ) : (
            ''
          )}
        </Details>

        <Details>
          <Text variant="t100" color="default">
            Num. of videos
          </Text>
          <Text variant="t300">{videoCount}</Text>
        </Details>

        <Details>
          <Text variant="t100" color="default">
            Language
          </Text>
          <Text variant="t300">
            {channel?.language?.iso ? languages.find(({ value }) => value === channel.language?.iso)?.name : ''}
          </Text>
        </Details>
      </GridItem>
    </StyledLayoutGrid>
  )
}
