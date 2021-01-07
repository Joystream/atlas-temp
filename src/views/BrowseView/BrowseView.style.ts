import styled from '@emotion/styled'
import { CategoryPicker, InfiniteVideoGrid, Text } from '@/shared/components'

import { ReactComponent as BackgroundPattern } from '@/assets/bg-pattern.svg'
import { breakpoints, colors, sizes, zIndex } from '@/shared/theme'
import { NAVBAR_HEIGHT } from '@/components/Navbar'

type IsAtTop = {
  isAtTop: boolean
}

const PATTERN_OFFSET = {
  SMALL: '-150px',
  MEDIUM: '75px',
  LARGE: 100,
  XLARGE: 200,
  XXLARGE: 300,
}

export const GRID_TOP_PADDING = sizes(2, true)
export const Header = styled(Text)`
  margin: 0 0 ${sizes(10)} 0;
`
export const StyledCategoryPicker = styled(CategoryPicker)<IsAtTop>`
  z-index: ${zIndex.overlay};
  position: sticky;
  /*Offset Category Picker by Navbar Height */
  top: ${NAVBAR_HEIGHT}px;
  padding: ${sizes(5)} var(--global-horizontal-padding) ${sizes(2)};
  margin: 0 calc(-1 * var(--global-horizontal-padding));
  background-color: ${(props) => (props.isAtTop ? colors.transparent : colors.black)};
  border-bottom: 1px solid ${(props) => (props.isAtTop ? colors.black : colors.gray[800])};
`
export const StyledInfiniteVideoGrid = styled(InfiniteVideoGrid)`
  padding-top: ${GRID_TOP_PADDING}px;
`

export const Container = styled.div`
  position: relative;
  padding-top: ${sizes(14)};
  overflow-x: hidden;
`
export const IntersectionTarget = styled.div`
  min-height: 1px;
`

export const StyledBackgroundPattern = styled(BackgroundPattern)`
  position: absolute;
  top: 73px;
  right: 80px;
  z-index: ${zIndex.background};
  transform: scale(1.3);

  @media screen and (min-width: ${breakpoints.base}) {
    display: none;
  }
  @media screen and (min-width: ${breakpoints.small}) {
    display: block;
    right: ${PATTERN_OFFSET.SMALL};
  }
  @media screen and (min-width: ${breakpoints.medium}) {
    right: ${PATTERN_OFFSET.MEDIUM};
  }
`
