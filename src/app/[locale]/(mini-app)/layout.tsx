import { MiniKitProvider } from '@/components/miniKit/MiniKitProvider'
import { ErudaProvider } from '@/components/eruda/ErudaProvider'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ErudaProvider>
      <MiniKitProvider>{children}</MiniKitProvider>
    </ErudaProvider>
  )
}
