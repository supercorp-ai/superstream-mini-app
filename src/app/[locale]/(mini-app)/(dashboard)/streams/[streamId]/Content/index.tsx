'use client'
import { useMemo } from 'react'
import { Box, Flex } from '@radix-ui/themes'
import { AssistantPlayer, ComputerUsePlayer } from './Player'
import { StreamComments } from './StreamComments'
import { useStreamConfigs } from '@/hooks/streams/useStreamConfigs'

export const Content = ({
  streamId,
  backgroundColor,
}: {
  streamId: string
  backgroundColor: string
}) => {
  const { streamConfigs } = useStreamConfigs()

  const streamConfig = useMemo(
    () => streamConfigs.find((config) => config.id === streamId),
    [streamConfigs, streamId],
  )

  if (!streamConfig) {
    return null
  }

  console.log('Rendering Content for streamId:', streamId)

  return (
    <Flex
      direction="column"
      width="100%"
      height="100%"
      style={{
        flexGrow: 1,
        overflow: 'hidden',
      }}
    >
      <Box
        width="100%"
        style={{
          maxWidth: 720,
          margin: '-5px auto 0',
          flexShrink: 0,
        }}
      >
        <AssistantPlayer streamConfig={streamConfig} />
      </Box>

      <Box
        width="100%"
        style={{
          maxWidth: 720,
          margin: '0 auto',
          position: 'relative',
          flexGrow: 1,
          minHeight: 0,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <ComputerUsePlayer streamConfig={streamConfig} />
        <StreamComments streamId={streamId} />
      </Box>
    </Flex>
  )
}
