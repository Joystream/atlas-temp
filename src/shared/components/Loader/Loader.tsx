import React from 'react'
import Lottie from 'react-lottie-player'

import loaderLargeAnimation from '../../assets/animations/loader-L.json'
import loaderMediumAnimation from '../../assets/animations/loader-M.json'
import loaderSmallAnimation from '../../assets/animations/loader-S.json'
import LoaderXSmallAnimation from '../../assets/animations/loader-XS.json'
import loaderPlayerAnimation from '../../assets/animations/loader-player.json'

type LoaderVariant = 'xlarge' | 'large' | 'medium' | 'small' | 'xsmall' | 'player'
type LoaderProps = {
  variant?: LoaderVariant
}
type LoaderConfig = {
  data: object
  size: number
}

const VARIANT_TO_CONFIG: Record<LoaderVariant, LoaderConfig> = {
  xlarge: { data: loaderLargeAnimation, size: 216 },
  large: { data: loaderLargeAnimation, size: 108 },
  medium: { data: loaderMediumAnimation, size: 36 },
  small: { data: loaderSmallAnimation, size: 24 },
  xsmall: { data: LoaderXSmallAnimation, size: 16 },
  player: { data: loaderPlayerAnimation, size: 72 },
}

export const Loader: React.FC<LoaderProps> = ({ variant = 'medium' }) => {
  const config = VARIANT_TO_CONFIG[variant]
  return <Lottie play animationData={config.data} style={{ width: config.size, height: config.size }} />
}
