import { Badge } from '@radix-ui/themes'
import type { Price as PriceType } from '@/types'
import { Currency } from '@/enums'
import { useFormatter } from 'next-intl'
import { TbRosetteDiscountFilled } from 'react-icons/tb'
import { WldTokenIcon } from '@/components/tokens/WldTokenIcon'
import { SupertokenIcon } from '@/components/tokens/SupertokenIcon'
import { UsdTokenIcon } from '@/components/tokens/UsdTokenIcon'
import { formatPrice } from '@/lib/prices/formatPrice'

const Icon = ({ currency }: { currency: Currency }) => {
  if (currency === Currency.WLD) {
    return <WldTokenIcon />
  } else if (currency === Currency.SUPER) {
    return <SupertokenIcon />
  } else if (currency === Currency.USD) {
    return <UsdTokenIcon />
  }
}

export const Price = ({ price }: { price: PriceType }) => {
  const format = useFormatter()

  return (
    <Badge
      color="gray"
      size="1"
      style={{
        position: 'relative',
      }}
    >
      <Icon currency={price.currency} /> {formatPrice({ price, format })}
      {price.currency === Currency.SUPER && (
        <TbRosetteDiscountFilled
          color="var(--violet-11)"
          style={{
            position: 'absolute',
            top: 'calc(-1 * var(--space-2))',
            right: 'calc(-1 * var(--space-2))',
            width: 'calc(var(--space-4) + var(--space-1))',
            height: 'calc(var(--space-4) + var(--space-1))',
          }}
        />
      )}
    </Badge>
  )
}
