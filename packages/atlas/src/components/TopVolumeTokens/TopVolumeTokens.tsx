import styled from '@emotion/styled'
import BN from 'bn.js'
import { useMemo } from 'react'

import { useGetTopSellingTokensQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { SvgEmptyStateIllustration } from '@/assets/illustrations'
import { NumberFormat } from '@/components/NumberFormat'
import { Section } from '@/components/Section/Section'
import { TableProps } from '@/components/Table'
import { RightAlignedHeader } from '@/components/Table/Table.styles'
import { Text } from '@/components/Text'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import { JoyTokenIcon } from '../JoyTokenIcon'
import {
  JoyAmountWrapper,
  SkeletonChannelContainer,
  StyledTable,
} from '../TopSellingChannelsTable/TopSellingChannelsTable.styles'
import { TokenInfo } from '../_crt/CrtPortfolioTable'

const COLUMNS: TableProps['columns'] = [
  {
    Header: '',
    accessor: 'index',
    width: 1,
  },
  {
    Header: 'TOKEN',
    accessor: 'token',
    width: 5,
  },
  {
    Header: () => <RightAlignedHeader>7D Volume</RightAlignedHeader>,
    accessor: 'ammVolume',
    width: 4,
  },
]

const tableEmptyState = {
  title: 'No tokens found',
  description: 'No top moves have been found.',
  icon: <SvgEmptyStateIllustration />,
}

export const TopVolumeTokens = () => {
  const { data, loading } = useGetTopSellingTokensQuery({
    variables: {
      periodDays: 30,
    },
  })
  const { topSellingToken } = data ?? {}

  const lgMatch = useMediaMatch('lg')
  const mappedData = useMemo(() => {
    return loading
      ? Array.from({ length: 10 }, () => ({
          index: null,
          token: (
            <SkeletonChannelContainer>
              <SkeletonLoader width={32} height={32} rounded />
              <SkeletonLoader width="30%" height={26} />
            </SkeletonChannelContainer>
          ),
          weeklyPriceChange: (
            <JoyAmountWrapper>
              <SkeletonLoader width={120} height={26} />
            </JoyAmountWrapper>
          ),
          price: (
            <JoyAmountWrapper>
              <SkeletonLoader width={120} height={26} />
            </JoyAmountWrapper>
          ),
          channelId: null,
        }))
      : topSellingToken?.map((data, index) => ({
          index: (
            <IndexText variant="t100" as="p" color="colorTextMuted">
              #{index + 1}{' '}
            </IndexText>
          ),
          ammVolume: (
            <JoyAmountWrapper>
              <NumberFormat
                icon={<JoyTokenIcon variant="gray" />}
                variant="t200-strong"
                as="p"
                value={new BN(data.ammVolume)}
                margin={{ left: 1 }}
                format="short"
                withDenomination
                denominationAlign="right"
              />
            </JoyAmountWrapper>
          ),
          token: (
            <TokenInfo
              channelId={data.creatorToken.channel?.channel.id ?? ''}
              tokenName={data.creatorToken.symbol ?? ''}
              isVerified={false}
              tokenTitle={data.creatorToken.symbol ?? ''}
            />
          ),
          channelId: data.creatorToken.channel?.channel.id,
        })) ?? []
  }, [topSellingToken, loading])

  if (!loading && !topSellingToken) {
    return null
  }

  return (
    <Section
      headerProps={{
        start: {
          type: 'title',
          title: `Top traded tokens by volume`,
        },
      }}
      contentProps={{
        type: 'grid',
        grid: {
          sm: {
            columns: 1,
          },
        },
        children: [
          <StyledTable
            key="single"
            minWidth={350}
            emptyState={tableEmptyState}
            columns={COLUMNS}
            data={mappedData}
            doubleColumn={lgMatch}
            getRowTo={(idx) => absoluteRoutes.viewer.channel(mappedData[idx].channelId ?? '', { tab: 'Token' })}
            interactive
          />,
        ],
      }}
    />
  )
}

const IndexText = styled(Text)`
  margin-left: -4px;
`
