import { AllChannelFieldsFragment } from '@/api/queries'
import { BackgroundPattern } from '@/components'
import { transitions } from '@/shared/theme'
import { formatNumberShort } from '@/utils/number'
import React from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { Button, HeaderTextField } from '..'
import Icon from '../Icon'
import Tooltip from '../Tooltip'
import {
  CoverImage,
  EditableOverlay,
  EditCoverButton,
  Header,
  Media,
  MediaWrapper,
  RemoveCoverButton,
  StyledAvatar,
  StyledButtonContainer,
  SubTitle,
  SubTitlePlaceholder,
  Title,
  TitleContainer,
  TitlePlaceholder,
  TitleSection,
} from './ChannelCover.style'

type BasicChannelCoverProps = {
  isFollowing?: boolean
  channel?: AllChannelFieldsFragment
  handleFollow?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}
type EditableProps =
  | {
      editable?: false
      handleEditCover?: never
      handleRemovecover?: never
      handleChangeName?: never
    }
  | {
      editable: true
      handleEditCover?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
      handleRemovecover?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
      handleChangeName?: (e: React.ChangeEvent<HTMLInputElement>) => void
    }

export type ChannelCoverProps = BasicChannelCoverProps & EditableProps

const ChannelCover: React.FC<ChannelCoverProps> = ({
  channel,
  handleFollow,
  isFollowing,
  editable,
  handleRemovecover,
  handleEditCover,
  handleChangeName,
}) => {
  const showBgPattern = !channel?.coverPhotoUrl

  return (
    <Header>
      <MediaWrapper>
        <Media>
          <TransitionGroup>
            <CSSTransition
              key={showBgPattern ? 'pattern' : 'cover'}
              timeout={parseInt(transitions.timings.loading)}
              classNames={transitions.names.fade}
            >
              {showBgPattern ? <BackgroundPattern /> : <CoverImage src={channel?.coverPhotoUrl!} />}
            </CSSTransition>
          </TransitionGroup>
        </Media>
        {editable && (
          <EditableOverlay withImage={!!channel?.coverPhotoUrl}>
            <EditCoverButton onClick={handleEditCover}>
              <Icon name="camera" />
              <span>Click Anywhere to {channel?.coverPhotoUrl ? 'Edit' : 'Add'} Cover Image</span>
            </EditCoverButton>
            {channel?.coverPhotoUrl && (
              <RemoveCoverButton onClick={handleRemovecover}>
                <Icon name="trash" />
                <span>Remove cover</span>
              </RemoveCoverButton>
            )}
          </EditableOverlay>
        )}
      </MediaWrapper>
      <TitleSection className={transitions.names.slide}>
        <StyledAvatar imageUrl={channel?.avatarPhotoUrl} size="view" loading={!channel} editable={editable} />
        <TitleContainer>
          {channel ? (
            <>
              {editable ? (
                <>
                  <Tooltip text="Click to edit channel title">
                    <HeaderTextField value={channel?.handle} onChange={handleChangeName} />
                  </Tooltip>
                  <br />
                  <SubTitle>{channel.follows ? formatNumberShort(channel.follows) : 0} Followers</SubTitle>
                </>
              ) : (
                <>
                  <Title variant="h1">{channel.handle}</Title>
                  <SubTitle>{channel.follows ? formatNumberShort(channel.follows) : 0} Followers</SubTitle>
                </>
              )}
            </>
          ) : (
            <>
              <TitlePlaceholder />
              <SubTitlePlaceholder />
            </>
          )}
        </TitleContainer>
        <StyledButtonContainer>
          {handleFollow && (
            <Button variant={isFollowing ? 'secondary' : 'primary'} onClick={handleFollow}>
              {isFollowing ? 'Unfollow' : 'Follow'}
            </Button>
          )}
        </StyledButtonContainer>
      </TitleSection>
    </Header>
  )
}

export default ChannelCover
