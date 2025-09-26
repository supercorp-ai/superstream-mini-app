import { prisma } from '@/lib/prisma'

export const getUnclaimedSupertokensCount = async ({
  userId,
}: {
  userId: string
}) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      claimedSupertokensCount: true,
      _count: {
        select: {
          userMessageLogs: true,
        },
      },
    },
  })

  if (!user) {
    throw new Error('User not found')
  }

  return user._count.userMessageLogs - user.claimedSupertokensCount
}
