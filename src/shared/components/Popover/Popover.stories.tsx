import { Meta, Story } from '@storybook/react'
import React from 'react'

import { usePopover } from '@/hooks/usePopover'

import { Popover } from './Popover'

import { Button } from '../Button'
import { Text } from '../Text'

export default {
  title: 'Shared/P/Popover',
  component: Popover,
  argTypes: {},
} as Meta

const Template: Story = () => {
  const { openPopover, targetRef, isVisible, popperRef } = usePopover()

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button ref={targetRef} onClick={openPopover}>
          Open menu on the left side
        </Button>
      </div>
      <div>
        <Popover
          popperRef={popperRef}
          targetRef={targetRef}
          isVisible={isVisible}
          header={"I'm a title"}
          content={
            <>
              <Text>Example text</Text>
              <Text>Example text</Text>
              <Text>Example text</Text>
              <Text>Example text</Text>
              <Text>Example text</Text>
              <Text>Example text</Text>
              <Text>Example text</Text>
              <Text>Example text</Text>
            </>
          }
          footer={
            <>
              <Button variant="secondary">Action1</Button>
              <Button>Action1</Button>
            </>
          }
        />
      </div>
    </>
  )
}

export const Regular = Template.bind({})
