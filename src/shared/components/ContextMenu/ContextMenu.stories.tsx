import { Meta, Story } from '@storybook/react'
import React from 'react'

import { usePopover } from '@/hooks/usePopover'
import { OverlayManagerProvider } from '@/providers/overlayManager'
import { SvgGlyphCopy, SvgGlyphEdit, SvgGlyphTrash } from '@/shared/icons'

import { ContextMenu, ContextMenuItem } from './ContextMenu'

import { Button } from '../Button'

export default {
  title: 'Shared/C/ContextMenu',
  component: ContextMenu,
  decorators: [
    (Story) => (
      <OverlayManagerProvider>
        <Story />
      </OverlayManagerProvider>
    ),
  ],
} as Meta

const Template: Story = (args) => {
  const { togglePopover, closePopover, targetRef, isVisible, popperRef } = usePopover()

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button ref={targetRef} onClick={togglePopover}>
          Open menu on the left side
        </Button>
      </div>
      <div>
        <ContextMenu popperRef={popperRef} targetRef={targetRef} isVisible={isVisible} {...args}>
          <ContextMenuItem icon={<SvgGlyphEdit />} onClick={closePopover}>
            Edit video
          </ContextMenuItem>
          <ContextMenuItem icon={<SvgGlyphCopy />} onClick={closePopover}>
            Copy video URL
          </ContextMenuItem>
          <ContextMenuItem icon={<SvgGlyphTrash />} onClick={closePopover}>
            Delete video
          </ContextMenuItem>
        </ContextMenu>
      </div>
    </>
  )
}

export const Regular = Template.bind({})
