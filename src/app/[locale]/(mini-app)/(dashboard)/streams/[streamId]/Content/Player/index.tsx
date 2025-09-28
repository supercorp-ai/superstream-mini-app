'use client'

import { useEffect, useState, type ComponentProps, type ReactNode } from 'react'
import {
  ActivityLogIcon,
  ExclamationTriangleIcon,
  SpeakerLoudIcon,
  SpeakerOffIcon,
  VideoIcon,
  PersonIcon,
} from '@radix-ui/react-icons'
import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  IconButton,
  Spinner,
  Text,
} from '@radix-ui/themes'
import { useHlsPlayer, type PlayerState } from '@/hooks/players/useHlsPlayer'
import { StreamStatusBadge } from '@/components/streams/StreamStatusBadge'
import type { StreamConfig } from '@/types'

type BadgeColor = NonNullable<ComponentProps<typeof Badge>['color']>

type PlayerStateContent = {
  badgeLabel: string
  badgeColor: BadgeColor
  message?: string
  icon: ReactNode
  actionLabel?: string
  actionType?: 'resume' | 'retry'
}

type StateDictionary = Record<PlayerState, PlayerStateContent>

type BasePlayerProps = {
  streamConfig: StreamConfig
}

const hexToRgba = (hex: string, alpha: number) => {
  const normalized = hex.replace('#', '')
  const bigint = parseInt(normalized, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const PlayerOverlay = ({
  state,
  content,
  onRetry,
  onResume,
  backgroundColor,
}: {
  state: PlayerState
  content: PlayerStateContent
  onRetry?: () => void
  onResume?: () => void
  backgroundColor?: string
}) => {
  if (state === 'playing') return null

  const baseColor = backgroundColor ?? '#ffffff'
  const waitingOverlay = hexToRgba(baseColor, 0.86)
  const messageOverlay = hexToRgba(baseColor, 0.92)

  if (state === 'waiting') {
    return (
      <Flex
        position="absolute"
        top="0"
        left="0"
        width="100%"
        height="100%"
        align="center"
        justify="center"
        style={{
          backgroundColor: waitingOverlay,
          backdropFilter: 'blur(4px)',
        }}
      >
        <Spinner
          size="3"
          style={{ color: 'var(--ruby-9)' }}
        />
      </Flex>
    )
  }

  return (
    <Flex
      position="absolute"
      top="0"
      left="0"
      width="100%"
      height="100%"
      align="center"
      justify="center"
      style={{
        padding: 'var(--space-6)',
        backgroundColor: messageOverlay,
        backdropFilter: 'blur(4px)',
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
          {content.icon ? (
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
          ) : null}
          {content.message ? (
            <Text
              align="center"
              size="3"
            >
              {content.message}
            </Text>
          ) : null}
          {content.actionType === 'resume' && onResume ? (
            <Button
              color="ruby"
              onClick={onResume}
            >
              {content.actionLabel ?? 'Resume stream'}
            </Button>
          ) : null}
          {content.actionType === 'retry' && onRetry ? (
            <Button
              variant="outline"
              color="ruby"
              onClick={onRetry}
            >
              {content.actionLabel ?? 'Retry now'}
            </Button>
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
    message: "We'll be back to streaming very soon.",
    icon: (
      <VideoIcon
        width={36}
        height={36}
      />
    ),
    actionType: 'retry',
    actionLabel: 'Retry now',
  },
  waiting: {
    badgeLabel: 'Connecting to browser feed…',
    badgeColor: 'indigo',
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
    message: 'Autoplay is blocked. Tap resume to start streaming.',
    icon: (
      <ExclamationTriangleIcon
        width={36}
        height={36}
      />
    ),
    actionType: 'resume',
    actionLabel: 'Resume stream',
  },
  unsupported: {
    badgeLabel: 'Playback not supported',
    badgeColor: 'red',
    message:
      'This browser cannot play HLS streams. Try Safari or another browser with Media Source Extensions.',
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
    message: "We'll be back to streaming very soon.",
    icon: (
      <VideoIcon
        width={36}
        height={36}
      />
    ),
    actionType: 'retry',
    actionLabel: 'Retry now',
  },
  waiting: {
    badgeLabel: 'Connecting to assistant…',
    badgeColor: 'indigo',
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
    message: 'Autoplay is blocked. Tap resume to hear the assistant.',
    icon: (
      <ExclamationTriangleIcon
        width={36}
        height={36}
      />
    ),
    actionType: 'resume',
    actionLabel: 'Resume audio',
  },
  unsupported: {
    badgeLabel: 'Playback not supported',
    badgeColor: 'red',
    message:
      'This browser cannot play HLS streams. Try Safari or another browser with Media Source Extensions.',
    icon: (
      <ExclamationTriangleIcon
        width={36}
        height={36}
      />
    ),
  },
}

export const ComputerUsePlayer = ({ streamConfig }: BasePlayerProps) => {
  const { videoRef, state, retry, resume } = useHlsPlayer({
    sources: streamConfig.computerUseSources.map((s) => s.url),
  })

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
          backgroundColor: '#000',
          height: '100%',
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
            playsInline
            style={{
              width: '100%',
              height: 'auto',
              minHeight: '100%',
              display: 'block',
              backgroundColor: '#000',
            }}
          />
        </Box>

        <PlayerOverlay
          state={state}
          content={computerStateContent[state]}
          onRetry={retry}
          onResume={resume}
          backgroundColor="#ffffff"
        />
      </Box>

      <HiddenStateBadge
        state={state}
        content={computerStateContent[state]}
        testId="computer-preview-status"
      />
    </Flex>
  )
}

export const AssistantPlayer = ({ streamConfig }: BasePlayerProps) => {
  console.log('Rendering AssistantPlayer with streamConfig:', streamConfig)
  const { videoRef, state, retry, resume } = useHlsPlayer({
    sources: streamConfig.assistantSources.map((s) => s.url),
  })
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    const element = videoRef.current
    if (!element) return
    element.muted = muted
  }, [muted, videoRef])

  const toggleMuted = () => setMuted((value) => !value)

  const showMuteToggle = state === 'playing'
  const showLiveBadge = state === 'playing'

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
          aspectRatio: '16 / 9',
          backgroundColor: streamConfig.backgroundColor,
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
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              backgroundColor: 'transparent',
            }}
          />
        </Box>

        <PlayerOverlay
          state={state}
          content={assistantStateContent[state]}
          onRetry={retry}
          onResume={() => {
            resume()
            setMuted(false)
          }}
          backgroundColor={streamConfig.backgroundColor}
        />

        {showMuteToggle ? (
          <Box
            position="absolute"
            bottom="var(--space-2)"
            right="var(--space-2)"
          >
            <IconButton
              size="2"
              variant={muted ? 'surface' : 'solid'}
              color="ruby"
              aria-label={muted ? 'Unmute assistant' : 'Mute assistant'}
              onClick={toggleMuted}
            >
              {muted ? <SpeakerOffIcon /> : <SpeakerLoudIcon />}
            </IconButton>
          </Box>
        ) : null}

        {showLiveBadge ? (
          <Flex
            position="absolute"
            left="var(--space-2)"
            bottom="var(--space-2)"
            gap="1"
          >
            <StreamStatusBadge streamConfig={streamConfig} />

            <Flex
              align="center"
              gap="1"
              px="2"
              py="1"
              style={{
                borderRadius: '9999px',
                backgroundColor: 'var(--gray-a10)',
                color: 'white',
              }}
            >
              <PersonIcon />

              <Text
                size="1"
                weight="medium"
              >
                2
              </Text>
            </Flex>
          </Flex>
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
