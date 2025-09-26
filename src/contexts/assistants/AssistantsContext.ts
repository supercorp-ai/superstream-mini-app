'use client'
import { createContext } from 'react'

export const AssistantsContext = createContext<{
  assistants: any[]
}>({
  assistants: [],
})
