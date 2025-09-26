'use client'
import { useEffect } from 'react'
import posthog from 'posthog-js'
import { PostHogProvider as ExternalPostHogProvider } from 'posthog-js/react'

export const PostHogProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  useEffect(() => {
    if (
      !process.env.NEXT_PUBLIC_POSTHOG_KEY ||
      !process.env.NEXT_PUBLIC_POSTHOG_HOST
    ) {
      console.warn('PostHog environment variables are not set.')
      return
    }

    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST!,
      person_profiles: 'identified_only',
      capture_pageview: false,
    })
  }, [])

  return (
    <ExternalPostHogProvider client={posthog}>
      {children}
    </ExternalPostHogProvider>
  )
}
