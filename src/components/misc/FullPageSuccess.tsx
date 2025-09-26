import { CheckCircledIcon } from '@radix-ui/react-icons'
import { Heading, Text, Flex } from '@radix-ui/themes'

export const FullPageSuccess = ({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) => (
  <Flex
    align="center"
    justify="center"
    style={{ height: '100dvh', width: '100dvw', padding: 'var(--space-4)' }}
  >
    <Flex
      direction="column"
      align="center"
      justify="center"
      gap="4"
    >
      <CheckCircledIcon
        height="32px"
        width="32px"
      />

      <Flex
        direction="column"
        align="center"
        gap="2"
        style={{ textAlign: 'center' }}
      >
        <Heading
          as="h1"
          color="gray"
          highContrast
          size="4"
        >
          {title}
        </Heading>
        <Text color="gray">{subtitle}</Text>
      </Flex>
    </Flex>
  </Flex>
)
