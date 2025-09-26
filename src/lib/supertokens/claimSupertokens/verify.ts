'use server'
import { authActionClient } from '@/lib/safeActions'
import { z } from 'zod'
import { MiniAppPaymentSuccessPayload } from '@worldcoin/minikit-js'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { SupertokenClaimStatus } from '@prisma/client'

const schema = z.object({
  finalPayload: z.any(),
})

export const verify = authActionClient
  .schema(schema)
  .action(
    async ({ parsedInput, ctx: { user } }: { parsedInput: any; ctx: any }) => {
      const claim = await prisma.supertokenClaim.findFirst({
        where: {
          userId: user.id,
          status: SupertokenClaimStatus.PENDING,
        },
      })

      if (!claim) {
        // Nothing to verify
        return { success: true }
      }

      const finalPayload =
        parsedInput.finalPayload as MiniAppPaymentSuccessPayload
      console.log({ finalPayload })
      const response = await fetch(
        `https://developer.worldcoin.org/api/v2/minikit/transaction/${finalPayload.transaction_id}?app_id=${process.env.NEXT_PUBLIC_MINIKIT_APP_ID}&type=transaction`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.DEV_PORTAL_API_KEY}`,
          },
        },
      )

      const transaction = await response.json()

      console.dir(
        {
          transaction,
        },
        {
          depth: null,
        },
      )

      // if (transaction.transactionStatus !== 'pending') {
      // console.error('Transaction failed')
      await new Promise((resolve) => setTimeout(resolve, 15000))
      // throw new Error('Transaction failed')
      // }

      await prisma.$transaction([
        prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            claimedSupertokensCount: {
              increment: claim.quantity,
            },
          },
        }),
        prisma.supertokenClaim.update({
          where: { id: claim.id },
          data: { status: SupertokenClaimStatus.COMPLETED },
        }),
      ])

      revalidatePath('/', 'layout')

      return { success: true }
    },
  )
