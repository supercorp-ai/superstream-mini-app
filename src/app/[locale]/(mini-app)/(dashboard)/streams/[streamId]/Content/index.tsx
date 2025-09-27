import { Flex } from '@radix-ui/themes'
import { Player } from './Player'

export const Content = () => (
  <Flex
    direction="column"
    gap="4"
  >
    <Player
      sources={[
        process.env.NEXT_PUBLIC_COMPUTER_USE_HLS_PRIMARY_URL!,
        process.env.NEXT_PUBLIC_COMPUTER_USE_HLS_FALLBACK_URL!,
      ]}
    />

    <Player
      sources={[
        process.env.NEXT_PUBLIC_ASSISTANT_HLS_PRIMARY_URL!,
        process.env.NEXT_PUBLIC_ASSISTANT_HLS_FALLBACK_URL!,
      ]}
    />
  </Flex>
)
