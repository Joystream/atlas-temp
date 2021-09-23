import { useRef, useState } from 'react'

import { useOnClickOutside } from './useOnClickOutside'

export const usePopover = <T extends HTMLElement = HTMLButtonElement>() => {
  const [isVisible, setIsVisible] = useState(false)
  const targetRef = useRef<T>(null)
  const popperRef = useRef(null)

  useOnClickOutside({
    ref: popperRef,
    handler: () => {
      if (isVisible) {
        setIsVisible(false)
      }
    },
  })

  return {
    targetRef,
    popperRef,
    openPopover: () => setIsVisible(true),
    closePopover: () => setIsVisible(false),
    togglePopover: () => setIsVisible((value) => !value),
    isVisible,
  }
}
