import { throttle } from 'lodash-es'
import { useEffect, useRef, useState } from 'react'
import useDraggableScroll from 'use-draggable-scroll'

import { SvgActionChevronL, SvgActionChevronR } from '@/assets/icons'
import { StyledButton } from '@/components/Tabs/Tabs.styles'
import { Button } from '@/components/_buttons/Button'

import { Anchor, Container, Label, OptionWrapper } from './ToggleButtonGroup.styles'

export type ToggleButtonGroupProps<T extends string> = {
  options: T[]
  value?: T
  label?: string
  size?: 'small' | 'medium' | 'large'
  onChange: (type: T) => void
}

const SCROLL_SHADOW_OFFSET = 10

export const ToggleButtonGroup = <T extends string>({
  label,
  size,
  options,
  value,
  onChange,
}: ToggleButtonGroupProps<T>) => {
  const optionWrapperRef = useRef<HTMLDivElement>(null)
  const [isOverflowing, setIsOverflowing] = useState<boolean>(false)
  const { onMouseDown } = useDraggableScroll(optionWrapperRef, { direction: 'horizontal' })
  const [shadowsVisible, setShadowsVisible] = useState({
    left: false,
    right: false,
  })

  useEffect(() => {
    if (optionWrapperRef.current) {
      setIsOverflowing(optionWrapperRef.current.clientWidth < optionWrapperRef.current.scrollWidth)
    }
  }, [])

  useEffect(() => {
    const optionGroup = optionWrapperRef.current
    if (!optionGroup || !isOverflowing) {
      return
    }
    setShadowsVisible((prev) => ({ ...prev, right: true }))
    const { clientWidth, scrollWidth } = optionGroup

    const touchHandler = throttle(() => {
      setShadowsVisible({
        left: optionGroup.scrollLeft > SCROLL_SHADOW_OFFSET,
        right: optionGroup.scrollLeft < scrollWidth - clientWidth - SCROLL_SHADOW_OFFSET,
      })
    }, 100)

    optionGroup.addEventListener('touchmove', touchHandler, { passive: true })
    optionGroup.addEventListener('scroll', touchHandler)
    return () => {
      touchHandler.cancel()
      optionGroup.removeEventListener('touchmove', touchHandler)
      optionGroup.removeEventListener('scroll', touchHandler)
    }
  }, [isOverflowing])

  const handleArrowScroll = (direction: 'left' | 'right') => () => {
    const optionGroup = optionWrapperRef.current
    if (!optionGroup || !isOverflowing) {
      return
    }

    const addition = (direction === 'left' ? -1 : 1) * (optionGroup.clientWidth / 2)
    optionGroup.scrollLeft = optionGroup.scrollLeft + addition
  }

  return (
    <Container size={size}>
      {label && (
        <Label variant="t100" as="p" color="colorText">
          {label}
        </Label>
      )}
      <Anchor>
        {size === 'medium' && isOverflowing && (
          <StyledButton
            onClick={handleArrowScroll('left')}
            size="small"
            variant="tertiary"
            icon={<SvgActionChevronL />}
          />
        )}
      </Anchor>
      <OptionWrapper
        onMouseDown={onMouseDown}
        ref={optionWrapperRef}
        shadowSide={shadowsVisible.left ? 'left' : 'right'}
      >
        {options.map((option) => (
          <Button
            key={option}
            fullWidth={size === 'small'}
            variant={option !== value ? 'tertiary' : 'secondary'}
            onClick={() => onChange(option)}
          >
            {option}
          </Button>
        ))}
      </OptionWrapper>
      <Anchor>
        {size === 'medium' && isOverflowing && (
          <StyledButton
            onClick={handleArrowScroll('right')}
            size="small"
            variant="tertiary"
            icon={<SvgActionChevronR />}
          />
        )}
      </Anchor>
    </Container>
  )
}
