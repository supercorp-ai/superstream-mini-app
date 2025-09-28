import { redirect } from '@/i18n/navigation'
import type { Locale } from 'next-intl'
import { PostHogIdentify } from '@/components/posthog/PostHogIdentify'
import { getCurrentUser } from '@/lib/users/getCurrentUser'

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{
    locale: string
  }>
  children: React.ReactNode
}) {
  const { locale } = await params
  const { user } = await getCurrentUser()

  if (!user) {
    return redirect({
      href: '/',
      locale: locale as Locale,
    })
  }

  return (
    <>
      <PostHogIdentify user={user} />
      {children}
    </>
  )
}
