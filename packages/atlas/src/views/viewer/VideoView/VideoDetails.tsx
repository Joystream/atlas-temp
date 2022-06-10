import { FC, ReactNode, useState } from 'react'

import { FullVideoFieldsFragment } from '@/api/queries'
import { GridItem } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { SvgActionChevronB, SvgActionChevronT } from '@/components/_icons'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { VideoCategoryData } from '@/config/categories'
import { absoluteRoutes } from '@/config/routes'
import knownLicenses from '@/data/knownLicenses.json'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import {
  Category,
  CategoryWrapper,
  DescriptionBody,
  DescriptionContainer,
  DescriptionCopy,
  DescriptionLink,
  DescriptionSkeletonLoader,
  DescriptionTitle,
  DetailsWrapper,
  ExpandButton,
  LicenceCategoryWrapper,
  LicenseCustomText,
} from './VideoDetails.styles'

type VideoDetailsProps = {
  video?: FullVideoFieldsFragment | null
  categoryData?: VideoCategoryData | null
}
export const VideoDetails: FC<VideoDetailsProps> = ({ video, categoryData }) => {
  const mdMatch = useMediaMatch('md')
  const [detailsExpanded, setDetailsExpanded] = useState(false)

  const foundLicense = knownLicenses.find((license) => license.code === video?.license?.code)

  const toggleDetailsExpand = () => {
    setDetailsExpanded((prevState) => !prevState)
  }

  return (
    <DetailsWrapper>
      <DescriptionContainer>
        {video ? (
          video?.description && (
            <>
              <DescriptionTitle variant="h100">Description</DescriptionTitle>
              <DescriptionBody detailsExpanded={detailsExpanded}>
                {/* div below allows line-clamp to work properly for nested paragraphs */}
                <div>
                  {video.description?.split('\n').map((line, idx) => (
                    <DescriptionCopy
                      variant={mdMatch ? 't300' : 't200'}
                      color="default"
                      key={idx}
                      detailsExpanded={detailsExpanded}
                    >
                      {replaceUrls(line)}
                    </DescriptionCopy>
                  ))}
                </div>
              </DescriptionBody>
            </>
          )
        ) : (
          <>
            <DescriptionSkeletonLoader width="70%" />
            <DescriptionSkeletonLoader width="40%" />
            <DescriptionSkeletonLoader width="80%" />
            <DescriptionSkeletonLoader width="30%" />
          </>
        )}
      </DescriptionContainer>
      <LicenceCategoryWrapper detailsExpanded={detailsExpanded || !video?.description}>
        <GridItem>
          {video ? (
            <>
              <DescriptionTitle variant="h100">License</DescriptionTitle>
              {foundLicense && (
                <Text variant={mdMatch ? 't300' : 't200'} color="default">
                  {foundLicense.name}
                </Text>
              )}
              <LicenseCustomText as="p" variant="t100" color="default">
                {video.license?.customText}
              </LicenseCustomText>
            </>
          ) : (
            <SkeletonLoader height={12} width={200} />
          )}
        </GridItem>
        <CategoryWrapper>
          {video ? (
            <>
              <DescriptionTitle variant="h100">Category</DescriptionTitle>
              <Category to={absoluteRoutes.viewer.category(categoryData?.id)}>
                {categoryData?.icon}
                <Text variant={mdMatch ? 't300' : 't200'} color="default">
                  {video?.category?.name}
                </Text>
              </Category>
            </>
          ) : (
            <SkeletonLoader height={12} width={200} />
          )}
        </CategoryWrapper>
      </LicenceCategoryWrapper>
      {video?.description && (
        <ExpandButton
          onClick={toggleDetailsExpand}
          iconPlacement="right"
          size="medium"
          variant="tertiary"
          icon={detailsExpanded ? <SvgActionChevronT /> : <SvgActionChevronB />}
        >
          Show {!detailsExpanded ? 'more' : 'less'}
        </ExpandButton>
      )}
    </DetailsWrapper>
  )
}

const replaceUrls = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const parts = text.split(urlRegex)
  return parts.reduce((acc, part, idx) => {
    const node = urlRegex.test(part) ? (
      <DescriptionLink size="large" key={`description-link-${idx}`} to={part}>
        {part}
      </DescriptionLink>
    ) : (
      part
    )

    return [...acc, node]
  }, [] as ReactNode[])
}
