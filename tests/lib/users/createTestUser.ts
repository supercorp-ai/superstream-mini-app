import { Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { prisma } from '@/lib/prisma'

export const createTestUser = async (
  args: Omit<Prisma.UserCreateArgs, 'data'> & {
    data?: Partial<Prisma.UserCreateArgs['data']>
  } = {},
) => {
  return prisma.user.create({
    ...args,
    data: {
      id: randomUUID(),
      address: '0xabc',
      ...(args.data ?? {}),
    },
  })
}
