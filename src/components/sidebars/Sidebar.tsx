'use client'
import { WorldcoinUser } from '@/types'
import { Menu } from '@/components/menus/Menu'
import { Flex } from '@radix-ui/themes'

export const Sidebar = ({
  worldcoinUser,
}: {
  worldcoinUser: WorldcoinUser
}) => (
  <Flex
    display={{
      initial: 'none',
      md: 'flex',
    }}
    width="300px"
  >
    <Menu.Root>
      <Menu.Content worldcoinUser={worldcoinUser} />
    </Menu.Root>
  </Flex>
)
