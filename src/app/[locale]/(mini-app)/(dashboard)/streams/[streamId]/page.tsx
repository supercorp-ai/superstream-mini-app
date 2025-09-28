import { Content } from './Content'
import { getCurrentUser } from '@/lib/users/getCurrentUser'
import { StreamNotFound } from '@/components/streams/StreamNotFound'
import { redirect } from '@/i18n/navigation'
import type { Locale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { findStreamConfig } from '@/lib/streams/streamConfigs'
import { routing } from '@/i18n/routing'

type Props = {
  params: Promise<{
    streamId: string
    locale: Locale
  }>
}

export default async function Page(props: Props) {
  const params = await props.params
  const { user } = await getCurrentUser()

  if (!user) {
    return redirect({
      href: '/',
      locale: params.locale,
    })
  }

  const t = await getTranslations({
    locale: routing.locales.includes(params.locale)
      ? params.locale
      : routing.defaultLocale,
    namespace: 'lib.assistants.assistantConfigs',
  })

  const streamConfig = findStreamConfig({
    t,
    streamId: params.streamId,
  })

  if (!streamConfig) {
    return <StreamNotFound />
  }

  return (
    <Content
      streamId={streamConfig.id}
      backgroundColor={streamConfig.backgroundColor}
    />
  )
}
