import { FC, useRef } from 'react'

import { SvgActionChevronL, SvgActionChevronR, SvgActionClose } from '@/assets/icons'
import { FilterButton, FilterButtonOption, FilterButtonProps } from '@/components/FilterButton'
import { MobileFilterButton } from '@/components/MobileFilterButton'
import { Button } from '@/components/_buttons/Button'
import { useHorizonthalFade } from '@/hooks/useHorizonthalFade'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { createFiltersObject } from '@/utils/filters'

import {
  ChevronButton,
  ChevronButtonHandler,
  FilterButtonWrapper,
  FiltersWrapper,
  SectionFiltersWrapper,
  VerticalDivider,
} from './SectionFilters.styles'

export type SectionFilter = Omit<FilterButtonProps, 'onChange'>

// todo provide better types
export type AppliedFilters<T extends string = string> = Record<T, FilterButtonOption[]>

type SectionFiltersProps = {
  filters: SectionFilter[]
  onApplyFilters?: (appliedFilters: AppliedFilters) => void
}

export const SectionFilters: FC<SectionFiltersProps> = ({ filters, onApplyFilters }) => {
  const smMatch = useMediaMatch('sm')
  const filterWrapperRef = useRef<HTMLDivElement>(null)

  const { handleMouseDown, visibleShadows, handleArrowScroll, isOverflow } = useHorizonthalFade(filterWrapperRef)

  const areThereAnyOptionsSelected = filters
    .map((filter) => filter.options?.map((option) => option.applied))
    .flat()
    .some(Boolean)

  const handleApply = (name: string, selectedOptions: FilterButtonOption[]) => {
    onApplyFilters?.({
      ...createFiltersObject(filters),
      [name]: selectedOptions,
    })
  }

  const handleResetFilters = () => {
    const newFilters = filters.map((filter) => ({
      ...filter,
      options: filter.options?.map((option) => ({ ...option, selected: false, applied: false })),
    }))

    onApplyFilters?.(createFiltersObject(newFilters))
  }

  if (!smMatch) {
    return <MobileFilterButton filters={filters} onChangeFilters={onApplyFilters} />
  }

  return (
    <SectionFiltersWrapper>
      {areThereAnyOptionsSelected && (
        <>
          <Button icon={<SvgActionClose />} variant="tertiary" onClick={handleResetFilters}>
            Clear
          </Button>
          <VerticalDivider />
        </>
      )}
      <ChevronButtonHandler>
        <FiltersWrapper ref={filterWrapperRef} onMouseDown={handleMouseDown} visibleShadows={visibleShadows}>
          {filters.map((filter, idx) => {
            return (
              <FilterButtonWrapper key={idx}>
                <FilterButton {...filter} onChange={(selectedOptions) => handleApply(filter.name, selectedOptions)} />
              </FilterButtonWrapper>
            )
          })}
        </FiltersWrapper>
        {visibleShadows.left && isOverflow && (
          <ChevronButton
            direction="left"
            size="small"
            variant="tertiary"
            icon={<SvgActionChevronL />}
            onClick={handleArrowScroll('left')}
          />
        )}
        {visibleShadows.right && isOverflow && (
          <ChevronButton
            direction="right"
            size="small"
            variant="tertiary"
            icon={<SvgActionChevronR />}
            onClick={handleArrowScroll('right')}
          />
        )}
      </ChevronButtonHandler>
    </SectionFiltersWrapper>
  )
}
