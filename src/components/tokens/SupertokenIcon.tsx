import { TokenIcon } from '@/components/tokens/TokenIcon'
import supertokenSrc from '@/assets/images/tokens/supertoken.png'

export const SupertokenIcon = ({
  style = {},
}: {
  style?: React.CSSProperties
}) => (
  <TokenIcon
    src={supertokenSrc}
    alt="Supertoken"
    style={style}
  />
)
