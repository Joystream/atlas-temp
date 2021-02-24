import React, { useState } from 'react'
import Icon from '../Icon'
import { CheckboxLabel, Checkmark, Container, InnerContainer, Input, LabelText } from './Checkbox.styles'

type HTMLCheckboxProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
export interface CheckboxProps extends Omit<HTMLCheckboxProps, 'value' | 'onChange' | 'checked' | 'multiple' | 'ref'> {
  value: boolean
  disabled?: boolean
  indeterminate?: boolean
  error?: boolean
  className?: string
  onChange?: (value: boolean) => void
  onFocus?: (event: React.FocusEvent<HTMLDivElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLDivElement>) => void
  label?: string
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { value, indeterminate, onChange, disabled = false, onFocus, onBlur, error = false, className, label, ...props },
    ref
  ) => {
    const isIndeterminate = indeterminate || false
    const isSelected = !!value
    const [isFocused, setIsFocused] = useState(false)

    const onChangeHandler = (e: React.FocusEvent<HTMLInputElement>) => {
      if (!disabled && onChange) {
        onChange(!value)
      }
    }
    const onFocusHandler = (e: React.FocusEvent<HTMLInputElement>) => {
      if (!disabled) {
        setIsFocused(true)
        if (onFocus) {
          onFocus(e)
        }
      }
    }
    const onBlurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
      if (!disabled) {
        setIsFocused(false)
        if (onBlur) {
          onBlur(e)
        }
      }
    }
    return (
      <CheckboxLabel disabled={disabled}>
        <Container selected={value} disabled={disabled} isFocused={isFocused} error={error}>
          <InnerContainer selected={value} disabled={disabled} error={error} isFocused={isFocused}>
            <Input
              ref={ref}
              type="checkbox"
              data-multiple="false"
              checked={isSelected}
              disabled={disabled}
              onChange={onChangeHandler}
              onFocus={onFocusHandler}
              onBlur={onBlurHandler}
              {...props}
            />
            <Checkmark>{isSelected ? <Icon name={isIndeterminate ? 'dash' : 'check'} /> : null}</Checkmark>
          </InnerContainer>
        </Container>
        {label && <LabelText variant="subtitle2">{label}</LabelText>}
      </CheckboxLabel>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox
