import { Currency } from '@/enums'
import type { Price } from '@/types'

export const formatPrice = ({
  price,
  format,
}: {
  price: Price
  format: any
}) => {
  const prefix = format.number(price.value, {
    ...(price.currency === Currency.USD
      ? {
          style: 'currency',
          currency: price.currency,
        }
      : {}),
  })

  const suffix = price.currency !== Currency.USD ? ` ${price.currency}` : ''

  return `${prefix}${suffix}`
}
