import { Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { prisma } from '@/lib/prisma'

export const createTestSupertokenClaim = async (
  args: Omit<Prisma.SupertokenClaimCreateArgs, 'data'> & {
    data: Partial<Prisma.SupertokenClaimCreateArgs['data']> & { userId: string }
  },
) => {
  if (!args.data.userId) {
    throw new Error('userId is required')
  }
  return prisma.supertokenClaim.create({
    ...args,
    data: {
      id: randomUUID(),
      uid: randomUUID(),
      quantity: 1,
      ...(args.data ?? {}),
    },
  })
}
