import { Flex, Heading, Text, Card } from '@radix-ui/themes'
import { Link } from '@/i18n/navigation'
import { SuperstreamLogo } from '@/components/logos/SuperstreamLogo'

export const Root = ({ children }: { children: React.ReactNode }) => (
  <Flex
    direction="column"
    p="5"
    gap="5"
    minHeight="100vh"
  >
    <Flex justify="center">
      <Link href="/">
        <SuperstreamLogo />
      </Link>
    </Flex>

    <Flex
      flexGrow="1"
      align="center"
      justify="center"
    >
      <Card
        size="4"
        style={{
          maxWidth: '500px',
        }}
      >
        <Flex
          direction="column"
          gap="5"
          align="center"
        >
          {children}
        </Flex>
      </Card>
    </Flex>
  </Flex>
)

const HeaderRoot = ({ children }: { children: React.ReactNode }) => (
  <Flex
    direction="column"
    align="center"
    gap="3"
  >
    {children}
  </Flex>
)

const HeaderTitle = ({ children }: { children: React.ReactNode }) => (
  <Heading align="center">{children}</Heading>
)

const Header = {
  Root: HeaderRoot,
  Title: HeaderTitle,
}

const Description = ({ children }: { children: React.ReactNode }) => (
  <Text
    align="center"
    color="gray"
  >
    {children}
  </Text>
)

export const FocusLayout = {
  Root,
  Header,
  Description,
}
