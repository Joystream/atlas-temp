import { mnemonicGenerate } from '@polkadot/util-crypto'
import { FC, useCallback, useEffect, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { SvgActionCopy } from '@/assets/icons'
import { Checkbox } from '@/components/_inputs/Checkbox'
import { FormField } from '@/components/_inputs/FormField'
import { useClipboard } from '@/hooks/useClipboard'

import { StyledTextArea, StyledTextButton } from './SignupSeedStep.styles'

import { SignInModalStepTemplate } from '../SignInModalStepTemplate'
import { CheckboxWrapper, StyledSignUpForm } from '../SignInSteps.styles'
import { SignInStepProps } from '../SignInSteps.types'

type SignUpSeedStepProps = {
  onSeedSubmit: (seed: string) => void
} & SignInStepProps

export const SignUpSeedStep: FC<SignUpSeedStepProps> = ({
  goToNextStep,
  hasNavigatedBack,
  setPrimaryButtonProps,
  onSeedSubmit,
}) => {
  const { copyToClipboard } = useClipboard()
  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<{ confirmedCopy: boolean; seed: string }>({
    defaultValues: {
      confirmedCopy: false,
    },
  })
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      setValue('seed', mnemonicGenerate())
      firstRender.current = false
    }
  }, [setValue])

  const handleGoToNextStep = useCallback(() => {
    handleSubmit((data) => {
      onSeedSubmit(data.seed)
      goToNextStep()
    })()
  }, [goToNextStep, handleSubmit, onSeedSubmit])

  useEffect(() => {
    setPrimaryButtonProps({
      text: 'Continue',
      onClick: () => handleGoToNextStep(),
    })
  }, [goToNextStep, handleGoToNextStep, setPrimaryButtonProps])

  return (
    <SignInModalStepTemplate
      title="Write down your seed"
      hasNavigatedBack={hasNavigatedBack}
      subtitle="Please write down your password recovery seed and keep it in a safe place. It's the only way to recover your password if you forget it."
    >
      <StyledSignUpForm>
        <FormField label="Password recovery seed">
          <StyledTextArea {...register('seed')} disabled />
        </FormField>
        <StyledTextButton
          variant="secondary"
          icon={<SvgActionCopy />}
          iconPlacement="left"
          onClick={() => copyToClipboard(getValues('seed'), 'Seed copied to your clipboard')}
        >
          Copy to clipboard
        </StyledTextButton>
        <Controller
          control={control}
          name="confirmedCopy"
          rules={{
            validate: {
              valid: (value) => {
                if (!value) {
                  return 'Enter amount to transfer.'
                } else {
                  return value
                }
              },
            },
          }}
          render={({ field: { onChange, value } }) => (
            <CheckboxWrapper isAccepted={value}>
              <Checkbox
                onChange={(val) => onChange(val)}
                caption={errors.confirmedCopy?.message}
                error={!!errors.confirmedCopy}
                value={value}
                label="I have saved my mnemonic seed safely"
              />
            </CheckboxWrapper>
          )}
        />
      </StyledSignUpForm>
    </SignInModalStepTemplate>
  )
}
