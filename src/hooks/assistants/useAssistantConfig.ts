import { useMemo } from 'react'
import { useAssistantConfigs } from '@/hooks/assistants/useAssistantConfigs'

export const useAssistantConfig = ({
  assistantId,
}: {
  assistantId: string
}) => {
  const { assistantConfigs } = useAssistantConfigs()

  return useMemo(() => {
    if (!assistantId) {
      return {
        assistantConfig: null,
      }
    }

    return {
      assistantConfig: assistantConfigs.find(
        (assistantConfig) =>
          assistantConfig.superinterfaceAssistantId === assistantId,
      ),
    }
  }, [assistantId, assistantConfigs])
}
