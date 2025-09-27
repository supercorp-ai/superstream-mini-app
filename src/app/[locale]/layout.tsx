import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { routing } from '@/i18n/routing'
import { Suspense } from 'react'
import { Inter } from 'next/font/google'
import '@/lib/styles/globals.css'
import { Theme } from '@radix-ui/themes'
import { Analytics } from '@vercel/analytics/react'
import { PostHogProvider } from '@/components/posthog/PostHogProvider'
import PostHogPageView from '@/components/posthog/PostHogPageView'
import { getTranslations } from 'next-intl/server'
import { ToastsProvider } from '@/components/toasts/ToastsProvider'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  const t = await getTranslations({
    locale: hasLocale(routing.locales, locale) ? locale : routing.defaultLocale,
    namespace: 'app.layout.metadata',
  })

  return {
    title: 'Superstream',
    description: t('description'),
  }
}

export default async function Layout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  return (
    <html
      className={`${inter.variable}`}
      lang={locale}
    >
      <body>
        <NextIntlClientProvider>
          <Theme
            radius="large"
            accentColor="red"
            scaling="110%"
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <ToastsProvider>
              <PostHogProvider>
                {children}

                <Analytics />
                <Suspense fallback={null}>
                  <PostHogPageView />
                </Suspense>
              </PostHogProvider>
            </ToastsProvider>
          </Theme>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
