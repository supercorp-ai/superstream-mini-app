import { NextResponse, NextRequest } from 'next/server'
import pMap from 'p-map'
import { prisma } from '@/lib/prisma'
import { cacheHeaders } from '@/lib/cache/cacheHeaders'
import { getWorldcoinUser } from '@/lib/worldcoin/getWorldcoinUser'
import dayjs from 'dayjs'

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

  const getUsername = async ({
    comment,
  }: {
    comment: (typeof comments)[0]
  }) => {
    if (!comment.user?.address) {
      return 'Unknown'
    }

    if (worldcoinUserCache.has(comment.user.address)) {
      return worldcoinUserCache.get(comment.user.address)!.username
    } else {
      const { worldcoinUser } = await getWorldcoinUser({
        address: comment.user.address,
      })

      worldcoinUserCache.set(comment.user.address, {
        username: worldcoinUser.username,
      })

      return worldcoinUser.username
    }
  }

  return NextResponse.json(
    {
      comments: await pMap(comments, async (comment) => ({
        createdAt: comment.createdAt,
        username: await getUsername({ comment }),
        content: comment.content,
      })),
    },
    { headers: cacheHeaders },
  )
}
