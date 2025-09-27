'use client'

import { useEffect, useState, type ComponentProps, type ReactNode } from 'react'
import {
  ActivityLogIcon,
  ExclamationTriangleIcon,
  SpeakerLoudIcon,
  SpeakerOffIcon,
  VideoIcon,
} from '@radix-ui/react-icons'
import { Badge, Box, Card, Flex, IconButton, Text } from '@radix-ui/themes'
import { useFormatter } from 'next-intl'
import { useHlsPlayer, type PlayerState } from '@/hooks/players/useHlsPlayer'

type BadgeColor = NonNullable<ComponentProps<typeof Badge>['color']>

type PlayerStateContent = {
  badgeLabel: string
  badgeColor: BadgeColor
  title?: string
  description?: string
  icon: ReactNode
}

type StateDictionary = Record<PlayerState, PlayerStateContent>

type BasePlayerProps = {
  sources: readonly (string | null | undefined)[]
}

type ComputerUsePlayerProps = BasePlayerProps & {
  overlay?: ReactNode
}

const PlayerOverlay = ({
  state,
  content,
}: {
  state: PlayerState
  content: PlayerStateContent
}) => {
  if (state === 'playing') return null

  const overlayTitle = content.title ?? content.badgeLabel

  return (
    <Flex
      position="absolute"
      top="0"
      left="0"
      width="100%"
      height="100%"
      align="center"
      justify="center"
      px="6"
      style={{
        backgroundColor: 'rgba(5, 5, 5, 0.72)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <Card
        size="3"
        variant="surface"
        style={{ maxWidth: 420 }}
      >
        <Flex
          direction="column"
          align="center"
          gap="3"
        >
          <Badge color={content.badgeColor}>{content.badgeLabel}</Badge>
          <Flex
            align="center"
            justify="center"
            style={{
              color: 'var(--gray-11)',
              fontSize: 32,
            }}
          >
            {content.icon}
          </Flex>
          <Text
            weight="medium"
            size="4"
            align="center"
          >
            {overlayTitle}
          </Text>
          {content.description ? (
            <Text
              color="gray"
              size="2"
              align="center"
            >
              {content.description}
            </Text>
          ) : null}
        </Flex>
      </Card>
    </Flex>
  )
}

const HiddenStateBadge = ({
  state,
  content,
  testId,
}: {
  state: PlayerState
  content: PlayerStateContent
  testId: string
}) => (
  <Box
    data-testid={testId}
    data-state={state}
    style={{ display: 'none' }}
  >
    <Badge color={content.badgeColor}>{content.badgeLabel}</Badge>
  </Box>
)

const computerStateContent: StateDictionary = {
  idle: {
    badgeLabel: 'Browser feed offline',
    badgeColor: 'gray',
    title: 'No active browser feed',
    description: 'Start a session to see the shared browser stream here.',
    icon: (
      <VideoIcon
        width={36}
        height={36}
      />
    ),
  },
  waiting: {
    badgeLabel: 'Connecting to browser feed…',
    badgeColor: 'indigo',
    title: 'Preparing live browser stream',
    description: 'Hang tight while we connect to the shared browser.',
    icon: (
      <ActivityLogIcon
        width={36}
        height={36}
      />
    ),
  },
  playing: {
    badgeLabel: 'Live browser feed',
    badgeColor: 'green',
    icon: (
      <VideoIcon
        width={36}
        height={36}
      />
    ),
  },
  blocked: {
    badgeLabel: 'Autoplay blocked',
    badgeColor: 'amber',
    title: 'Press play to start streaming',
    description: 'Your browser prevented autoplay. Click the video to resume.',
    icon: (
      <ExclamationTriangleIcon
        width={36}
        height={36}
      />
    ),
  },
  unsupported: {
    badgeLabel: 'Playback not supported',
    badgeColor: 'red',
    title: 'This browser cannot play HLS streams',
    description: 'Try Safari or another browser with Media Source Extensions.',
    icon: (
      <ExclamationTriangleIcon
        width={36}
        height={36}
      />
    ),
  },
}

const assistantStateContent: StateDictionary = {
  idle: {
    badgeLabel: 'Assistant feed offline',
    badgeColor: 'gray',
    title: 'Assistant stream unavailable',
    description: 'Once the assistant is live the feed will appear here.',
    icon: (
      <VideoIcon
        width={36}
        height={36}
      />
    ),
  },
  waiting: {
    badgeLabel: 'Connecting to assistant…',
    badgeColor: 'indigo',
    title: 'Preparing assistant feed',
    description: 'We are setting up the assistant audio and video.',
    icon: (
      <ActivityLogIcon
        width={36}
        height={36}
      />
    ),
  },
  playing: {
    badgeLabel: 'Assistant stream live',
    badgeColor: 'green',
    icon: (
      <VideoIcon
        width={36}
        height={36}
      />
    ),
  },
  blocked: {
    badgeLabel: 'Autoplay blocked',
    badgeColor: 'amber',
    title: 'Press play to start audio',
    description: 'Your browser blocked autoplay. Click the video to resume.',
    icon: (
      <ExclamationTriangleIcon
        width={36}
        height={36}
      />
    ),
  },
  unsupported: {
    badgeLabel: 'Playback not supported',
    badgeColor: 'red',
    title: 'This browser cannot play HLS streams',
    description: 'Try Safari or another browser with Media Source Extensions.',
    icon: (
      <ExclamationTriangleIcon
        width={36}
        height={36}
      />
    ),
  },
}

export const ComputerUsePlayer = ({
  sources,
  overlay,
}: ComputerUsePlayerProps) => {
  const { videoRef, state } = useHlsPlayer({ sources })

  return (
    <Flex
      direction="column"
      gap="3"
      height="100%"
      flexGrow="1"
    >
      <Box
        position="relative"
        flexGrow="1"
        width="100%"
        overflow="hidden"
        style={{
          borderRadius: 'var(--radius-4)',
          backgroundColor: 'var(--color-surface)',
        }}
      >
        <Box
          asChild
          display={state === 'playing' ? 'block' : 'none'}
          width="100%"
          height="100%"
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            controls
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              backgroundColor: 'transparent',
            }}
          />
        </Box>

        <PlayerOverlay
          state={state}
          content={computerStateContent[state]}
        />

        {overlay ? (
          <Box
            position="absolute"
            bottom="var(--space-5)"
            left="var(--space-5)"
          >
            {overlay}
          </Box>
        ) : null}
      </Box>

      <HiddenStateBadge
        state={state}
        content={computerStateContent[state]}
        testId="computer-preview-status"
      />
    </Flex>
  )
}

export const AssistantPlayer = ({ sources }: BasePlayerProps) => {
  const { videoRef, state } = useHlsPlayer({ sources })
  const [muted, setMuted] = useState(true)
  const format = useFormatter()
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const element = videoRef.current
    if (!element) return
    element.muted = muted
  }, [muted, videoRef])

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const toggleMuted = () => setMuted((value) => !value)

  const showMuteToggle = state === 'playing'
  const showLiveBadge = state === 'playing'
  const liveTime = format.dateTime(now, {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  })

  return (
    <Flex
      direction="column"
      gap="2"
    >
      <Box
        position="relative"
        width="100%"
        overflow="hidden"
        style={{
          aspectRatio: '1 / 1',
          borderRadius: 'var(--radius-4)',
          backgroundColor: 'var(--color-surface)',
        }}
      >
        <Box
          asChild
          display={state === 'playing' ? 'block' : 'none'}
          width="100%"
          height="100%"
        >
          <video
            ref={videoRef}
            autoPlay
            muted={muted}
            controls
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              backgroundColor: '#000',
            }}
          />
        </Box>

        <PlayerOverlay
          state={state}
          content={assistantStateContent[state]}
        />

        {showMuteToggle ? (
          <Box
            position="absolute"
            top="var(--space-2)"
            right="var(--space-2)"
          >
            <IconButton
              size="2"
              variant={muted ? 'solid' : 'soft'}
              aria-label={muted ? 'Unmute assistant' : 'Mute assistant'}
              onClick={toggleMuted}
            >
              {muted ? <SpeakerOffIcon /> : <SpeakerLoudIcon />}
            </IconButton>
          </Box>
        ) : null}

        {showLiveBadge ? (
          <Box
            position="absolute"
            left="var(--space-2)"
            bottom="var(--space-2)"
          >
            <Flex
              align="center"
              gap="2"
              px="3"
              py="1"
              style={{
                borderRadius: '9999px',
                backgroundColor: 'rgba(12, 12, 12, 0.8)',
                color: 'white',
              }}
            >
              <Box
                width="var(--space-2)"
                height="var(--space-2)"
                flexShrink="0"
                style={{
                  borderRadius: 'var(--radius-4)',
                  backgroundColor: 'var(--red-10)',
                }}
              />
              <Text
                size="2"
                weight="medium"
              >
                LIVE {liveTime}
              </Text>
            </Flex>
          </Box>
        ) : null}
      </Box>

      <HiddenStateBadge
        state={state}
        content={assistantStateContent[state]}
        testId="assistant-preview-status"
      />
    </Flex>
  )
}
