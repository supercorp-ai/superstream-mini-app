import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { streamConfigs } from '@/lib/streams/streamConfigs'

export const useStreamConfigs = () => {
  const t = useTranslations('lib.assistants.assistantConfigs')

  return useMemo(
    () => ({
      streamConfigs: streamConfigs({ t }),
    }),
    [t],
  )
}
