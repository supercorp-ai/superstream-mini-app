'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safeActions'
import { prisma } from '@/lib/prisma'
import { getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { findStreamConfig, streamConfigs } from '@/lib/streams/streamConfigs'
import { ValidationError } from '@/lib/errors'

const MESSAGE_LIMIT = 20

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

const serializeMessage = (message: {
  id: string
  content: string
  createdAt: Date
  user: {
    id: string
    name: string | null
    address: string
  }
}) => ({
  id: message.id,
  content: message.content,
  createdAt: message.createdAt.toISOString(),
  user: {
    id: message.user.id,
    name: message.user.name,
    address: message.user.address,
  },
})

const streamIdSchema = z.object({
  streamId: z.string().uuid('Invalid stream identifier'),
})

const createMessageSchema = streamIdSchema.extend({
  content: z
    .string()
    .trim()
    .min(1, 'Message cannot be empty')
    .max(140, 'Message is too long'),
})

export const listStreamMessages = authActionClient
  .schema(streamIdSchema)
  .action(async ({ parsedInput: { streamId } }) => {
    const streamConfig = await resolveStreamConfig(streamId)

    if (!streamConfig || streamConfig.id !== streamId) {
      throw new ValidationError('Stream not found')
    }

    await ensureStreamExists(streamConfig.id)

    const messages = await prisma.message.findMany({
      where: { streamId: streamConfig.id },
      orderBy: { createdAt: 'desc' },
      take: MESSAGE_LIMIT,
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
      messages: messages.map(serializeMessage).reverse(),
    }
  })

export const createStreamMessage = authActionClient
  .schema(createMessageSchema)
  .action(async ({ parsedInput: { streamId, content }, ctx }) => {
    const { user } = ctx as { user: { id?: string } }

    const streamConfig = await resolveStreamConfig(streamId)

    if (!streamConfig || streamConfig.id !== streamId) {
      throw new ValidationError('Stream not found')
    }

    await ensureStreamExists(streamConfig.id)

    const message = await prisma.message.create({
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
      message: serializeMessage(message),
    }
  })
