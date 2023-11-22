import { Datum } from '@nivo/line'
import BN from 'bn.js'

import { SvgJoyTokenMonochrome16 } from '@/assets/icons'
import { NumberFormat, formatNumberShort } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { LineChart, defaultChartTheme } from '@/components/_charts/LineChart'
import { TooltipBox } from '@/components/_crt/CreateTokenDrawer/steps/styles'
import { ChartBox } from '@/components/_crt/MarketDrawer/MarketDrawer.styles'
import { useDebounceValue } from '@/hooks/useDebounceValue'
import { AMM_DESCO_CURVE_CONST, HAPI_TO_JOY_RATE } from '@/joystream-lib/config'
import { hapiBnToTokenNumber, tokenNumberToHapiBn } from '@/joystream-lib/utils'
import { useTokenPrice } from '@/providers/joystream'
import { cVar } from '@/styles'
import { calcBuyMarketPricePerToken } from '@/utils/crts'

type MarketDrawerPreviewProps = {
  tokenName: string
  startingPrice: number
}

const issuedTokens = [1, 10, 10 ** 2, 10 ** 3, 10 ** 4, 10 ** 5]

export const MarketDrawerPreview = ({ tokenName, startingPrice }: MarketDrawerPreviewProps) => {
  const { tokenPrice } = useTokenPrice()
  const debouncedStartingPrice = useDebounceValue(startingPrice, 500)
  const chartData: Datum[] = issuedTokens.map((num) => ({
    x: formatNumberShort(num),
    y: hapiBnToTokenNumber(
      calcBuyMarketPricePerToken(
        String(num),
        new BN(HAPI_TO_JOY_RATE).muln(AMM_DESCO_CURVE_CONST / (tokenPrice ?? 1)).toString(),
        String(tokenNumberToHapiBn(debouncedStartingPrice))
      ) ?? new BN(0)
    ),
  }))

  const getTickValues = () => [
    ...new Set(
      issuedTokens.map((elem) => {
        const floor = hapiBnToTokenNumber(
          calcBuyMarketPricePerToken(
            String(elem),
            new BN(HAPI_TO_JOY_RATE).muln(AMM_DESCO_CURVE_CONST / (tokenPrice ?? 1)).toString(),
            String(tokenNumberToHapiBn(debouncedStartingPrice))
          ) ?? new BN(0)
        )
        return Math.max(Math.floor(elem / floor), 1) * floor
      })
    ),
  ]

  return (
    <>
      <ChartBox>
        <LineChart
          curve="natural"
          enablePointLabel
          tooltip={(point) => {
            return (
              <TooltipBox>
                <Text variant="t300" as="p">
                  <NumberFormat value={Number(point.data.yFormatted)} format="short" as="span" withToken />
                </Text>
                <Text variant="t100" as="p" color="colorTextMuted">
                  {point.data.xFormatted} {tokenName} supply
                </Text>
              </TooltipBox>
            )
          }}
          yScale={{
            type: 'log',
            base: 2,
            min: 'auto',
            max: 'auto',
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickValues: 5,
            ticksPosition: 'before',
            format: (tick) => formatNumberShort(tick),
            // eslint-disable-next-line
            // @ts-ignore
            renderTick: ({ x, y, textX, textY, opacity, textBaseline, value, format }) => {
              const iconX = textX - 18
              const iconY = textY - 8
              return (
                <g transform={`translate(${x - 24},${y})`} style={{ opacity }}>
                  <SvgJoyTokenMonochrome16 x={iconX} y={iconY} />
                  <text
                    // eslint-disable-next-line
                    // @ts-ignore
                    alignmentBaseline={textBaseline}
                    textAnchor="start"
                    transform={`translate(${textX},${textY})`}
                    style={defaultChartTheme.axis.ticks.text}
                  >
                    {format && format(value)}
                  </text>
                </g>
              )
            },
          }}
          gridYValues={getTickValues()}
          data={[
            {
              id: 1,
              color: cVar('colorCoreBlue500'),
              data: chartData,
            },
          ]}
          enableCrosshair={false}
        />
      </ChartBox>
    </>
  )
}
