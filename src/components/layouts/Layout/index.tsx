import { Header } from './Header'
import { Flex } from '@radix-ui/themes'

const Root = ({ children }: { children: React.ReactNode }) => (
  <Flex
    direction="column"
    flexGrow="1"
    style={{
      height: '100dvh',
    }}
  >
    {children}
  </Flex>
)

const ContentRoot = ({ children }: { children: React.ReactNode }) => (
  <Flex flexGrow="1">{children}</Flex>
)

export const Layout = {
  Header,
  Root,
  Content: {
    Root: ContentRoot,
  },
}
