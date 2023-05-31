import { FC } from 'react'

import { Dialog, DialogProps } from '@/components/_overlays/Dialog'
import { Modal, ModalProps } from '@/components/_overlays/Modal'

export type DialogModalProps = Pick<ModalProps, 'show' | 'size' | 'onClickOutside' | 'confetti'> &
  Omit<DialogProps, 'size'>

export const DialogModal: FC<DialogModalProps> = ({
  show,
  onExitClick,
  onClickOutside,
  size,
  confetti,
  children,
  ...dialogProps
}) => {
  return (
    <Modal show={show} onExitClick={onExitClick} size={size} onClickOutside={onClickOutside} confetti={confetti}>
      <Dialog {...dialogProps} onExitClick={onExitClick}>
        {children}
      </Dialog>
    </Modal>
  )
}
