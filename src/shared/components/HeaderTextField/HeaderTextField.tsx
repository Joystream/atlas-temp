import React, { useRef, useEffect } from 'react'
import { Container, WarningText, StyledInput } from './HeaderTextField.style'

export type Variant = 'default' | 'error' | 'warning'

export type HeaderTextFieldProps = {
  value: string
  warningText?: string
  errorText?: string
  onChange: (value: string) => void
  variant?: Variant
}
type ChangeEvent = React.ChangeEvent<HTMLInputElement>

const HeaderTextField = React.forwardRef<HTMLInputElement, HeaderTextFieldProps>(
  ({ value, warningText, errorText, onChange, variant = 'default' }, ref) => {
    const inputElement = useRef<HTMLInputElement>(null)
    useEffect(() => {
      if (inputElement.current === null) {
        return
      }
      inputElement.current.style.width = value.length + 'ch'
    }, [inputElement, value.length])

    return (
      <Container>
        <StyledInput
          ref={inputElement}
          type="text"
          value={value}
          onChange={(e: ChangeEvent) => onChange(e.target.value)}
          required
        />
        {variant === 'warning' && <WarningText variant="body1">{warningText}</WarningText>}
        {variant === 'error' && (
          <WarningText variant="body1" error>
            {errorText}
          </WarningText>
        )}
      </Container>
    )
  }
)

HeaderTextField.displayName = 'HeaderTextField'

export default HeaderTextField
