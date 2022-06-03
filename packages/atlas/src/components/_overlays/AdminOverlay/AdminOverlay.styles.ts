import styled from '@emotion/styled'

import { Tabs } from '@/components/Tabs'
import { IconButton } from '@/components/_buttons/IconButton'
import { cVar, sizes } from '@/styles'

export const Container = styled.div`
  position: fixed;
  top: 80px;
  right: 32px;
  width: 400px;
  background-color: ${cVar('colorCoreNeutral600')};
  z-index: 1000;
  border-radius: 8px;
  padding: ${sizes(8)} ${sizes(4)};
  opacity: 0.5;
  transition: opacity 200ms ease-in-out;

  :hover {
    opacity: 0.95;
  }
`

export const CloseButton = styled(IconButton)`
  position: absolute;
  top: 4px;
  right: 4px;
`

export const HorizontalSpacedContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  > * + * {
    margin-left: ${sizes(4)};
  }
`

export const VerticalSpacedContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${sizes(4)};

  > * + * {
    margin-top: ${sizes(4)};
  }
`

export const StyledTabs = styled(Tabs)`
  margin-top: 12px;

  > div > div {
    padding: 8px 0;
    width: 80px;
    min-width: 80px;
  }
`

export const CustomNodeUrlWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  > * + * {
    margin-left: ${sizes(4)};
  }
`
