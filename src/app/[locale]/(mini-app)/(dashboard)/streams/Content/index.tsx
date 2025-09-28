'use client'

import { useRef, useEffect } from 'react'
import { useRouter } from '@/i18n/navigation'
import { FullPageSpinner } from '@/components/spinners/FullPageSpinner'
import { useStreamConfigs } from '@/hooks/streams/useStreamConfigs'

export function Content() {
  const router = useRouter()
  const { streamConfigs } = useStreamConfigs()
  const hasCalled = useRef(false)
  const defaultStreamId = streamConfigs[0]?.id

  useEffect(() => {
    if (hasCalled.current) return
    if (!defaultStreamId) return
    hasCalled.current = true
    ;(async () => {
      router.push(`/streams/${defaultStreamId}`)
    })()
  }, [defaultStreamId, router])

  return <FullPageSpinner />
}
