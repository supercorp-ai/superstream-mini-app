import { useMemo } from 'react'
import { Flex, Box, Heading, ScrollArea, Card, Text } from '@radix-ui/themes'
import { useStreamConfigs } from '@/hooks/streams/useStreamConfigs'
import { useAssistantConfigs } from '@/hooks/assistants/useAssistantConfigs'
import type { StreamConfig, AssistantConfig } from '@/types'
import BackgroundVideo from 'next-video/background-video'
import { StreamStatusBadge } from '@/components/streams/StreamStatusBadge'
import { StreamStatus } from '@/enums'
import { Link } from '@/i18n/navigation'

const StreamContent = ({
  assistantConfig,
  streamConfig,
}: {
  assistantConfig: AssistantConfig
  streamConfig: StreamConfig
}) => (
  <Flex
    px="3"
    flexGrow="1"
    direction="column"
  >
    <Card>
      <Flex
        gap="4"
        align="center"
      >
        <Flex
          direction="column"
          gap="1"
        >
          <Flex
            flexShrink="0"
            style={{
              position: 'relative',
              width: 'var(--space-8)',
              height: 'var(--space-8)',
              borderRadius: 'var(--radius-4)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <BackgroundVideo
              src={assistantConfig.videoSrc}
              autoPlay
              loop
              playsInline
              style={{
                height: '100%',
                width: '100%',
                objectFit: 'cover',
              }}
            />
          </Flex>
          <Flex justify="center">
            <StreamStatusBadge streamConfig={streamConfig} />
          </Flex>
        </Flex>

        <Flex direction="column">
          <Heading
            size="3"
            color="gray"
            highContrast
          >
            {streamConfig.title}
          </Heading>

          <Text
            color="gray"
            size="2"
          >
            {assistantConfig.name}
          </Text>
        </Flex>
      </Flex>
    </Card>
  </Flex>
)

const Stream = ({ streamConfig }: { streamConfig: StreamConfig }) => {
  const { assistantConfigs } = useAssistantConfigs()
  const assistantConfig = useMemo(
    () =>
      assistantConfigs.find(
        (config) => config.slug === streamConfig.assistantSlug,
      ),
    [assistantConfigs, streamConfig.id],
  )

  if (!assistantConfig) {
    return null
  }

  if (streamConfig.status !== StreamStatus.LIVE) {
    return (
      <StreamContent
        assistantConfig={assistantConfig}
        streamConfig={streamConfig}
      />
    )
  }

  return (
    <Link href={`/streams/${streamConfig.id}`}>
      <StreamContent
        assistantConfig={assistantConfig}
        streamConfig={streamConfig}
      />
    </Link>
  )
}

export const Streams = () => {
  const { streamConfigs } = useStreamConfigs()
  return (
    <Flex
      direction="column"
      gap="2"
      flexGrow="1"
    >
      <Box px="4">
        <Heading
          as="h3"
          size="3"
          color="gray"
        >
          Livestreams
        </Heading>
      </Box>

      <ScrollArea>
        <Flex
          direction="column"
          gap="3"
        >
          {streamConfigs.map((streamConfig) => (
            <Stream
              key={streamConfig.id}
              streamConfig={streamConfig}
            />
          ))}
        </Flex>
      </ScrollArea>
    </Flex>
  )
}
