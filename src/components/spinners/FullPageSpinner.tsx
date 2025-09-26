import { Flex, Spinner } from '@radix-ui/themes'

export const FullPageSpinner = () => (
  <Flex
    align="center"
    justify="center"
    style={{ height: '100dvh', width: '100dvw' }}
  >
    <Spinner />
  </Flex>
)
