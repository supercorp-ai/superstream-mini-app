import type { Locale } from 'next-intl'
import { redirect } from '@/i18n/navigation'
import { getCurrentUser } from '@/lib/users/getCurrentUser'
import { Content } from './Content'
import { prisma } from '@/lib/prisma'
import { boardySuperinterfaceAssistantId } from '@/lib/assistants/assistantConfigs'

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
      href: '/streams',
      locale: params.locale,
    })
  }

  return <Content />
}
