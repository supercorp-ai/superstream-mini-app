'use client'

import posthog from 'posthog-js'
import { useEffect } from 'react'
import { FullScreenError } from '@/components/errors/FullScreenError'
import { Inter } from 'next/font/google'
import { Theme } from '@radix-ui/themes'
import '@/lib/styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export default function Error({
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
    <html
      className={`${inter.variable}`}
      lang="en"
    >
      <body>
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
