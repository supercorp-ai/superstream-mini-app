import { Flex, Text, Heading } from '@radix-ui/themes'

const Root = ({ children }: { children: React.ReactNode }) => (
  <Flex
    align="center"
    justify="center"
    flexGrow="1"
    p={{
      initial: '2',
      md: '5',
    }}
  >
    <Flex
      direction="column"
      align="center"
    >
      {children}
    </Flex>
  </Flex>
)

const Title = ({ children }: { children: React.ReactNode }) => (
  <Heading
    mt={{
      initial: '2',
      md: '5',
    }}
    align="center"
  >
    {children}
  </Heading>
)

const Description = ({ children }: { children: React.ReactNode }) => (
  <Flex
    justify="center"
    mt="2"
    mb="5"
    maxWidth="550px"
  >
    <Text
      size={{
        initial: '2',
        md: '3',
      }}
      color="gray"
      align="center"
    >
      {children}
    </Text>
  </Flex>
)

export const EmptyState = {
  Root,
  Title,
  Description,
}
