import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { assistantConfigs } from '@/lib/assistants/assistantConfigs'

export const useAssistantConfigs = () => {
  const t = useTranslations('lib.assistants.assistantConfigs')

  return useMemo(
    () => ({
      assistantConfigs: assistantConfigs({ t }),
    }),
    [t],
  )
}
