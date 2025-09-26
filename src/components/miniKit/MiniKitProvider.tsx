'use client'

import { MiniKit } from '@worldcoin/minikit-js'
import { ReactNode, useEffect, createContext, useState } from 'react'

const MiniKitInstalledContext = createContext({
  isMiniKitInstalled: false,
})

export const MiniKitProvider = ({ children }: { children: ReactNode }) => {
  const [isMiniKitInstalled, setIsMiniKitInstalled] = useState(false)
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (isDone) return

    setIsDone(true)

    try {
      MiniKit.install(process.env.NEXT_PUBLIC_MINIKIT_APP_ID)
      const result = MiniKit.isInstalled()
      setIsMiniKitInstalled(result)
    } catch (error) {
      console.log(error)
    }
  }, [isDone])

  return (
    <MiniKitInstalledContext.Provider value={{ isMiniKitInstalled }}>
      {children}
    </MiniKitInstalledContext.Provider>
  )
}
