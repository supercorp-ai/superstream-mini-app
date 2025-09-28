'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safeActions'
import { prisma } from '@/lib/prisma'
import { getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { findStreamConfig, streamConfigs } from '@/lib/streams/streamConfigs'
import { ValidationError } from '@/lib/errors'
import { verifyCloudProof } from '@worldcoin/minikit-js'

const COMMENT_LIMIT = 20

const resolveStreamConfig = async (streamId: string) => {
  const t = await getTranslations({
    locale: routing.defaultLocale,
    namespace: 'lib.assistants.assistantConfigs',
  })

  return (
    findStreamConfig({
      t,
      streamId,
    }) ?? streamConfigs({ t })[0]
  )
}

const ensureStreamExists = async (streamId: string) => {
  await prisma.stream.upsert({
    where: { id: streamId },
    update: {},
    create: { id: streamId },
  })
}

const serializeComment = (comment: {
  id: string
  content: string
  createdAt: Date
  user: {
    id: string
    name: string | null
    address: string
  }
}) => ({
  id: comment.id,
  content: comment.content,
  createdAt: comment.createdAt.toISOString(),
  user: {
    id: comment.user.id,
    name: comment.user.name,
    address: comment.user.address,
  },
})

const streamIdSchema = z.object({
  streamId: z.string().uuid('Invalid stream identifier'),
})

const createCommentSchema = streamIdSchema.extend({
  content: z
    .string()
    .trim()
    .min(1, 'Comment cannot be empty')
    .max(140, 'Comment is too long'),
  verifyPayload: z.any(),
})

export const listStreamComments = authActionClient
  .schema(streamIdSchema)
  .action(async ({ parsedInput: { streamId } }) => {
    const streamConfig = await resolveStreamConfig(streamId)

    if (!streamConfig || streamConfig.id !== streamId) {
      throw new ValidationError('Stream not found')
    }

    await ensureStreamExists(streamConfig.id)

    const comments = await prisma.comment.findMany({
      where: { streamId: streamConfig.id },
      orderBy: { createdAt: 'desc' },
      take: COMMENT_LIMIT,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
      },
    })

    return {
      comments: comments.map(serializeComment).reverse(),
    }
  })

export const createStreamComment = authActionClient
  .schema(createCommentSchema)
  .action(
    async ({ parsedInput: { streamId, content, verifyPayload }, ctx }) => {
      const verifyResult = await verifyCloudProof(
        verifyPayload,
        process.env.NEXT_PUBLIC_MINIKIT_APP_ID as `app_${string}`,
        'create-comment',
      )

      if (!verifyResult.success) {
        throw new ValidationError('Verification failed')
      }

      const { user } = ctx as { user: { id?: string } }

      const streamConfig = await resolveStreamConfig(streamId)

      if (!streamConfig || streamConfig.id !== streamId) {
        throw new ValidationError('Stream not found')
      }

      await ensureStreamExists(streamConfig.id)

      const comment = await prisma.comment.create({
        data: {
          content,
          streamId: streamConfig.id,
          userId: user.id!,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              address: true,
            },
          },
        },
      })

      return {
        comment: serializeComment(comment),
      }
    },
  )
