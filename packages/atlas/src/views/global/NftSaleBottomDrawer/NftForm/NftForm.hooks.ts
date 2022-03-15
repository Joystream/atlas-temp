import { differenceInMilliseconds, intervalToDuration } from 'date-fns'
import { useCallback, useState } from 'react'

import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { pluralizeNoun } from '@/utils/misc'
import { daysToMilliseconds } from '@/utils/time'

import { AuctionDatePickerValue, Listing } from './NftForm.types'

export const useNftForm = () => {
  const [activeInputs, setActiveInputs] = useState<string[]>([])
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [listingType, setListingType] = useState<Listing>('Auction')
  const [currentStep, setCurrentStep] = useState(0)

  const { convertDurationToBlocks } = useBlockTimeEstimation()

  const getTotalDaysAndHoursText = (start: Date, end: Date) => {
    const { days, hours } = intervalToDuration({
      start,
      end,
    })

    const parsedDays = days ? pluralizeNoun(days, 'Day') : ''
    const parsedHours = hours !== undefined ? (hours >= 1 ? pluralizeNoun(hours, 'Hour') : 'Less than an hour') : ''
    return `${parsedDays} ${parsedHours}`
  }

  const nextStep = useCallback(() => setCurrentStep((step) => step + 1), [])
  const previousStep = useCallback(() => setCurrentStep((step) => step - 1), [])

  const getNumberOfBlocksAndDaysLeft = (startDate: AuctionDatePickerValue, endDate: AuctionDatePickerValue) => {
    const isStartDateAndEndDateValid = startDate?.type === 'date' && endDate?.type === 'date'
    const now = new Date(Date.now())

    if (isStartDateAndEndDateValid) {
      return {
        blocks: convertDurationToBlocks(differenceInMilliseconds(endDate.date, startDate.date)),
        daysAndHoursText: getTotalDaysAndHoursText(startDate.date, endDate.date),
      }
    }
    if (endDate?.type === 'date') {
      return {
        blocks: convertDurationToBlocks(differenceInMilliseconds(endDate.date, now)),
        daysAndHoursText: getTotalDaysAndHoursText(endDate.date, now),
      }
    }
    if (endDate?.type === 'duration') {
      return {
        blocks: endDate.durationDays === null ? 0 : convertDurationToBlocks(daysToMilliseconds(endDate.durationDays)),
        daysAndHoursText:
          endDate.durationDays === null ? 'No expiration date' : pluralizeNoun(endDate.durationDays, 'day'),
      }
    }
    if (!endDate) {
      return {
        blocks: 0,
        daysAndHoursText: 'No expiration date',
      }
    }
  }

  return {
    getTotalDaysAndHoursText,
    getNumberOfBlocksAndDaysLeft,
    state: {
      activeInputs,
      setActiveInputs,
      termsAccepted,
      setTermsAccepted,
      listingType,
      setListingType,
      currentStep,
      nextStep,
      previousStep,
    },
  }
}
