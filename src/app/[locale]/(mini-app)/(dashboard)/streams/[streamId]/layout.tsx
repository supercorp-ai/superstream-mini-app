import { getCurrentUser } from '@/lib/users/getCurrentUser'
import { getWorldcoinUser } from '@/lib/worldcoin/getWorldcoinUser'
import type { Locale } from 'next-intl'
import { WorldcoinUserNotFound } from '@/components/worldcoinUsers/WorldcoinUserNotFound'
import { StreamNotFound } from '@/components/streams/StreamNotFound'
import { redirect } from '@/i18n/navigation'
import { Layout } from '@/components/layouts/Layout'
import { Sidebar } from '@/components/sidebars/Sidebar'
import { streamConfigs } from '@/lib/streams/streamConfigs'
import { hasLocale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { adamBackgroundColor } from '@/lib/assistants/colors'

type Props = {
  params: Promise<{
    streamId: string
    locale: string
  }>
  children: React.ReactNode
}

export default async function StreamLayout(props: Props) {
  const params = await props.params
  const { user } = await getCurrentUser()

  if (!user) {
    return redirect({ href: '/', locale: params.locale as Locale })
  }

  const { worldcoinUser } = await getWorldcoinUser({
    address: user.address,
  })

  if (!worldcoinUser) {
    return <WorldcoinUserNotFound />
  }

  const t = await getTranslations({
    locale: hasLocale(routing.locales, params.locale)
      ? params.locale
      : routing.defaultLocale,
    namespace: 'lib.assistants.assistantConfigs',
  })

  const streamConfig = streamConfigs({ t })[0]

  if (!streamConfig) {
    return <StreamNotFound />
  }

  return (
    <Layout.Root>
      <Layout.Header
        worldcoinUser={worldcoinUser}
        backgroundColor={adamBackgroundColor}
      />
      <Layout.Content.Root>
        <Sidebar worldcoinUser={worldcoinUser} />
        {props.children}
      </Layout.Content.Root>
    </Layout.Root>
  )
}
