import { FC, PropsWithChildren, useEffect, useRef, useState } from 'react'
import Swiper from 'swiper'

import { SectionWrapper } from './Section.styles'
import { SectionContent, SectionContentProps } from './SectionContent'
import { SectionFooter, SectionFooterProps } from './SectionFooter'
import { SectionHeader, SectionHeaderProps } from './SectionHeader'

import { SwiperInstance } from '../Carousel'

export type SectionProps = {
  headerProps?: Omit<SectionHeaderProps, 'isCarousel'>
  contentProps: SectionContentProps
  footerProps?: SectionFooterProps
  className?: string
}

export const Section: FC<PropsWithChildren<SectionProps>> = ({ headerProps, contentProps, footerProps, className }) => {
  const isCarousel = contentProps.type === 'carousel'
  const [isCarouselEnd, setIsCarouselEnd] = useState(false)
  const [isCarouselBeginning, setIsCarouselBeginning] = useState(true)

  const gliderRef = useRef<SwiperInstance>()

  const handleSlideLeft = () => {
    gliderRef.current?.slidePrev()
  }
  const handleSlideRight = () => {
    gliderRef.current?.slideNext()
  }

  useEffect(() => {
    const handler = (slider: Swiper) => {
      setIsCarouselBeginning(slider.isBeginning)
      setIsCarouselEnd(slider.isEnd)
    }
    gliderRef.current?.on('slideChange', handler)

    return () => {
      gliderRef.current?.off('slideChange', handler)
    }
  }, [])

  return (
    <SectionWrapper className={className}>
      {headerProps &&
        (isCarousel ? (
          <SectionHeader
            {...headerProps}
            isBeginning={isCarouselBeginning}
            isEnd={isCarouselEnd}
            isCarousel
            onMoveCarouselLeft={handleSlideLeft}
            onMoveCarouselRight={handleSlideRight}
          />
        ) : (
          <SectionHeader {...headerProps} />
        ))}
      {isCarousel ? (
        contentProps.children.length > 0 && (
          <SectionContent {...contentProps} onSwiper={(swiper) => (gliderRef.current = swiper)} />
        )
      ) : (
        <SectionContent {...contentProps} />
      )}
      {footerProps && <SectionFooter {...footerProps} />}
    </SectionWrapper>
  )
}
