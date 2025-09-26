'use client'

import { useRef, useEffect } from 'react'
import { useRouter } from '@/i18n/navigation'
import { FullPageSpinner } from '@/components/spinners/FullPageSpinner'

export function Content() {
  const router = useRouter()
  const hasCalled = useRef(false)

  useEffect(() => {
    if (hasCalled.current) return
    hasCalled.current = true
    ;(async () => {
      router.push(`/streams/lista`)
    })()
  }, [router])

  return <FullPageSpinner />
}
