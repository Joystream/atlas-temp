import { FC, useState } from 'react'

import { Text } from '@/components/Text'
import { SvgActionChevronL, SvgActionChevronR } from '@/components/_icons'

import {
  GridWrapper,
  SettingsHeader,
  SettingsListItemWrapper,
  SettingsUnorderedList,
  SettingsWrapper,
  StyledSvgActionCheck,
} from './Settings.styles'

export type SettingValue = string | number | boolean

type SettingsListItemProps = {
  label: string
  value: SettingValue
  isOption?: boolean
  checked?: boolean
  toggleable?: boolean
  onSettingClick?: (setting: { value: SettingValue; label: string }) => void
}

export type SettingsProps = {
  settings: Setting[]
}

export type Setting = {
  options: SettingsListItemProps[]
} & SettingsListItemProps

export const Settings: FC<SettingsProps> = ({ settings }) => {
  const [openedOption, setOpenedOption] = useState<string | null>(null)

  const baseMenu: Setting[] = settings.map((s) => ({
    ...s,
    onSettingClick: ({ label }) => setOpenedOption(label),
  }))

  const selectedOptions = settings?.find((s) => s.label === openedOption)

  const options = selectedOptions
    ? (selectedOptions.options.map((opt) => ({
        ...opt,
        onSettingClick: (setting) => {
          opt?.onSettingClick?.(setting)
          setOpenedOption(null)
        },
      })) as SettingsListItemProps[])
    : []

  return (
    <>
      {openedOption === null ? (
        <SettingList title="Settings" settings={baseMenu} />
      ) : (
        <SettingList
          title={openedOption}
          isOption
          onHeaderClick={() => {
            return setOpenedOption(null)
          }}
          settings={options}
        />
      )}
    </>
  )
}

type SettingsListProps = {
  title: string
  settings?: SettingsListItemProps[]
  onHeaderClick?: () => void
  isOption?: boolean
}

export const SettingList: FC<SettingsListProps> = ({ settings, title, onHeaderClick, isOption = false }) => {
  return (
    <SettingsWrapper>
      <SettingsHeader
        isClickable={isOption}
        onClick={(e) => {
          e.stopPropagation()
          onHeaderClick?.()
        }}
      >
        {isOption && <SvgActionChevronL />}
        <Text variant="h100" secondary>
          {title}
        </Text>
      </SettingsHeader>
      <SettingsUnorderedList>
        {settings?.map((setting, idx) => (
          <SettingsListItem isOption={isOption} key={idx} {...setting} />
        ))}
      </SettingsUnorderedList>
    </SettingsWrapper>
  )
}

const SettingsListItem: FC<SettingsListItemProps> = ({
  label,
  value,
  checked,
  toggleable,
  onSettingClick,
  isOption = false,
}) => {
  return (
    <SettingsListItemWrapper
      onClick={(e) => {
        e.stopPropagation()
        onSettingClick?.({ value, label })
      }}
    >
      <GridWrapper>
        {isOption && <StyledSvgActionCheck checked={checked} />}
        <Text variant="t200">{label}</Text>
      </GridWrapper>
      {!isOption && (
        <GridWrapper>
          <Text variant="t100" secondary>
            {value}
          </Text>
          {!toggleable && <SvgActionChevronR />}
        </GridWrapper>
      )}
    </SettingsListItemWrapper>
  )
}
