import React from 'react'
import { Container, HelperText, StyledInput } from './HeaderTextField.style'

export type HeaderTextFieldProps = {
  name?: string
  value: string
  helperText?: string
  placeholder?: string
  error?: boolean
  warning?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
}

const HeaderTextField = React.forwardRef<HTMLInputElement, HeaderTextFieldProps>(
  ({ name, value, helperText, placeholder, error, warning, onChange, className }, ref) => {
    const controlled = onChange?.name === 'onChange'
    return (
      <Container className={className}>
        <StyledInput
          ref={ref}
          name={name}
          placeholder={placeholder}
          type="text"
          defaultValue={value}
          onChange={onChange}
          widthSize={controlled ? value.length : null}
        />
        {helperText && (
          <HelperText variant="body1" error={error} warning={warning}>
            {helperText}
          </HelperText>
        )}
      </Container>
    )
  }
)

HeaderTextField.displayName = 'HeaderTextField'

export default HeaderTextField
