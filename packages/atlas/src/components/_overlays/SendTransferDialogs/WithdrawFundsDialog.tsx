import BN from 'bn.js'
import { FC, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { FullMembershipFieldsFragment } from '@/api/queries'
import { Avatar } from '@/components/Avatar'
import { Fee } from '@/components/Fee'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { JoyTokenIcon } from '@/components/_icons/JoyTokenIcon'
import { FormField } from '@/components/_inputs/FormField'
import { TokenInput } from '@/components/_inputs/TokenInput'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { JOY_CURRENCY_TICKER } from '@/config/joystream'
import { tokenNumberToHapiBn } from '@/joystream-lib/utils'
import { useFee, useJoystream, useTokenPrice } from '@/providers/joystream'
import { useTransaction } from '@/providers/transactions'
import { formatNumber } from '@/utils/number'

import { PriceWrapper, Summary, SummaryRow, VerticallyCenteredDiv } from './SendTransferDialogs.styles'

type WithdrawFundsDialogProps = {
  onExitClick: () => void
  activeMembership?: FullMembershipFieldsFragment | null
  show: boolean
  accountBalance?: BN
  channelBalance?: BN
  avatarUrl?: string | null
  channelId?: string | null
}

const ADDRESS_CHARACTERS_LIMIT = 4

export const WithdrawFundsDialog: FC<WithdrawFundsDialogProps> = ({
  onExitClick,
  activeMembership,
  show,
  avatarUrl,
  accountBalance = new BN(0),
  channelBalance = new BN(0),
  channelId,
}) => {
  const {
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<{ amount: number | null }>()
  const { convertHapiToUSD } = useTokenPrice()
  const amountBn = tokenNumberToHapiBn(watch('amount') || 0)
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const { fullFee, loading: feeLoading } = useFee(
    'withdrawFromChannelBalanceTx',
    show && channelId && activeMembership && amountBn
      ? [activeMembership.id, channelId, amountBn.toString()]
      : undefined
  )

  useEffect(() => {
    if (!show) {
      reset({ amount: null })
    }
  }, [show, reset])

  const handleWithdraw = async () => {
    const handler = await handleSubmit((data) => {
      if (!joystream || !activeMembership || !data.amount || !channelId) {
        return
      }
      handleTransaction({
        snackbarSuccessMessage: {
          title: 'Tokens withdrawn successfully',
          description: `You have withdrawn ${formatNumber(data.amount)} ${JOY_CURRENCY_TICKER}!`,
        },
        txFactory: async (updateStatus) =>
          (await joystream.extrinsics).withdrawFromChannelBalance(
            activeMembership.id,
            channelId,
            amountBn.toString(),
            proxyCallback(updateStatus)
          ),
        onTxSync: async () => onExitClick(),
      })
    })
    return handler()
  }

  const channelBalanceInUsd = convertHapiToUSD(channelBalance)

  return (
    <DialogModal
      show={show}
      title="Withdraw"
      onExitClick={onExitClick}
      primaryButton={{ text: 'Withdraw', onClick: handleWithdraw }}
      secondaryButton={{ text: 'Cancel', onClick: onExitClick }}
      additionalActionsNode={<Fee loading={feeLoading} variant="h200" amount={fullFee} />}
    >
      <Text as="h4" variant="h300" margin={{ bottom: 4 }}>
        Your channel balance
      </Text>
      <PriceWrapper>
        <VerticallyCenteredDiv>
          <JoyTokenIcon variant="gray" />
          <NumberFormat value={channelBalance || 0} as="p" variant="h400" margin={{ left: 1 }} format="short" />
        </VerticallyCenteredDiv>
        {channelBalanceInUsd !== null && (
          <NumberFormat
            as="p"
            color="colorText"
            format="dollar"
            variant="t100"
            value={channelBalanceInUsd}
            margin={{ top: 1 }}
          />
        )}
      </PriceWrapper>
      <FormField label="Amount to withdraw" error={errors.amount?.message}>
        <Controller
          control={control}
          name="amount"
          rules={{
            validate: {
              valid: (value) => {
                if (!value || isNaN(value) || value < 0) {
                  return 'The number of JOY tokens to withdraw has to be an integer and greater than 0 (e.g. 15).'
                }
                return true
              },
              channelBalance: (value) => {
                if (value && tokenNumberToHapiBn(value).gt(channelBalance)) {
                  return 'Not enough tokens in channel balance.'
                }
                return true
              },
            },
          }}
          render={({ field: { value, onChange } }) => (
            <TokenInput
              value={value}
              onChange={onChange}
              placeholder={`${JOY_CURRENCY_TICKER} amount`}
              error={!!errors.amount}
            />
          )}
        />
      </FormField>
      <Summary>
        <SummaryRow>
          <Text as="span" variant="t100" color="colorText">
            Destination account
          </Text>
          <VerticallyCenteredDiv>
            <Avatar size="extra-small" assetUrl={avatarUrl} />
            <Text as="span" variant="t100" margin={{ left: 2, right: 1 }}>
              {activeMembership?.handle}
            </Text>
            <Text as="span" variant="t100" color="colorText">
              ({activeMembership?.controllerAccount.slice(0, ADDRESS_CHARACTERS_LIMIT)}...
              {activeMembership?.controllerAccount.slice(-ADDRESS_CHARACTERS_LIMIT)})
            </Text>
          </VerticallyCenteredDiv>
        </SummaryRow>
        <SummaryRow>
          <Text as="span" variant="t100" color="colorText">
            Destination account balance
          </Text>
          <NumberFormat as="span" format="short" variant="t100" color="colorText" value={accountBalance} />
        </SummaryRow>
      </Summary>
    </DialogModal>
  )
}
