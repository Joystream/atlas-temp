import { Meta, StoryFn } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'

import { SvgActionTrash } from '@/assets/icons'
import { Button } from '@/components/_buttons/Button'
import { Snackbars, useSnackbar } from '@/providers/snackbars'
import { DisplaySnackbarArgs } from '@/providers/snackbars/store'

import { Snackbar, SnackbarProps } from './Snackbar'

export default {
  title: 'other/Snackbar',
  component: Snackbar,
  argTypes: {
    icon: { table: { disable: true } },
    onActionClick: { table: { disable: true } },
    onMouseEnter: { table: { disable: true } },
    onMouseLeave: { table: { disable: true } },
  },
  args: {
    title: 'Lorem ipsul dolor',
    description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nemo, veniam assumenda!',
    actionText: 'Action',
    timeout: null,
    actionIcon: null,
  },
  decorators: [
    (Story) => (
      <>
        <BrowserRouter>
          <Story />
          <Snackbars />
        </BrowserRouter>
      </>
    ),
  ],
} as Meta<SnackbarProps>

const ClickableTemplate: StoryFn<DisplaySnackbarArgs> = ({ ...args }) => {
  const { displaySnackbar } = useSnackbar()
  return (
    <Button
      size="small"
      onClick={() => displaySnackbar({ ...args, actionIcon: args.actionIcon !== null && <SvgActionTrash /> })}
    >
      Show snackbar
    </Button>
  )
}

export const Clickable = ClickableTemplate.bind({})
