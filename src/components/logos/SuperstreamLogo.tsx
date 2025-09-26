import Image from 'next/image'
import { Heading, Flex, Box } from '@radix-ui/themes'

export const SuperstreamLogo = () => (
  <Flex
    align="center"
    gap="1"
  >
    <Box
      style={{
        position: 'relative',
        width: 'var(--space-6)',
        height: 'var(--space-6)',
        borderRadius: 'var(--radius-3)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Image
        src="/superstream-logo.png"
        alt="Superstream logo"
        fill
        sizes="70px"
      />
    </Box>

    <Heading
      size="3"
      style={{ paddingTop: '1px' }}
    >
      Superstream
    </Heading>
  </Flex>
)
