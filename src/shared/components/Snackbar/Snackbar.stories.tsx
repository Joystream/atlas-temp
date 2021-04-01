import Snackbar, { SnackbarProps } from './Snackbar'
import React from 'react'
import { Meta, Story } from '@storybook/react'
import Button from '../Button'
import { SnackbarProvider, useSnackbar, DisplaySnackbarArgs } from '@/hooks/useSnackbar/useSnackbar'

export default {
  title: 'Shared/Snackbar',
  component: Snackbar,
  args: {
    message: '(2) Videos added to edit',
    subMessage: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nemo, veniam assumenda!',
    actionText: 'Action',
  },
  decorators: [
    (Story) => (
      <SnackbarProvider>
        <Story />
      </SnackbarProvider>
    ),
  ],
} as Meta

const Template: Story<SnackbarProps> = (args) => <Snackbar {...args} />

const ClickableTemplate: Story<DisplaySnackbarArgs> = ({ time, message, icon, buttonText }) => {
  const { displaySnackbar } = useSnackbar()
  return (
    <>
      <Button size="small" onClick={() => displaySnackbar({ message, icon: 'success', time, buttonText })}>
        Show snackbar
      </Button>
      <Button size="small" onClick={() => displaySnackbar({ message: 'hej', icon, time, buttonText })}>
        Show snackbar
      </Button>
    </>
  )
}

export const Default = Template.bind({})

export const Clickable = ClickableTemplate.bind({})

Clickable.argTypes = {
  time: { type: 'number' },
}
