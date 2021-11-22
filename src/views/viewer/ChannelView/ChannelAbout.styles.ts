import styled from '@emotion/styled'
import React from 'react'

import { Avatar } from '@/components/Avatar'
import { LayoutGrid } from '@/components/LayoutGrid/LayoutGrid'
import { Text } from '@/components/Text'
import { oldColors, sizes } from '@/styles'

export const TextContainer = styled.div`
  display: grid;
  grid-gap: ${sizes(4)};
  padding-bottom: ${sizes(8)};
  margin-bottom: ${sizes(8)};
  border-bottom: 1px solid ${oldColors.gray[600]};
`

export const LinksContainer = styled.div`
  display: grid;
  grid-gap: ${sizes(6)};
`

export const Links = styled.div`
  display: flex;
  flex-wrap: wrap;

  > a {
    margin-right: ${sizes(12)};
    margin-bottom: ${sizes(6)};
  }
`

export const Details = styled.div`
  display: grid;
  gap: ${sizes(2)};
  padding-bottom: ${sizes(4)};
  border-bottom: 1px solid ${oldColors.gray[600]};
  margin-bottom: ${sizes(4)};
`

export const DetailsText = styled(Text)`
  margin-bottom: ${sizes(4)};
`

export const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${sizes(2)};
`

export const StyledAvatar = styled(Avatar)`
  margin-right: ${sizes(2)};
`

export const StyledLayoutGrid = styled(LayoutGrid)`
  margin-bottom: 50px;
`

export const Anchor = styled(Text)<React.HTMLProps<HTMLAnchorElement>>`
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`
