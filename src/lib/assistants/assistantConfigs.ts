import type { useTranslations } from 'next-intl'
import boardyVideo from '/videos/assistants/boardy.mp4'
import loganVideo from '/videos/assistants/logan.mp4'
import emmaVideo from '/videos/assistants/emma.mp4'
import supaVideo from '/videos/assistants/supa.mp4'
import markVideo from '/videos/assistants/mark.mp4'
import quillaVideo from '/videos/assistants/quilla.mp4'
import parryVideo from '/videos/assistants/parry.mp4'
import charlieVideo from '/videos/assistants/charlie.mp4'
import siaVideo from '/videos/assistants/sia.mp4'
import sunnyVideo from '/videos/assistants/sunny.mp4'
import adamVideo from '/videos/assistants/adam.mp4'
import shoppyVideo from '/videos/assistants/shoppy.mp4'
import vitaVideo from '/videos/assistants/vita.mp4'
import joboVideo from '/videos/assistants/jobo.mp4'
import zenaVideo from '/videos/assistants/zena.mp4'
import listaVideo from '/videos/assistants/lista.mp4'
import aidaVideo from '/videos/assistants/aida.mp4'
import kairosVideo from '/videos/assistants/kairos.mp4'
import reevVideo from '/videos/assistants/reev.mp4'
import copiaVideo from '/videos/assistants/copia.mp4'

type AssistantConfigsTranslations = ReturnType<
  typeof useTranslations<'lib.assistants.assistantConfigs'>
>

export const boardySuperinterfaceAssistantId =
  'e3e08101-122e-4943-a8c9-8c46adc7965b'

export const charlieSuperinterfaceAssistantId =
  '14592435-66be-48f4-80f7-9c960dc8a7b0'

export const boardyAssistantConfig = ({
  t,
}: {
  t: AssistantConfigsTranslations
}) => ({
  slug: 'boardy',
  name: 'Boardy',
  description: t('boardy.description'),
  superinterfaceAssistantId: boardySuperinterfaceAssistantId,
  videoSrc: boardyVideo,
})

export const loganAssistantConfig = ({
  t,
}: {
  t: AssistantConfigsTranslations
}) => ({
  slug: 'logan',
  name: 'Logan',
  description: t('logan.description'),
  superinterfaceAssistantId: 'c1acec4d-409e-47ba-bc0b-5edf55dbf5b4',
  videoSrc: loganVideo,
})

export const emmaAssistantConfig = ({
  t,
}: {
  t: AssistantConfigsTranslations
}) => ({
  slug: 'emma',
  name: 'Emma',
  description: t('emma.description'),
  superinterfaceAssistantId: '72283bdb-9f18-40ee-87fc-c327e885673d',
  videoSrc: emmaVideo,
})

export const supaAssistantConfig = ({
  t,
}: {
  t: AssistantConfigsTranslations
}) => ({
  slug: 'supa',
  name: 'Supa',
  description: t('supa.description'),
  superinterfaceAssistantId: '667e81c1-dfd8-4e30-b92f-d91e4e817d67',
  videoSrc: supaVideo,
})

export const markAssistantConfig = ({
  t,
}: {
  t: AssistantConfigsTranslations
}) => ({
  slug: 'mark',
  name: 'Mark',
  description: t('mark.description'),
  superinterfaceAssistantId: '3038e9c3-495a-4e0f-90cc-a72a6ee13445',
  videoSrc: markVideo,
})

export const quillaAssistantConfig = ({
  t,
}: {
  t: AssistantConfigsTranslations
}) => ({
  slug: 'quilla',
  name: 'Quilla',
  description: t('quilla.description'),
  superinterfaceAssistantId: '0713d463-d110-4f97-a4a9-a9118930dd0c',
  videoSrc: quillaVideo,
})

export const parryAssistantConfig = ({
  t,
}: {
  t: AssistantConfigsTranslations
}) => ({
  slug: 'parry',
  name: 'Parry',
  description: t('parry.description'),
  superinterfaceAssistantId: '9f50b4fd-13f8-47bf-81fc-339b82438b78',
  videoSrc: parryVideo,
})

export const charlieAssistantConfig = ({
  t,
}: {
  t: AssistantConfigsTranslations
}) => ({
  slug: 'charlie',
  name: 'Charlie',
  description: t('charlie.description'),
  superinterfaceAssistantId: charlieSuperinterfaceAssistantId,
  videoSrc: charlieVideo,
})

export const siaAssistantConfig = ({
  t,
}: {
  t: AssistantConfigsTranslations
}) => ({
  name: 'Sia',
  slug: 'sia',
  description: t('sia.description'),
  superinterfaceAssistantId: 'dac9a9bc-e45e-4663-905b-74870ff3688c',
  videoSrc: siaVideo,
})

export const sunnyAssistantConfig = ({
  t,
}: {
  t: AssistantConfigsTranslations
}) => ({
  slug: 'sunny',
  name: 'Sunny',
  description: t('sunny.description'),
  superinterfaceAssistantId: '18231b8a-81e1-435b-b8cb-37a01409a656',
  videoSrc: sunnyVideo,
})

export const adamAssistantConfig = ({
  t,
}: {
  t: AssistantConfigsTranslations
}) => ({
  slug: 'adam',
  name: 'Adam',
  description: t('adam.description'),
  superinterfaceAssistantId: 'db9f6b60-cff1-4ada-b277-85395211af48',
  videoSrc: adamVideo,
})

export const shoppyAssistantConfig = ({
  t,
}: {
  t: AssistantConfigsTranslations
}) => ({
  slug: 'shoppy',
  name: 'Shoppy',
  description: t('shoppy.description'),
  superinterfaceAssistantId: 'ae76e808-3c68-4e4e-81fc-c305e76f9072',
  videoSrc: shoppyVideo,
})

export const vitaAssistantConfig = ({
  t,
}: {
  t: AssistantConfigsTranslations
}) => ({
  slug: 'vita',
  name: 'Vita',
  description: t('vita.description'),
  superinterfaceAssistantId: '6c271a86-e585-4c84-bd7b-4ce549b674e9',
  videoSrc: vitaVideo,
})

export const joboAssistantConfig = ({
  t,
}: {
  t: AssistantConfigsTranslations
}) => ({
  slug: 'jobo',
  name: 'Jobo',
  description: t('jobo.description'),
  superinterfaceAssistantId: '621fe829-6b3a-4617-8d65-e7688a6d9869',
  videoSrc: joboVideo,
})

export const zenaAssistantConfig = ({
  t,
}: {
  t: AssistantConfigsTranslations
}) => ({
  slug: 'zena',
  name: 'Zena',
  description: t('zena.description'),
  superinterfaceAssistantId: '09b10af2-2f49-43b2-86d8-bba7638280cd',
  videoSrc: zenaVideo,
})

export const listaAssistantConfig = ({
  t,
}: {
  t: AssistantConfigsTranslations
}) => ({
  slug: 'lista',
  name: 'Lista',
  description: t('lista.description'),
  superinterfaceAssistantId: 'a664297a-4d81-48ef-8d75-865f160801fd',
  videoSrc: listaVideo,
})

export const aidaAssistantConfig = ({
  t,
}: {
  t: AssistantConfigsTranslations
}) => ({
  slug: 'aida',
  name: 'Aida',
  description: t('aida.description'),
  superinterfaceAssistantId: 'd9019d56-78e9-41cf-8206-4cbc9adb3d5f',
  videoSrc: aidaVideo,
})

export const kairosAssistantConfig = ({
  t,
}: {
  t: AssistantConfigsTranslations
}) => ({
  slug: 'kairos',
  name: 'Kairos',
  description: t('kairos.description'),
  superinterfaceAssistantId: '7592afd0-5878-4cfa-b41e-43ff0f179ec5',
  videoSrc: kairosVideo,
})

export const reevAssistantConfig = ({
  t,
}: {
  t: AssistantConfigsTranslations
}) => ({
  slug: 'reev',
  name: 'Reev',
  description: t('reev.description'),
  superinterfaceAssistantId: '1cd2f4cb-c1bf-4b77-92fa-963e6830ece6',
  videoSrc: reevVideo,
})

export const copiaAssistantConfig = ({
  t,
}: {
  t: AssistantConfigsTranslations
}) => ({
  slug: 'copia',
  name: 'Copia',
  description: t('copia.description'),
  superinterfaceAssistantId: '8137f7a8-4671-4fc6-904b-a3e0b6247702',
  videoSrc: copiaVideo,
})

export const assistantConfigs = ({
  t,
}: {
  t: AssistantConfigsTranslations
}) => [
  boardyAssistantConfig({ t }),
  loganAssistantConfig({ t }),
  emmaAssistantConfig({ t }),
  supaAssistantConfig({ t }),
  markAssistantConfig({ t }),
  quillaAssistantConfig({ t }),
  parryAssistantConfig({ t }),
  charlieAssistantConfig({ t }),
  siaAssistantConfig({ t }),
  sunnyAssistantConfig({ t }),
  adamAssistantConfig({ t }),
  shoppyAssistantConfig({ t }),
  vitaAssistantConfig({ t }),
  joboAssistantConfig({ t }),
  zenaAssistantConfig({ t }),
  listaAssistantConfig({ t }),
  aidaAssistantConfig({ t }),
  kairosAssistantConfig({ t }),
  reevAssistantConfig({ t }),
  copiaAssistantConfig({ t }),
]
