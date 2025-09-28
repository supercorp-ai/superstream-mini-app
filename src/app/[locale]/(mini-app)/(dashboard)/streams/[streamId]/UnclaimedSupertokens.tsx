'use client'
import { Badge, Spinner } from '@radix-ui/themes'
import { useUnclaimedSupertokensCount } from '@/hooks/supertokens/useUnclaimedSupertokensCount'

export const UnclaimedSupertokens = () => {
  const { unclaimedSupertokensCount, isFetching } =
    useUnclaimedSupertokensCount()

  if (isFetching) {
    return <Spinner size="1" />
  }

  if (!unclaimedSupertokensCount) {
    return (
      <Badge
        size="1"
        color="green"
        radius="full"
        highContrast
      >
        Earning 1 SUPER every minute
      </Badge>
    )
  }

  return (
    <Badge
      size="1"
      color="green"
      radius="full"
      highContrast
    >
      Earned {unclaimedSupertokensCount} SUPER
    </Badge>
  )
}
