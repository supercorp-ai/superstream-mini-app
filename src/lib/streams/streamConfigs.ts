import type { useTranslations } from 'next-intl'

type AssistantConfigsTranslations = ReturnType<
  typeof useTranslations<'lib.assistants.assistantConfigs'>
>

export const listaStreamConfig = ({
  t,
}: {
  t: AssistantConfigsTranslations
}) => ({
  title: 'Boardy',
})

export const streamConfigs = ({ t }: { t: AssistantConfigsTranslations }) => [
  listaStreamConfig({ t }),
]
