'use client'

import posthog from 'posthog-js'
import { useEffect } from 'react'
import { FullScreenError } from '@/components/errors/FullScreenError'
import { Inter, Roboto_Mono } from 'next/font/google'
import { Theme } from '@radix-ui/themes'
import '@/lib/styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  // TODO unclear why this does not work
  // display: 'swap',
  variable: '--font-inter',
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  // TODO unclear why this does not work
  // display: 'swap',
  variable: '--font-roboto-mono',
})

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    posthog.captureException(error)
  }, [error])

  return (
    <html lang="en">
      <body className={`${inter.variable} ${robotoMono.variable}`}>
        <Theme
          radius="large"
          accentColor="violet"
          scaling="110%"
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <FullScreenError reset={reset} />
        </Theme>
      </body>
    </html>
  )
}
