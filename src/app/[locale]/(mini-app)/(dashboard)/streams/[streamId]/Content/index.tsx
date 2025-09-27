import { Box, Flex } from '@radix-ui/themes'
import { AssistantPlayer, ComputerUsePlayer } from './Player'

export const Content = () => {
  const computerSources = [
    process.env.NEXT_PUBLIC_COMPUTER_USE_HLS_PRIMARY_URL!,
    process.env.NEXT_PUBLIC_COMPUTER_USE_HLS_FALLBACK_URL!,
  ] as const

  const assistantSources = [
    process.env.NEXT_PUBLIC_ASSISTANT_HLS_PRIMARY_URL!,
    process.env.NEXT_PUBLIC_ASSISTANT_HLS_FALLBACK_URL!,
  ] as const

  return (
    <Flex
      direction="column"
      width="100%"
      height="100%"
      gap="4"
    >
      <Box
        width="100%"
        style={{
          maxWidth: 720,
          margin: '0 auto',
        }}
      >
        <AssistantPlayer sources={assistantSources} />
      </Box>

      <Box
        width="100%"
        style={{
          maxWidth: 720,
          margin: '0 auto',
        }}
      >
        <ComputerUsePlayer sources={computerSources} />
      </Box>
    </Flex>
  )
}
