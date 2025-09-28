'use server'

import type { User } from '@prisma/client'
import { z } from 'zod'
import { authActionClient } from '@/lib/safeActions'
import { prisma } from '@/lib/prisma'
import { getUnclaimedSupertokensCount as baseGetUnclaimedSupertokensCount } from '@/lib/supertokens/getUnclaimedSupertokensCount'
import dayjs from 'dayjs'

const schema = z.object({})

const shouldIncrement = ({
  prismaUser,
  now,
}: {
  prismaUser: User
  now: Date
}) => {
  if (!prismaUser.streamedMinutesCountLastUpdated) {
    return true
  }

  return (
    dayjs(now).diff(
      dayjs(prismaUser.streamedMinutesCountLastUpdated),
      'minute',
    ) >= 1
  )
}

export const getUnclaimedSupertokensCount = authActionClient
  .schema(schema)
  .action(async ({ ctx }: any) => {
    const now = new Date()

    const prismaUser = await prisma.user.findUnique({
      where: { id: ctx.user.id },
    })

    if (!prismaUser) {
      throw new Error('User not found')
    }

    if (shouldIncrement({ prismaUser, now })) {
      await prisma.user.update({
        where: { id: prismaUser.id },
        data: {
          streamedMinutesCount: { increment: 1 },
          streamedMinutesCountLastUpdated: now,
        },
      })
    }

    const unclaimedSupertokensCount = await baseGetUnclaimedSupertokensCount({
      userId: ctx.user.id,
    })

    return {
      unclaimedSupertokensCount,
    }
  })
