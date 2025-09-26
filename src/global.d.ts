import type { MiniKit } from '@worldcoin/minikit-js'
import type { Locale } from 'next-intl'
import { routing } from '@/i18n/routing'
import { formats } from '@/i18n/request'
import messages from '../messages/en.json'

declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number]
    Messages: typeof messages
    Formats: typeof formats
  }
}

declare global {
  interface Window {
    MiniKit?: MiniKit & {
      user?: any
    }

    WorldApp?: {
      world_app_version: number
      device_os: 'ios' | 'android'

      supported_commands: Array<{
        name: import('@worldcoin/minikit-js').Command
        supported_versions: Array<number>
      }>
    }
  }
}

export {}
