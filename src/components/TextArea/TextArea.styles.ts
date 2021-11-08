import styled from '@emotion/styled'

import resizeIcon from '@/components/icons/svgs/glyph-resize.svg'

export const StyledTextArea = styled.textarea`
  width: 100%;
  resize: vertical;

  ::-webkit-resizer {
    background: url(${resizeIcon}) no-repeat;
  }
`
