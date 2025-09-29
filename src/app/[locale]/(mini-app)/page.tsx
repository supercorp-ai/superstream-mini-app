import type { Locale } from 'next-intl'
import { redirect } from '@/i18n/navigation'
import { getCurrentUser } from '@/lib/users/getCurrentUser'
import { Content } from './Content'
import { adamStreamId } from '@/lib/streams/streamConfigs'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{
    locale: Locale
  }>
}

export default async function Page(props: Props) {
  const params = await props.params
  const { user } = await getCurrentUser()

  if (user) {
    return redirect({
      href: `/streams/${adamStreamId}`,
      locale: params.locale,
    })
  }

  return <Content />
}
