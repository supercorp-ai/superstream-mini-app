import usdcSrc from '@/assets/images/tokens/usdc.png'
import { TokenIcon } from '@/components/tokens/TokenIcon'

export const UsdTokenIcon = ({
  style = {},
}: {
  style?: React.CSSProperties
}) => (
  <TokenIcon
    src={usdcSrc}
    alt="USD"
    style={style}
  />
)
