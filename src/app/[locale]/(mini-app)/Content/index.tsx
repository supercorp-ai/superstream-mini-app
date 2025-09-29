'use client'
import { useTranslations } from 'next-intl'
import BackgroundVideo from 'next-video/background-video'
import { useRouter } from '@/i18n/navigation'
import Image from 'next/image'
import { useCallback, useState, useTransition } from 'react'
import { Button, Heading, Text, Flex, Box } from '@radix-ui/themes'
import { walletAuth } from '@/lib/auth/walletAuth'
import heroVideoSrc from '/videos/hero.mp4'
import { LocaleInput } from '@/components/locales/LocaleInput'
import { adamStreamId } from '@/lib/streams/streamConfigs'

const AuthButton = () => {
  const router = useRouter()
  const [isPendingManual, setIsPendingManual] = useState(false)
  const [isPending, startTransition] = useTransition()
  const t = useTranslations('app.miniApp.Content.AuthButton')

  const onClick = useCallback(async () => {
    setIsPendingManual(true)
    setTimeout(() => setIsPendingManual(false), 8000)

    let result

    try {
      result = await walletAuth()
    } catch (error) {
      console.error('Wallet authentication failed', error)
      setIsPendingManual(false)
      return
    }

    if (result?.error) {
      console.error('Wallet authentication failed', result)
    }

    setIsPendingManual(false)
    startTransition(() => {
      router.push(`/streams/${adamStreamId}`)
    })
  }, [router, startTransition])

  return (
    <Button
      onClick={onClick}
      loading={isPending || isPendingManual}
      size="4"
    >
      {t('text')}
    </Button>
  )
}

export const Content = () => {
  const t = useTranslations('app.miniApp.Content')

  return (
    <Flex
      direction="column"
      height="100dvh"
      flexGrow="1"
      justify="center"
      p="2"
      style={{
        position: 'relative',
      }}
    >
      <Flex
        left="0"
        right="0"
        bottom="0"
        position="absolute"
        justify="center"
        style={{
          zIndex: -1,
          maxHeight: '70dvh',
          maxWidth: '100dvw',
        }}
      >
        <Flex
          style={{
            maxWidth: 'min(100dvw, 600px)',
            flexGrow: 1,
          }}
        >
          <BackgroundVideo
            src={heroVideoSrc}
            autoPlay
            loop
            playsInline
            style={{
              objectFit: 'cover',
              objectPosition: 'center bottom',
              aspectRatio: 1,
            }}
          />
        </Flex>
      </Flex>

      <Flex
        direction="column"
        gap="5"
        align="center"
      >
        <Flex
          direction="column"
          align="center"
          justify="center"
          gap="3"
          style={{ textAlign: 'center' }}
        >
          <Box
            style={{
              position: 'relative',
              width: 'var(--space-9)',
              height: 'var(--space-9)',
              borderRadius: 'var(--radius-1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <Image
              src="/superstream-logo.png"
              alt="Superstream logo"
              layout="fill"
              sizes="(max-width: 768px) 160px, 300px"
              style={{
                objectFit: 'contain',
              }}
            />
          </Box>

          <Box style={{ maxWidth: '400px' }}>
            <Heading
              color="gray"
              highContrast
              size="7"
            >
              Superstream
            </Heading>
            <Text
              color="gray"
              size="5"
            >
              {t('heading')}
            </Text>
          </Box>
        </Flex>

        <Flex
          direction="column"
          gap="3"
          align="center"
        >
          <AuthButton />
          <LocaleInput />
        </Flex>
      </Flex>
    </Flex>
  )
}
