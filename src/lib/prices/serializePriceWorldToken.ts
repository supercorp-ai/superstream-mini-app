import { Currency } from '@/enums'
import type { Price } from '@/types'
import { tokenToDecimals, Tokens } from '@worldcoin/minikit-js'

const getSymbol = ({ currency }: { currency: Currency }) => {
  if (currency === Currency.WLD) {
    return Tokens.WLD
  } else if (currency === Currency.USD) {
    return Tokens.USDC
  } else {
    return null
  }
}

export const serializePriceWorldToken = ({ price }: { price: Price }) => {
  const symbol = getSymbol({
    currency: price.currency,
  })

  if (!symbol) {
    throw new Error('Invalid currency')
  }

  return {
    symbol,
    token_amount: tokenToDecimals(price.value, symbol).toString(),
  }
}
