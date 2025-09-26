import type { Locale } from 'next-intl'
import { redirect } from '@/i18n/navigation'
import { prisma } from '@/lib/prisma'
import { Layout } from '@/components/layouts/Layout'
import { WorldcoinUserNotFound } from '@/components/worldcoinUsers/WorldcoinUserNotFound'
import { getWorldcoinUser } from '@/lib/worldcoin/getWorldcoinUser'
import { Content } from './Content'
import { createThirdwebClient } from 'thirdweb'
import { getWalletBalance } from 'thirdweb/wallets'
import { supertokenContractAddress } from '@/lib/addresses/supertokenContractAddress'
import { defineChain } from 'thirdweb/chains'
import { getUnclaimedSupertokensCount } from '@/lib/supertokens/getUnclaimedSupertokensCount'
import { getCurrentUser } from '@/lib/users/getCurrentUser'

type Props = {
  params: Promise<{
    locale: Locale
  }>
}

export const dynamic = 'force-dynamic'

export default async function Page(props: Props) {
  const params = await props.params

  const { user } = await getCurrentUser()

  if (!user) {
    return redirect({
      href: '/',
      locale: params.locale,
    })
  }

  const { worldcoinUser } = await getWorldcoinUser({
    address: user.address,
  })

  if (!worldcoinUser) {
    return <WorldcoinUserNotFound />
  }

  const unclaimedSupertokensCount = await getUnclaimedSupertokensCount({
    userId: user.id!,
  })

  const pendingClaim = await prisma.supertokenClaim.findFirst({
    where: {
      userId: user.id!,
      status: 'PENDING',
    },
    select: {
      quantity: true,
    },
  })

  const pendingClaimQuantity = pendingClaim?.quantity ?? 0

  const chain = defineChain(480)
  const client = createThirdwebClient({
    secretKey: process.env.THIRDWEB_SECRET_KEY!,
  })

  const balanceResult = await getWalletBalance({
    address: user.address,
    client,
    chain,
    tokenAddress: supertokenContractAddress,
  })

  const balance = balanceResult.displayValue

  return (
    <Layout.Root>
      <Layout.Header
        worldcoinUser={worldcoinUser}
        showStreamsLink
      />
      <Layout.Content.Root>
        <Content
          unclaimedSupertokensCount={unclaimedSupertokensCount}
          pendingClaimQuantity={pendingClaimQuantity}
          balance={balance}
        />
      </Layout.Content.Root>
    </Layout.Root>
  )
}
