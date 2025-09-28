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
import { HamburgerMenuIcon, Cross1Icon } from '@radix-ui/react-icons'
import type { WorldcoinUser } from '@/types'
import { Menu } from '@/components/menus/Menu'
import { SuperstreamLogo } from '@/components/logos/SuperstreamLogo'
import { LocaleInput } from '@/components/locales/LocaleInput'
import { SupertokensButton } from './SupertokensButton'
export { SupertokensButton } from './SupertokensButton'
// import { useRouter } from '@/i18n/navigation'
// import { useTransition } from 'react'

// const StreamsButton = () => {
//   const router = useRouter()
//   const [isPending, startTransition] = useTransition()
//
//   return (
//     <IconButton
//       color="amber"
//       variant="soft"
//       highContrast
//       loading={isPending}
//       onClick={() => {
//         startTransition(() => {
//           router.push('/streams')
//         })
//       }}
//     >
//       <CalendarIcon />
//     </IconButton>
//   )
// }
//
const DialogAction = ({ worldcoinUser }: { worldcoinUser: WorldcoinUser }) => {
  const t = useTranslations('components.layouts.Layout.Header.DialogAction')
  const [isOpen, setIsOpen] = useState(false)

  return (
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
          height: 'calc(100dvh - var(--space-6) - max(var(--space-6), 6vh))',
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
  )
}

const Root = ({
  children,
  backgroundColor,
}: {
  children: React.ReactNode
  backgroundColor?: string
}) => (
  <Flex
    justify="between"
    align="center"
    py="3"
    px="3"
    flexShrink="0"
    style={{
      backgroundColor,
      zIndex: 9999,
    }}
  >
    {children}
  </Flex>
)

export const LeftSection = ({
  worldcoinUser,
  showStreamsLink,
}: {
  worldcoinUser: WorldcoinUser
  showStreamsLink?: boolean
}) => {
  const t = useTranslations('components.layouts.Layout.Header')

  return (
    <Flex
      align="center"
      gap="1"
    >
      <Flex
        display={{
          initial: 'flex',
          md: 'none',
        }}
        gap="4"
        align="center"
      >
        <DialogAction worldcoinUser={worldcoinUser} />

        <LocaleInput
          variant="ghost"
          isMinimal
          size="3"
        />
      </Flex>

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

        <LocaleInput
          variant="ghost"
          isMinimal
          size="3"
        />

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
  )
}

export const RightSectionRoot = ({
  children,
}: {
  children: React.ReactNode
}) => (
  <Flex
    px="2"
    gap="4"
    align="center"
    ml="-32px"
  >
    {children}
  </Flex>
)

export const RightSection = () => (
  <RightSectionRoot>
    <SupertokensButton />
  </RightSectionRoot>
)

export const Header = ({
  worldcoinUser,
  showStreamsLink = false,
  backgroundColor,
}: {
  worldcoinUser: WorldcoinUser
  showStreamsLink?: boolean
  backgroundColor?: string
}) => (
  <Root backgroundColor={backgroundColor}>
    <LeftSection
      worldcoinUser={worldcoinUser}
      showStreamsLink={showStreamsLink}
    />
    <RightSection />
  </Root>
)

export { Root as HeaderRoot }
