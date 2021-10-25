import { throttle } from 'lodash-es'
import React, { useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { languages } from '@/config/languages'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { Button } from '@/shared/components/Button'
import { SvgActionFilters } from '@/shared/icons'
import { transitions } from '@/shared/theme'

import { BackgroundGradient, FiltersWrapper, StyledSelect, TAB_WIDTH, Tab, TabsGroup, TabsWrapper } from './Tabs.styles'

export type TabItem = {
  name: string
  badgeNumber?: number
}
export type TabsProps = {
  tabs: TabItem[]
  initialIndex?: number
  onSelectTab: (idx: number) => void
  selected?: number
  className?: string
  onFiltersClick?: () => void
  onSelectedLanguage?: (language: unknown) => void
  selectedLanguage?: unknown
  filtersActive?: boolean
}

const SCROLL_SHADOW_OFFSET = 10

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  onSelectTab,
  initialIndex = -1,
  selected: paramsSelected,
  className,
  onFiltersClick,
  onSelectedLanguage,
  filtersActive,
  selectedLanguage,
}) => {
  const [_selected, setSelected] = useState(initialIndex)
  const selected = paramsSelected ?? _selected
  const [isContentOverflown, setIsContentOverflown] = useState(false)
  const tabsRef = useRef<HTMLDivElement>(null)
  const [shadowsVisible, setShadowsVisible] = useState({
    left: false,
    right: true,
  })
  const smMatch = useMediaMatch('sm')

  useEffect(() => {
    const tabsGroup = tabsRef.current
    if (!tabsGroup) {
      return
    }
    setIsContentOverflown(tabsGroup.scrollWidth > tabsGroup.clientWidth)
  }, [])

  useEffect(() => {
    const tabsGroup = tabsRef.current
    if (!tabsGroup || !isContentOverflown) {
      return
    }
    const { clientWidth, scrollWidth } = tabsGroup

    const middleTabPosition = clientWidth / 2 - TAB_WIDTH / 2
    const currentItemOffsetleft = TAB_WIDTH * selected

    tabsGroup.scrollLeft = currentItemOffsetleft - middleTabPosition

    const touchHandler = throttle(() => {
      setShadowsVisible({
        left: tabsGroup.scrollLeft > SCROLL_SHADOW_OFFSET,
        right: tabsGroup.scrollLeft < scrollWidth - clientWidth - SCROLL_SHADOW_OFFSET,
      })
    }, 100)

    tabsGroup.addEventListener('touchmove', touchHandler)
    tabsGroup.addEventListener('scroll', touchHandler)
    return () => {
      touchHandler.cancel()
      tabsGroup.removeEventListener('touchmove', touchHandler)
      tabsGroup.removeEventListener('scroll', touchHandler)
    }
  }, [isContentOverflown, selected])

  const createClickHandler = (idx?: number) => () => {
    if (idx !== undefined) {
      onSelectTab(idx)
      setSelected(idx)
    }
  }

  return (
    <TabsWrapper className={className}>
      <CSSTransition
        in={shadowsVisible.left && isContentOverflown}
        timeout={100}
        classNames={transitions.names.fade}
        unmountOnExit
      >
        <BackgroundGradient direction="prev" />
      </CSSTransition>
      <TabsGroup ref={tabsRef}>
        {tabs.map((tab, idx) => (
          <Tab onClick={createClickHandler(idx)} key={`${tab.name}-${idx}`} selected={selected === idx}>
            <span data-badge={tab.badgeNumber}>{tab.name}</span>
          </Tab>
        ))}
        <FiltersWrapper>
          {smMatch && onSelectedLanguage && (
            <StyledSelect
              items={languages}
              placeholder="Any language"
              size="small"
              value={selectedLanguage}
              onChange={onSelectedLanguage}
            />
          )}
          {onFiltersClick && (
            <Button
              icon={<SvgActionFilters />}
              iconPlacement="left"
              variant="secondary"
              badge={filtersActive}
              onClick={onFiltersClick}
            >
              {smMatch && 'Filters'}
            </Button>
          )}
        </FiltersWrapper>
      </TabsGroup>
    </TabsWrapper>
  )
}
