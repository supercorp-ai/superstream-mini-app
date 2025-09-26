'use client'

import eruda from 'eruda'
// @ts-expect-error - eruda-code is not typed
import erudaCode from 'eruda-code'
import { ReactNode, useEffect } from 'react'

export const Eruda = (props: { children: ReactNode }) => {
  useEffect(() => {
    ;(async () => {
      if (
        typeof window !== 'undefined' &&
        process.env.NODE_ENV !== 'production'
        // (true || process.env.NODE_ENV !== 'production')
      ) {
        try {
          eruda.init()
          eruda.add(erudaCode)
        } catch (error) {
          console.log('Eruda failed to initialize', error)
        }
      }
    })()
  }, [])

  return <>{props.children}</>
}
