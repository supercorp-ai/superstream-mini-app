import type { useTranslations } from 'next-intl'
import type { StreamConfig } from '@/types'
import { StreamStatus } from '@/enums'

type AssistantConfigsTranslations = ReturnType<
  typeof useTranslations<'lib.assistants.assistantConfigs'>
>

const adamStreamConfig = ({
  t,
}: {
  t: AssistantConfigsTranslations
}): StreamConfig => ({
  id: 'a1c19514-7623-400e-abeb-7b4defeebdbb',
  title: 'Earning income on the internet with AI',
  status: StreamStatus.LIVE,
  backgroundColor: '#EAE8AD',
  assistantSlug: 'adam',
  assistantSources: [
    {
      locale: 'en',
      url: 'https://mediamtx.superstream.sh/assistant_aac/index.m3u8',
    },
    {
      locale: 'en',
      url: 'https://mediamtx.superstream.sh/assistant/index.m3u8',
    },
  ],
  computerUseSources: [
    {
      url: 'https://mediamtx.superstream.sh/computer_use_aac/index.m3u8',
    },
    {
      url: 'https://mediamtx.superstream.sh/computer_use/index.m3u8',
    },
  ],
})

const listaStreamConfig = ({
  t,
}: {
  t: AssistantConfigsTranslations
}): StreamConfig => ({
  id: 'a1c19514-7623-400e-abeb-7b4defeebdbb',
  title: 'Crypto opportunities with AI tools',
  status: StreamStatus.SOON,
  backgroundColor: '#EAE8AD',
  assistantSlug: 'lista',
  assistantSources: [],
  computerUseSources: [],
})

export const streamConfigs = ({ t }: { t: AssistantConfigsTranslations }) => [
  adamStreamConfig({ t }),
  listaStreamConfig({ t }),
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
