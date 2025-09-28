import type { themePropDefs } from '@radix-ui/themes/props'
import type { Currency, StreamStatus } from '@/enums'
import type { Locale } from 'next-intl'

export type Toast = {
  type: 'success' | 'error'
  message: string
}

export type WorldcoinUser = {
  username: string
  address: string
  profileImageUrl?: string
}

export type Theme = {
  accentColor: (typeof themePropDefs.accentColor.values)[number]
  grayColor: (typeof themePropDefs.grayColor.values)[number]
  radius: (typeof themePropDefs.radius.values)[number]
  appearance: (typeof themePropDefs.appearance.values)[number]
  scaling: (typeof themePropDefs.scaling.values)[number]
}

export type AvatarType = 'ICON' | 'IMAGE'

export type IconAvatar = {
  name: string
}

export type ImageAvatar = {
  url: string
}

export type Avatar = {
  type: AvatarType
  iconAvatar: IconAvatar | null
  imageAvatar: ImageAvatar | null
}

export type Assistant = {
  id: string
  name: string
  description: string
  theme: Theme
  avatar: Avatar
}

export type Group = {
  name: string
  assistants: Assistant[]
}

export type AssistantWithGroup = Assistant & {
  group: Group
}

export type Price = {
  currency: Currency
  value: number
}

export type ToolConfig = {
  icon: React.ReactNode
  name: string
  isFuture?: boolean
}

export type AssistantConfig = {
  slug: string
  superinterfaceAssistantId: string
  name: string
  description: string
  videoSrc: any
}

export type AssistantSource = {
  locale: Locale
  url: string
}

export type ComputerUseSource = {
  url: string
}

export type StreamConfig = {
  id: string
  title: string
  status: StreamStatus
  backgroundColor: string
  assistantSlug: string
  assistantSources: AssistantSource[]
  computerUseSources: ComputerUseSource[]
}
