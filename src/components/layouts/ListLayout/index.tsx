import { Flex } from '@radix-ui/themes'
import { CloudLayout } from '@/components/layouts/CloudLayout'

const Content = ({ children }: { children: React.ReactNode }) => (
  <Flex
    direction="column"
    flexGrow="1"
    style={{
      boxShadow: '0 0 0 1px var(--gray-a3)',
      borderRadius: 'var(--radius-4)',
      overflow: 'hidden',
    }}
  >
    {children}
  </Flex>
)

const Item = ({
  children,
  isActive,
}: {
  children: React.ReactNode
  isActive?: boolean
}) => (
  <Flex
    direction="column"
    p="4"
    style={{
      backgroundColor: isActive ? 'var(--gray-2)' : 'var(--gray-1)',
      boxShadow: '0 0 0 1px var(--gray-a3)',
    }}
  >
    {children}
  </Flex>
)

export const ListLayout = {
  Root: CloudLayout.Root,
  Header: CloudLayout.Header,
  Title: CloudLayout.Title,
  Description: CloudLayout.Description,
  Content,
  Item,
}
