'use client'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { CalendarIcon, ChatBubbleIcon } from '@radix-ui/react-icons'
import { Button, Flex } from '@radix-ui/themes'
import type { WorldcoinUser } from '@/types'
import { BottomMenu } from './BottomMenu'

const HeaderRoot = ({ children }: { children: React.ReactNode }) => (
  <Flex
    direction="column"
    gap="2"
    px="4"
    flexShrink="0"
  >
    {children}
  </Flex>
)

const HeaderContent = () => <></>

const Header = () => (
  <HeaderRoot>
    <HeaderContent />
  </HeaderRoot>
)

Header.Root = HeaderRoot
Header.Content = HeaderContent

const Content = ({ worldcoinUser }: { worldcoinUser: WorldcoinUser }) => (
  <>
    <Header />
    Streams here maybe
    <BottomMenu worldcoinUser={worldcoinUser} />
  </>
)

Content.Header = Header
Content.BottomMenu = BottomMenu

// <Dialog.Close>
// around New Chat

const Root = ({ children }: { children: React.ReactNode }) => (
  <Flex
    direction="column"
    gap="4"
    style={{ height: '100%' }}
    flexGrow="1"
  >
    {children}
  </Flex>
)

export const Menu = ({ worldcoinUser }: { worldcoinUser: WorldcoinUser }) => (
  <Root>
    <Content worldcoinUser={worldcoinUser} />
  </Root>
)

Menu.Root = Root
Menu.Content = Content
