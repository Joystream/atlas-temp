import React, { useRef, useState } from 'react'
import { parse, isValid } from 'date-fns'
import Datepicker, { DatepickerProps } from './Datepicker'
import { Meta, Story } from '@storybook/react'

export default {
  title: 'Shared/Datepicker',
  component: Datepicker,
  args: {
    helperText: 'Lorem ipsum dolor sit amet...',
  },
} as Meta

const Template: Story<DatepickerProps> = (args) => {
  const ref = useRef<HTMLInputElement | null>(null)
  const [date, setDate] = useState<Date>()
  const [validationError, setValidationError] = useState(false)

  const handleChange: (date: Date) => void = (date) => {
    setDate(date)
  }
  const handleDateValidation = () => {
    if (!date) {
      return
    }
    setValidationError(!isValid(date))
  }

  return (
    <>
      <Datepicker {...args} ref={ref} onChange={handleChange} onBlur={handleDateValidation} error={validationError} />
    </>
  )
}

export const Default = Template.bind({})
