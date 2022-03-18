import { formatDuration, intervalToDuration } from 'date-fns'
import { z } from 'zod'

import { AuctionDatePickerValue } from '@/components/_inputs/AuctionDatePicker'
import { pluralizeNoun } from '@/utils/misc'

import { Listing, NftFormFields } from './NftForm.types'

export const createValidationSchema = (data: NftFormFields, listingType: Listing, minStartingPrice: number) => {
  const auctionDateType = z
    .union([
      z.object({
        type: z.literal('date'),
        date: z.date(),
      }),
      z.object({
        type: z.literal('duration'),
        durationDays: z.number(),
      }),
    ])
    .nullable()
    .optional()

  const buyNowPrice = z
    .number({ required_error: 'Buy now price must be provided', invalid_type_error: 'Buy now price must be a number' })
    .min(1, 'Buy now price cannot be lower than 1')

  return z.object({
    startDate: auctionDateType
      .refine(
        (val) => {
          if (val?.type === 'date') {
            return new Date() < val.date
          }
          return true
        },
        { message: 'You cannot select a past date as a start of an auction' }
      )
      .refine(
        (val) => {
          const endDate = data.endDate
          if (val?.type === 'date' && endDate?.type === 'date') {
            return endDate.date > val.date
          }
          return true
        },
        { message: 'Expiration date cannot be earlier than starting date' }
      ),
    endDate: auctionDateType
      .refine(
        (val) => {
          if (val?.type === 'date') {
            return new Date() < val.date
          }
          return true
        },
        { message: 'You cannot select a past date as an end of an auction' }
      )
      .refine(
        (val) => {
          const startDate = data.startDate
          if (val?.type === 'date' && startDate?.type === 'date') {
            return startDate.date < val.date
          }
          return true
        },
        { message: 'Expiration date cannot be earlier than starting date' }
      ),
    royalty: z.number().nullable().optional(),
    startingPrice: z
      .number({ invalid_type_error: 'Minimum bid must be a number' })
      .min(minStartingPrice, `Minimum bid cannot be lower than ${minStartingPrice}`)
      .optional(),
    buyNowPrice: listingType === 'Auction' ? buyNowPrice.nullable().optional() : buyNowPrice,
    auctionDurationBlocks: z.number().nullable().optional(),
    whitelistedMembersIds: z.array(z.string()).nullable().optional(),
  })
}

export const getTotalDaysAndHours = (startDate: AuctionDatePickerValue, endDate: AuctionDatePickerValue) => {
  const start = (startDate?.type === 'date' && startDate.date) || new Date()

  if (endDate?.type === 'date') {
    const { days, hours } = intervalToDuration({ start: start, end: endDate.date })
    const duration = formatDuration({ hours: hours, days: days }, { format: ['days', 'hours'] })
    return duration ? duration : 'Less than 1 hour'
  }
  if (endDate?.type === 'duration') {
    return pluralizeNoun(endDate.durationDays, 'Day')
  }
}
