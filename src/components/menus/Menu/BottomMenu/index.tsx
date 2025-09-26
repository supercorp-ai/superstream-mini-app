import { DropdownMenu, Text, Button, Flex, Avatar } from '@radix-ui/themes'
import { useTranslations } from 'next-intl'
import { CaretSortIcon } from '@radix-ui/react-icons'
import type { WorldcoinUser } from '@/types'
import { SignOutButton } from './SignOutButton'
import { Supertokens } from './Supertokens'
import { FaTwitter } from 'react-icons/fa'
import { LinkedInLogoIcon } from '@radix-ui/react-icons'
import { xUrl } from '@/lib/misc/xUrl'
import { linkedinUrl } from '@/lib/misc/linkedinUrl'
import { supportUrl } from '@/lib/misc/supportUrl'

export const BottomMenu = ({
  worldcoinUser,
}: {
  worldcoinUser: WorldcoinUser
}) => {
  const t = useTranslations('components.menus.Menu.BottomMenu')

  return (
    <Flex
      direction="column"
      gap="4"
      flexShrink="0"
      px="4"
      pb="4"
    >
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Flex
            gap="4"
            align="center"
            justify="between"
            px="4"
            py="3"
            style={{
              backgroundColor: 'var(--violet-3)',
              cursor: 'pointer',
              borderRadius: 'var(--radius-4)',
            }}
          >
            <Flex
              gap="2"
              align="center"
            >
              <Avatar
                src={worldcoinUser.profileImageUrl}
                alt={t('avatarAlt')}
                fallback={worldcoinUser.username.charAt(0)}
              />
              <Flex direction="column">
                <Text
                  size="2"
                  weight="medium"
                >
                  {worldcoinUser.username}
                </Text>

                <Text
                  size="1"
                  color="gray"
                >
                  Human
                </Text>
              </Flex>
            </Flex>

            <Flex align="center">
              <CaretSortIcon
                height="20px"
                width="20px"
              />
            </Flex>
          </Flex>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content size="2">
          <Flex
            direction="column"
            gap="2"
          >
            <Supertokens />
            <Button
              variant="soft"
              onClick={() => window.open(xUrl)}
              size="3"
              style={{
                cursor: 'pointer',
              }}
            >
              <FaTwitter /> X/Twitter
            </Button>
            <Button
              variant="soft"
              onClick={() => window.open(linkedinUrl)}
              size="3"
              style={{
                cursor: 'pointer',
              }}
            >
              <LinkedInLogoIcon /> LinkedIn
            </Button>
            <Button
              variant="soft"
              onClick={() => window.open(supportUrl)}
              size="3"
              style={{
                cursor: 'pointer',
              }}
            >
              {t('contactButtonLabel')}
            </Button>
            <SignOutButton />
          </Flex>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Flex>
  )
}
