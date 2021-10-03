import styled from '@emotion/styled'

import { Text } from '@/shared/components/Text'
import { colors, media, sizes } from '@/shared/theme'

export const VideoHeroHeader = styled.header`
  margin-top: ${sizes(8)};
  display: flex;
  align-items: center;
`
export const Divider = styled.div`
  width: 1px;
  align-self: stretch;
  background-color: ${colors.gray[600]};
  margin: 0 ${sizes(2)};

  ${media.md} {
    margin: 0 ${sizes(4)};
  }
`

export const VideoHeroHeaderTitle = styled(Text)`
  margin-left: ${sizes(2)};
`
