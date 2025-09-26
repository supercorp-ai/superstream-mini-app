'use client'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import {
  Flex,
  Box,
  Button,
  Dialog,
  VisuallyHidden,
  IconButton,
} from '@radix-ui/themes'
import {
  HamburgerMenuIcon,
  Cross1Icon,
  CalendarIcon,
} from '@radix-ui/react-icons'
import type { WorldcoinUser } from '@/types'
import { Menu } from '@/components/menus/Menu'
import { SuperstreamLogo } from '@/components/logos/SuperstreamLogo'
import { LocaleInput } from '@/components/locales/LocaleInput'
import { SupertokensButton } from './SupertokensButton'
import { useRouter } from '@/i18n/navigation'
import { useTransition } from 'react'

const StreamsButton = () => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <IconButton
      color="amber"
      variant="soft"
      highContrast
      loading={isPending}
      onClick={() => {
        startTransition(() => {
          router.push('/streams')
        })
      }}
    >
      <CalendarIcon />
    </IconButton>
  )
}

const DialogAction = ({ worldcoinUser }: { worldcoinUser: WorldcoinUser }) => {
  const t = useTranslations('components.layouts.Layout.Header.DialogAction')
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Box
      display={{
        initial: 'block',
        md: 'none',
      }}
    >
      <Dialog.Root
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <Dialog.Trigger>
          <IconButton
            variant="soft"
            highContrast
          >
            <HamburgerMenuIcon />
          </IconButton>
        </Dialog.Trigger>
        <Dialog.Content
          style={{
            height: 'calc(100dvh - var(--space-6) - max(var(--space-6), 6vh)',
            width: 'calc(100dvw - 2 * var(--space-4))',
            padding: 0,
          }}
        >
          <VisuallyHidden>
            <Dialog.Title>{t('title')}</Dialog.Title>
            <Dialog.Description>{t('description')}</Dialog.Description>
          </VisuallyHidden>

          <Menu.Root>
            <Flex
              gap="4"
              align="center"
              justify="between"
              style={{
                flexShrink: 0,
                padding: 'var(--space-4) var(--space-4) 0',
              }}
            >
              <Link href="/">
                <SuperstreamLogo />
              </Link>

              <Dialog.Close>
                <IconButton variant="ghost">
                  <Cross1Icon />
                </IconButton>
              </Dialog.Close>
            </Flex>
            <Menu.Content.Header.Root>
              <Flex
                direction="column"
                gap="2"
                onClick={() => setIsOpen(false)}
              >
                <Menu.Content.Header.Content />
              </Flex>
            </Menu.Content.Header.Root>
            Streams here possibly
            <Menu.Content.BottomMenu worldcoinUser={worldcoinUser} />
          </Menu.Root>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  )
}

export const Header = ({
  worldcoinUser,
  showStreamsLink = false,
}: {
  worldcoinUser: WorldcoinUser
  showStreamsLink?: boolean
}) => {
  const t = useTranslations('components.layouts.Layout.Header')

  return (
    <Flex
      justify="between"
      align="center"
      py="3"
      px="3"
      flexShrink="0"
    >
      <Flex
        align="center"
        gap="1"
      >
        <DialogAction worldcoinUser={worldcoinUser} />

        <Box
          display={{
            initial: 'block',
            md: 'none',
          }}
        >
          <StreamsButton />
        </Box>

        <Flex
          display={{
            initial: 'none',
            md: 'flex',
          }}
          gap="4"
        >
          <Link href="/">
            <SuperstreamLogo />
          </Link>

          {showStreamsLink && (
            <Button
              asChild
              variant="soft"
            >
              <Link href="/streams">{t('streamsLinkLabel')}</Link>
            </Button>
          )}
        </Flex>
      </Flex>
      <Flex
        px="2"
        gap="4"
        align="center"
        ml="-32px"
      >
        <LocaleInput
          variant="ghost"
          isMinimal
          size="3"
        />
        <SupertokensButton />
      </Flex>
    </Flex>
  )
}
