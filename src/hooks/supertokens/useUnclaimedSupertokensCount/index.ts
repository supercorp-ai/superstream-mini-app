import { useQuery } from '@tanstack/react-query'
import { getUnclaimedSupertokensCount } from './getUnclaimedSupertokensCount'

export const useUnclaimedSupertokensCount = () => {
  const queryProps = useQuery({
    queryKey: ['unclaimedSupertokens'],
    queryFn: () => getUnclaimedSupertokensCount({}),
    refetchInterval: 40000, // 40 seconds
    refetchIntervalInBackground: true,
  })

  return {
    unclaimedSupertokensCount:
      queryProps.data?.data?.unclaimedSupertokensCount ?? null,
    ...queryProps,
  }
}
