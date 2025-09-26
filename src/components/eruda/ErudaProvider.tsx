'use client'

import dynamic from 'next/dynamic'
import { ReactNode } from 'react'

const Eruda = dynamic(() => import('./Eruda').then((c) => c.Eruda), {
  ssr: false,
})

export const ErudaProvider = (props: { children: ReactNode }) => (
  <Eruda>{props.children}</Eruda>
)
