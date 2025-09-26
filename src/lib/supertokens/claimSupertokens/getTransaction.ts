'use server'
import { verifyCloudProof } from '@worldcoin/minikit-js'
import { authActionClient } from '@/lib/safeActions'
import { ValidationError } from '@/lib/errors'
import { z } from 'zod'
import { defineChain } from 'thirdweb/chains'
import { signTypedData } from 'thirdweb/utils'
import { toHex, parseUnits } from 'viem'
import { NATIVE_TOKEN_ADDRESS } from 'thirdweb'
import type { Hex } from 'viem'
import { supertokenContractAddress } from '@/lib/addresses/supertokenContractAddress'
import crypto from 'crypto'
import dayjs from 'dayjs'
import Supertoken from '@/abis/Supertoken.json'
import { getUnclaimedSupertokensCount } from '@/lib/supertokens/getUnclaimedSupertokensCount'
import { prisma } from '@/lib/prisma'
import { SupertokenClaimStatus } from '@prisma/client'

const schema = z.object({
  verifyPayload: z.any(),
})

export const getTransaction = authActionClient
  .schema(schema)
  .action(
    async ({
      parsedInput: { verifyPayload },
      ctx: { user },
    }: {
      parsedInput: z.infer<typeof schema>
      ctx: any
    }) => {
      const verifyResult = await verifyCloudProof(
        verifyPayload,
        process.env.NEXT_PUBLIC_MINIKIT_APP_ID as `app_${string}`,
        'supertokens-claim',
      )

      if (!verifyResult.success) {
        throw new ValidationError('Verification failed')
      }

      let claim = await prisma.supertokenClaim.findFirst({
        where: {
          userId: user.id,
          status: SupertokenClaimStatus.PENDING,
        },
      })

      if (!claim) {
        const unclaimedSupertokensCount = await getUnclaimedSupertokensCount({
          userId: user.id,
        })

        if (unclaimedSupertokensCount <= 0) {
          throw new ValidationError('No unclaimed Supertokens')
        }

        claim = await prisma.supertokenClaim.create({
          data: {
            userId: user.id,
            uid: crypto.randomUUID(),
            quantity: unclaimedSupertokensCount,
          },
        })
      }

      const chain = defineChain(480)

      const mintRequestType = [
        { name: 'to', type: 'address' },
        { name: 'primarySaleRecipient', type: 'address' },
        { name: 'quantity', type: 'uint256' },
        { name: 'price', type: 'uint256' },
        { name: 'currency', type: 'address' },
        { name: 'validityStartTimestamp', type: 'uint128' },
        { name: 'validityEndTimestamp', type: 'uint128' },
        { name: 'uid', type: 'bytes32' },
      ]

      const domain = {
        name: 'SignatureMintERC20',
        version: '1',
        chainId: chain.id,
        verifyingContract: supertokenContractAddress,
      }

      const types = {
        MintRequest: mintRequestType,
      }

      const value = {
        to: user.address,
        primarySaleRecipient: '0xbF3d45e7c340a4e125FA4F21B7f730E63FCeD7Ba',
        quantity: parseUnits(`${claim.quantity}`, 18),
        price: BigInt(0),
        currency: NATIVE_TOKEN_ADDRESS,
        validityStartTimestamp: BigInt(dayjs().subtract(1, 'hour').unix()),
        validityEndTimestamp: BigInt(dayjs().add(1, 'hour').unix()),
        uid: toHex(claim.uid.replace(/-/g, ''), { size: 32 }),
      }

      const signature = signTypedData({
        domain,
        types,
        primaryType: 'MintRequest',
        message: value,
        privateKey: process.env.THIRDWEB_WALLET_PRIVATE_KEY as Hex,
      })

      return {
        transaction: [
          {
            address: supertokenContractAddress,
            abi: Supertoken,
            functionName: 'mintWithSignature',
            args: [value, signature],
          },
        ],
      }
    },
  )
