import type { StaticImageData } from 'next/image'
import type { PlanType } from '@prisma/client'
import type { themePropDefs } from '@radix-ui/themes/props'
import type { Currency } from '@/enums'

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
  superinterfaceAssistantId: string
  name: string
  description: string
  videoSrc: any
}
