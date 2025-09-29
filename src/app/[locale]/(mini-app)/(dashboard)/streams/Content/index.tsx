'use client'

import { useRef, useEffect } from 'react'
import { useRouter } from '@/i18n/navigation'
import { FullPageSpinner } from '@/components/spinners/FullPageSpinner'
import { adamStreamId } from '@/lib/streams/streamConfigs'

export function Content() {
  const router = useRouter()
  const hasCalled = useRef(false)

  useEffect(() => {
    if (hasCalled.current) return
    hasCalled.current = true
    ;(async () => {
      router.push(`/streams/${adamStreamId}`)
    })()
  }, [router])

  return <FullPageSpinner />
}
