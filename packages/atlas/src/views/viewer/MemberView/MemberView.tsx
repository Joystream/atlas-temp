import React, { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { VideoOrderByInput } from '@/api/queries'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { ViewWrapper } from '@/components/ViewWrapper'
import { Select } from '@/components/_inputs/Select'
import { SORT_OPTIONS } from '@/config/sorting'

import { MemberAbout } from './MemberAbout'
import { SortContainer, StyledTabs, TabsContainer } from './MemberView.styles'

const TABS = ['NFTs', 'Activity', 'About'] as const

export const MemberView: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentTabName = searchParams.get('tab') as typeof TABS[number] | null
  const [currentTab, setCurrentTab] = useState<typeof TABS[number] | null>(null)
  const [sortActivityBy, setSortActivityBy] = useState<VideoOrderByInput>(VideoOrderByInput.CreatedAtDesc)

  const handleSetCurrentTab = async (tab: number) => {
    setSearchParams({ 'tab': TABS[tab] }, { replace: true })
  }
  const handleSorting = (value?: unknown) => {
    if (value) {
      setSortActivityBy(value as VideoOrderByInput)
    }
  }
  const mappedTabs = TABS.map((tab) => ({ name: tab, badgeNumber: 0 }))
  const tabContent = React.useMemo(() => {
    switch (currentTab) {
      case 'NFTs':
        return 'NFTs'
      case 'Activity':
        return 'Activity'
      case 'About':
        return <MemberAbout />
    }
  }, [currentTab])

  // At mount set the tab from the search params
  const initialRender = useRef(true)
  useEffect(() => {
    if (initialRender.current) {
      const tabIndex = TABS.findIndex((t) => t === currentTabName)
      if (tabIndex === -1) setSearchParams({ 'tab': 'NFTs' }, { replace: true })
      initialRender.current = false
    }
  })

  useEffect(() => {
    if (currentTabName) {
      setCurrentTab(currentTabName)
    }
  }, [currentTabName])

  return (
    <ViewWrapper>
      <LimitedWidthContainer>
        <TabsContainer>
          <StyledTabs
            selected={TABS.findIndex((x) => x === currentTab)}
            initialIndex={0}
            tabs={mappedTabs}
            onSelectTab={handleSetCurrentTab}
          />

          {currentTab === 'Activity' && (
            <SortContainer>
              <Select
                size="small"
                labelPosition="left"
                value={sortActivityBy}
                items={SORT_OPTIONS}
                onChange={handleSorting}
              />
            </SortContainer>
          )}
        </TabsContainer>
        {tabContent}
      </LimitedWidthContainer>
    </ViewWrapper>
  )
}
