import { Box, Flex } from '@radix-ui/themes'
import { AssistantPlayer, ComputerUsePlayer } from './Player'
import { StreamMessages } from './StreamMessages'

export const Content = ({
  streamId,
  backgroundColor,
}: {
  streamId: string
  backgroundColor: string
}) => {
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
      <Box
        width="100%"
        style={{
          maxWidth: 720,
          margin: '-5px auto 0',
        }}
      >
        <AssistantPlayer
          sources={assistantSources}
          backgroundColor={backgroundColor}
        />
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

      <Box
        width="100%"
        style={{
          maxWidth: 720,
          margin: 'var(--space-6) auto 0',
        }}
      >
        <StreamMessages streamId={streamId} />
      </Box>
    </Flex>
  )
}
