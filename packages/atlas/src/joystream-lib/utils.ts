import BN from 'bn.js'

import { HAPI_TO_JOY_RATE } from '@/joystream-lib/config'
import { ChannelInputAssets, VideoInputAssets } from '@/joystream-lib/types'

const MAX_SAFE_NUMBER_BN = new BN(Number.MAX_SAFE_INTEGER)
const HAPI_TO_JOY_RATE_BN = new BN(HAPI_TO_JOY_RATE)

export const hapiBnToTokenNumber = (bn: BN) => {
  const wholeUnitsBn = bn.div(HAPI_TO_JOY_RATE_BN)
  const fractionalUnitsBn = bn.mod(HAPI_TO_JOY_RATE_BN)

  if (wholeUnitsBn.gt(MAX_SAFE_NUMBER_BN)) {
    throw new Error('Trying to convert unsafe number from BN to number')
  }

  const wholeUnits = wholeUnitsBn.toNumber()
  const fractionalHapiUnits = fractionalUnitsBn.toNumber()
  const fractionalJoyUnits = fractionalHapiUnits / HAPI_TO_JOY_RATE

  return wholeUnits + fractionalJoyUnits
}

export const tokenNumberToHapiBn = (number: number) => {
  const wholeUnits = Math.floor(number)
  const wholeUnitsBn = new BN(wholeUnits)
  const wholeHapiUnitsBn = wholeUnitsBn.mul(HAPI_TO_JOY_RATE_BN)

  const fractionalUnits = number % 1
  const fractionalHapiUnitsBn = new BN(fractionalUnits * HAPI_TO_JOY_RATE)

  return wholeHapiUnitsBn.add(fractionalHapiUnitsBn)
}

export const calculateAssetsSizeFee = (
  dataObjectPerMegabyteFee: BN,
  assets?: VideoInputAssets | ChannelInputAssets
): BN => {
  if (!assets) {
    return new BN(0)
  }

  const totalBytes = Object.values(assets).reduce((acc, asset) => {
    return acc + asset.size
  }, 0)

  const totalMegabytes = new BN(totalBytes).divn(1024 * 1024)
  return dataObjectPerMegabyteFee.mul(totalMegabytes)
}

export const calculateAssetsBloatFee = (
  dataObjectStateBloatBondValue: BN,
  assets?: VideoInputAssets | ChannelInputAssets
) => {
  if (!assets) {
    return new BN(0)
  }
  return dataObjectStateBloatBondValue.muln(Object.values(assets).length)
}
