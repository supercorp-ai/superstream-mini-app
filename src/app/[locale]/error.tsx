'use client'

import posthog from 'posthog-js'
import { useEffect } from 'react'
import { FullScreenError } from '@/components/errors/FullScreenError'

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

  return <FullScreenError reset={reset} />
}
