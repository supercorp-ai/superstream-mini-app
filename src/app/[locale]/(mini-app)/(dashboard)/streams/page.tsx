import { getCurrentUser } from '@/lib/users/getCurrentUser'
import type { Locale } from 'next-intl'
import { redirect } from '@/i18n/navigation'
import { Content } from './Content'

type Props = {
  params: Promise<{
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

  return <Content />
}
