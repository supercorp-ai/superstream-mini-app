import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { LinkBreak1Icon } from '@radix-ui/react-icons'
import { Button, Heading, Text, Flex } from '@radix-ui/themes'

export const FullPageNotFound = ({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) => {
  const t = useTranslations('components.misc.FullPageNotFound')

  return (
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
        <LinkBreak1Icon
          height="32px"
          width="32px"
        />

        <Flex
          direction="column"
          align="center"
          gap="2"
          style={{ textAlign: 'center' }}
        >
          <Heading as="h1">{title}</Heading>
          <Text>{subtitle}</Text>
        </Flex>

        <Button asChild>
          <Link href="/">{t('homeButtonLabel')}</Link>
        </Button>
      </Flex>
    </Flex>
  )
}
