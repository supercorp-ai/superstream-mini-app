'use client'
import { useEffect } from 'react'
import { usePostHog } from 'posthog-js/react'
import type { User } from 'next-auth'

export const PostHogIdentify = ({ user }: { user: User }) => {
  const posthog = usePostHog()

  useEffect(() => {
    if (!user) return
    if (!posthog) return

    posthog.identify(user.id, {
      address: user.address,
    })
  }, [posthog, user])

  return null
}
