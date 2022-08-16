import BN from 'bn.js'
import { FC } from 'react'

import { Fee } from '@/components/Fee'
import { NumberFormat } from '@/components/NumberFormat'
import { AlertDialogModal } from '@/components/_overlays/AlertDialogModal'
import { useFee } from '@/providers/joystream'
import { formatDateTime } from '@/utils/time'

type MemberId = string | null
type NftId = string | null

type WithdrawBidDialogProps = {
  isOpen: boolean
  onModalClose: () => void
  userBidAmount: BN
  userBidCreatedAt: Date
  nftId: NftId
  memberId: MemberId
  onWithdrawBid: (nftId: string) => void
}

export const WithdrawBidDialog: FC<WithdrawBidDialogProps> = ({
  isOpen,
  onModalClose,
  userBidAmount,
  userBidCreatedAt,
  nftId,
  memberId,
  onWithdrawBid,
}) => {
  const { loading, fullFee } = useFee('cancelNftBidTx', nftId && memberId ? [nftId, memberId] : undefined)
  return (
    <AlertDialogModal
      show={isOpen}
      onExitClick={onModalClose}
      title={
        <>
          Withdraw your <NumberFormat value={userBidAmount} as="span" withToken /> bid?
        </>
      }
      description={
        <>
          Are you sure you want to withdraw your{' '}
          <NumberFormat value={userBidAmount} as="span" color="colorText" withToken /> bid placed on{' '}
          {formatDateTime(userBidCreatedAt)}?
        </>
      }
      additionalActionsNode={<Fee loading={loading} variant="h200" amount={fullFee || new BN(0)} />}
      primaryButton={{
        text: 'Withdraw',
        onClick: () => {
          if (!nftId) {
            return
          }
          onWithdrawBid(nftId)
          onModalClose()
        },
      }}
      secondaryButton={{
        text: 'Cancel',
        onClick: () => {
          onModalClose()
        },
      }}
    />
  )
}
