import type { useTranslations } from 'next-intl'

type AssistantConfigsTranslations = ReturnType<
  typeof useTranslations<'lib.assistants.assistantConfigs'>
>

export const adamStreamConfig = ({
  t,
}: {
  t: AssistantConfigsTranslations
}) => ({
  streamId: 'a1c19514-7623-400e-abeb-7b4defeebdbb',
  backgroundColor: '#EAE8AD',
})

export const streamConfigs = ({ t }: { t: AssistantConfigsTranslations }) => [
  adamStreamConfig({ t }),
]
