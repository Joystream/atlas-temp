import { TableProps } from '@/components/Table'
import { ColumnBox, RightAlignedHeader, RowBox } from '@/components/Table/Table.styles'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'

export const tableLoadingData = Array.from({ length: 5 }, () => ({
  date: (
    <RowBox>
      <SkeletonLoader height={20} width="50%" />
      <SkeletonLoader height={20} width="30%" />
    </RowBox>
  ),
  channel: (
    <ColumnBox>
      <SkeletonLoader rounded height={32} width={32} />
      <SkeletonLoader height={20} width="40%" />
    </ColumnBox>
  ),
  tier: <SkeletonLoader height={40} width={70} />,
  reward: (
    <RowBox align="end">
      <SkeletonLoader height={20} width="40%" />
      <SkeletonLoader height={20} width="30%" />
    </RowBox>
  ),
}))

export const COLUMNS: TableProps['columns'] = [
  {
    Header: 'Date of signup',
    accessor: 'date',
    width: 100,
  },
  {
    Header: 'Channel',
    accessor: 'channel',
    width: 100,
  },
  {
    Header: 'Popularity tier',
    accessor: 'tier',
    width: 100,
  },
  {
    Header: () => <RightAlignedHeader>REFERRAL REWARD</RightAlignedHeader>,
    accessor: 'reward',
    width: 100,
  },
]
