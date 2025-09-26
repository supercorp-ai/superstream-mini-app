import { Content } from './Content'
import { getCurrentUser } from '@/lib/users/getCurrentUser'
import { StreamNotFound } from '@/components/streams/StreamNotFound'
import { redirect } from '@/i18n/navigation'
import type { Locale } from 'next-intl'

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

  if (params.streamId !== 'lista') {
    return <StreamNotFound />
  }

  return <Content />
}
