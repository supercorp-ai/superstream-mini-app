import { Flex, Heading, Text } from '@radix-ui/themes'

const Root = ({ children }: { children: React.ReactNode }) => (
  <Flex
    flexGrow="1"
    direction="column"
  >
    {children}
  </Flex>
)

const Header = ({ children }: { children: React.ReactNode }) => (
  <Flex
    direction={{
      initial: 'column',
      md: 'row',
    }}
    align={{
      initial: 'stretch',
      md: 'center',
    }}
    justify="between"
    flexShrink="0"
    gap="2"
    mb="5"
  >
    {children}
  </Flex>
)

const Title = Heading

const Description = ({ children }: { children: React.ReactNode }) => (
  <Text
    color="gray"
    size={{
      initial: '2',
      md: '3',
    }}
  >
    {children}
  </Text>
)

export const CloudLayout = {
  Root,
  Header,
  Title,
  Description,
}
