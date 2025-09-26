import { Flex, Spinner } from '@radix-ui/themes'

export default function Loading() {
  return (
    <Flex
      align="center"
      justify="center"
      flexGrow="1"
    >
      <Spinner />
    </Flex>
  )
}
