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
    },
  })

  if (!user) {
    throw new Error('User not found')
  }

  return 100 - user.claimedSupertokensCount
}
