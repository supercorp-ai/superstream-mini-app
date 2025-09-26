import wldSrc from '@/assets/images/tokens/wld.png'
import { TokenIcon } from '@/components/tokens/TokenIcon'

export const WldTokenIcon = ({
  style = {},
}: {
  style?: React.CSSProperties
}) => (
  <TokenIcon
    src={wldSrc}
    alt="Worldcoin"
    style={style}
  />
)
