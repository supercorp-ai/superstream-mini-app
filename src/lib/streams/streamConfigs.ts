import type { useTranslations } from 'next-intl'

type AssistantConfigsTranslations = ReturnType<
  typeof useTranslations<'lib.assistants.assistantConfigs'>
>

export type StreamConfig = {
  id: string
  backgroundColor: string
}

const adamStreamConfig = ({
  t,
}: {
  t: AssistantConfigsTranslations
}): StreamConfig => ({
  id: 'a1c19514-7623-400e-abeb-7b4defeebdbb',
  backgroundColor: '#EAE8AD',
})

export const streamConfigs = ({ t }: { t: AssistantConfigsTranslations }) => [
  adamStreamConfig({ t }),
]

export const findStreamConfig = ({
  t,
  streamId,
}: {
  t: AssistantConfigsTranslations
  streamId: string
}) => streamConfigs({ t }).find((config) => config.id === streamId)

export const getDefaultStreamConfig = ({
  t,
}: {
  t: AssistantConfigsTranslations
}) => streamConfigs({ t })[0]
