import { Flex, Text } from '@radix-ui/themes'
import type { StreamConfig } from '@/types'
import { StreamStatus } from '@/enums'

const backgroundColor = ({ streamConfig }: { streamConfig: StreamConfig }) => {
  if (streamConfig.status === StreamStatus.LIVE) {
    return 'var(--red-10)'
  } else if (streamConfig.status === StreamStatus.SOON) {
    return 'var(--gray-10)'
  } else {
    return 'var(--gray-10)'
  }
}

export const StreamStatusBadge = ({
  streamConfig,
}: {
  streamConfig: StreamConfig
}) => (
  <Flex
    align="center"
    gap="2"
    px="2"
    py="1"
    style={{
      borderRadius: '9999px',
      backgroundColor: backgroundColor({ streamConfig }),
      color: 'white',
    }}
  >
    <Text
      size="1"
      weight="medium"
    >
      {streamConfig.status}
    </Text>
  </Flex>
)
