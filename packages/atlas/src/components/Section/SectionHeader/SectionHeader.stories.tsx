import { Meta, StoryFn } from '@storybook/react'
import { useState } from 'react'

import { SvgActionAuction, SvgActionCalendar, SvgActionClock, SvgActionMember } from '@/assets/icons'
import { FilterButtonOption } from '@/components/FilterButton'
import { OverlayManagerProvider } from '@/providers/overlayManager'

import { AppliedFilters } from './SectionFilters/SectionFilters'
import { SectionHeader, SectionHeaderProps } from './SectionHeader'

import { SelectItem } from '../../_inputs/Select'

const TABS = [
  {
    name: 'Videos',
  },
  {
    name: 'NFTs',
  },
  {
    name: 'Token',
  },
  {
    name: 'Information',
  },
  {
    name: 'About',
  },
]

const ORDER_ITEMS: SelectItem[] = [
  { name: 'Newest', value: 'newest' },
  { name: 'Oldest', value: 'oldest' },
  { name: 'Most popular', value: 'popular' },
]

const NFT_STATUSES: FilterButtonOption[] = [
  {
    value: 'AuctionTypeEnglish',
    selected: false,
    applied: false,
    label: 'Timed auction',
  },
  {
    value: 'AuctionTypeOpen',
    selected: false,
    applied: false,
    label: 'Open auction',
  },
  {
    value: 'TransactionalStatusBuyNow',
    selected: false,
    applied: false,
    label: 'Fixed price',
  },
  {
    value: 'TransactionalStatusIdle',
    selected: false,
    applied: false,
    label: 'Not for sale',
  },
]

const DATE_UPLOADED: FilterButtonOption[] = [
  {
    label: 'Last 24 hours',
    selected: false,
    applied: false,
    value: '1',
  },
  {
    label: 'Last 7 days',
    selected: false,
    applied: false,
    value: '7',
  },
  {
    label: 'Last 30 days',
    selected: false,
    applied: false,
    value: '30',
  },
  {
    label: 'Last 365 days',
    selected: false,
    applied: false,
    value: '365',
  },
]

const LENGTHS: FilterButtonOption[] = [
  { label: 'Less than 4 minutes', selected: false, applied: false, value: '0-to-4' },
  { label: '4 to 10 minutes', selected: false, applied: false, value: '4-to-10' },
  { label: 'More than 10 minutes', selected: false, applied: false, value: '4-to-9999' },
]

const OTHER: FilterButtonOption[] = [
  { label: 'Paid promotional material', selected: false, applied: false, value: 'promotional' },
  { label: 'Mature content rating', selected: false, applied: false, value: 'mature' },
]

const INITIAL_STATE = {
  date: DATE_UPLOADED,
  length: LENGTHS,
  status: NFT_STATUSES,
  other: OTHER,
}

export default {
  title: 'other/SectionHeader',
  component: SectionHeader,
  args: {
    start: {
      type: 'title',
      title: 'Videos',
    },
  },
  decorators: [
    (Story) => (
      <OverlayManagerProvider>
        <Story />
      </OverlayManagerProvider>
    ),
  ],
} as Meta<SectionHeaderProps>

const DefaultTemplate: StoryFn<SectionHeaderProps> = (args) => {
  return <SectionHeader {...args} />
}

export const Default = DefaultTemplate.bind({})
Default.args = {}

const WithTabsTemplate = () => {
  const [options, setOptions] = useState<AppliedFilters<keyof typeof INITIAL_STATE>>(INITIAL_STATE)

  return (
    <div style={{ display: 'grid', gap: 64 }}>
      <SectionHeader
        search={{}}
        start={{
          type: 'tabs',
          tabsProps: {
            tabs: TABS,
            onSelectTab: () => null,
            selected: 0,
          },
        }}
        sort={{
          type: 'select',
          selectProps: {
            value: 'oldest',
            inlineLabel: 'Sort by',
            items: ORDER_ITEMS,
          },
        }}
        filters={[
          {
            type: 'radio',
            name: 'date',
            label: 'Date uploaded',
            icon: <SvgActionCalendar />,
            options: options.date,
          },
          {
            label: 'Length',
            name: 'length',
            type: 'radio',
            icon: <SvgActionClock />,
            options: options.length,
          },
          {
            type: 'checkbox',
            label: 'Status',
            name: 'status',
            icon: <SvgActionAuction />,
            options: options.status,
          },
          {
            type: 'checkbox',
            name: 'other',
            label: 'Other filters',
            options: options.other,
          },
        ]}
        onApplyFilters={(options) => setOptions(options)}
      />

      <SectionHeader
        search={{}}
        start={{
          type: 'tabs',
          tabsProps: {
            tabs: [...TABS, { name: 'More Tabs' }, { name: 'Moooar tabs' }],
            onSelectTab: () => null,
            selected: 0,
          },
        }}
        sort={{
          type: 'select',
          selectProps: {
            value: 'oldest',
            inlineLabel: 'Sort by',
            items: ORDER_ITEMS,
          },
        }}
      />
    </div>
  )
}

export const WithTabs = WithTabsTemplate.bind({})

const WithTitleTemplate: StoryFn<SectionHeaderProps> = () => {
  const [filters, setFilters] = useState(INITIAL_STATE)

  return (
    <div style={{ display: 'grid', gap: 64 }}>
      <SectionHeader
        sort={{
          type: 'select',
          selectProps: {
            value: 'oldest',
            inlineLabel: 'Sort by',
            items: ORDER_ITEMS,
          },
        }}
        start={{
          type: 'title',
          title: 'Icon',
          nodeStart: {
            type: 'avatar',
            avatarProps: {
              assetUrl: 'https://placekitten.com/g/200/300',
            },
          },
        }}
      />
      <SectionHeader
        sort={{
          type: 'select',
          selectProps: {
            value: 'oldest',
            inlineLabel: 'Sort by',
            items: ORDER_ITEMS,
          },
        }}
        start={{
          type: 'title',
          title: 'Icon',
          nodeStart: {
            type: 'icon',
            iconWrapperProps: {
              icon: <SvgActionMember />,
            },
          },
        }}
        filters={[
          {
            type: 'radio',
            name: 'date',
            label: 'Date uploaded',
            icon: <SvgActionCalendar />,
            options: DATE_UPLOADED,
          },
          {
            label: 'Length',
            name: 'length',
            type: 'radio',
            icon: <SvgActionClock />,
            options: LENGTHS,
          },
          {
            type: 'checkbox',
            label: 'Status',
            name: 'status',
            icon: <SvgActionAuction />,
            options: NFT_STATUSES,
          },
          {
            type: 'checkbox',
            name: 'other',
            label: 'Other filters',
            options: OTHER,
          },
        ]}
      />
      <SectionHeader
        start={{
          type: 'title',
          title: 'Custom title',
          nodeStart: {
            type: 'custom',
            node: <div style={{ width: 24, height: 24, background: 'blue', borderRadius: 5 }} />,
          },
        }}
        sort={{
          type: 'toggle-button',
          toggleButtonOptionTypeProps: {
            type: 'options',
            options: ['Newest', 'Oldest'],
            onChange: () => null,
          },
        }}
        filters={[
          {
            type: 'radio',
            name: 'date',
            label: 'Date uploaded',
            icon: <SvgActionCalendar />,
            options: DATE_UPLOADED,
          },
          {
            label: 'Length',
            name: 'length',
            type: 'radio',
            icon: <SvgActionClock />,
            options: LENGTHS,
          },
          {
            type: 'checkbox',
            label: 'Status',
            name: 'status',
            icon: <SvgActionAuction />,
            options: NFT_STATUSES,
          },
          {
            type: 'checkbox',
            name: 'other',
            label: 'Other filters',
            options: OTHER,
          },
        ]}
        search={{}}
      />
    </div>
  )
}

export const WithTitle = WithTitleTemplate.bind({})
