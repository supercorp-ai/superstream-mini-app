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
    >
      <ComputerUsePlayer
        sources={computerSources}
        overlay={
          <Box
            width={{ initial: '220px', md: '260px', lg: '320px' }}
            style={{ maxWidth: '320px', boxShadow: 'var(--shadow-5)' }}
          >
            <AssistantPlayer sources={assistantSources} />
          </Box>
        }
      />
    </Flex>
  )
}
