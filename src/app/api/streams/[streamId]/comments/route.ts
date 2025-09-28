import { NextResponse, NextRequest } from 'next/server'
import type { User } from '@prisma/client'
import pMap from 'p-map'
import { prisma } from '@/lib/prisma'
import { cacheHeaders } from '@/lib/cache/cacheHeaders'
import { getWorldcoinUser } from '@/lib/worldcoin/getWorldcoinUser'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export const GET = async (
  _request: NextRequest,
  props: {
    params: Promise<{
      streamId: string
    }>
  },
) => {
  const params = await props.params

  const { streamId } = params

  const comments = await prisma.comment.findMany({
    where: {
      streamId,
      createdAt: {
        // last 5 minnutes
        gte: dayjs().subtract(5, 'minute').toDate(),
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: {
      user: true,
    },
  })

  const worldcoinUserCache = new Map<string, { username: string }>()

  const getUsername = async ({ user }: { user: User }) => {
    if (!user?.address) {
      return 'Unknown'
    }

    if (worldcoinUserCache.has(user.address)) {
      return worldcoinUserCache.get(user.address)!.username
    } else {
      const { worldcoinUser } = await getWorldcoinUser({
        address: user.address,
      })

      worldcoinUserCache.set(user.address, {
        username: worldcoinUser.username,
      })

      return worldcoinUser.username
    }
  }

  const viewersCount = await prisma.user.count({
    where: {
      streamedMinutesCountLastUpdated: {
        gte: dayjs().subtract(5, 'minute').toDate(),
      },
    },
  })

  const viewers = await prisma.user.findMany({
    where: {
      streamedMinutesCountLastUpdated: {
        gte: dayjs().subtract(5, 'minute').toDate(),
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
    take: 10,
  })

  const viewerUsernames = await pMap(viewers, (viewer) =>
    getUsername({ user: viewer }),
  )

  return NextResponse.json(
    {
      comments: await pMap(comments, async (comment) => ({
        username: await getUsername({ user: comment.user }),
        content: comment.content,
        createdAt: comment.createdAt,
        createdAtRelative: dayjs(comment.createdAt).fromNow(),
      })),
      viewersCount,
      viewerUsernames,
    },
    { headers: cacheHeaders },
  )
}
