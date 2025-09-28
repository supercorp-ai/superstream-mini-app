'use client'

import { useState, useMemo } from 'react'
import { Box, Button, Flex, Spinner, Text } from '@radix-ui/themes'
import { useFormatter } from 'next-intl'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const messagesQueryKey = (streamId: string) => ['streams', streamId, 'messages']

const getRandomInterval = () => 10000 + Math.floor(Math.random() * 10000)

import {
  createStreamMessage,
  listStreamMessages,
} from '@/lib/streams/messages/actions'

const fetchMessages = async ({ streamId }: { streamId: string }) => {
  const result = await listStreamMessages({ streamId })

  if (!result?.data) {
    throw new Error(result?.serverError ?? 'Failed to fetch messages')
  }

  return result.data.messages as MessagePayload[]
}

const sendMessage = async ({
  streamId,
  content,
}: {
  streamId: string
  content: string
}) => {
  const result = await createStreamMessage({ streamId, content })

  if (!result?.data) {
    throw new Error(result?.serverError ?? 'Failed to send message')
  }

  return result.data.message as MessagePayload
}

const MAX_LENGTH = 2000

export type MessagePayload = {
  id: string
  content: string
  createdAt: string
  user: {
    id: string
    name: string | null
    address: string
  }
}

export const StreamMessages = ({ streamId }: { streamId: string }) => {
  const format = useFormatter()
  const queryClient = useQueryClient()
  const [message, setMessage] = useState('')

  const query = useQuery({
    queryKey: messagesQueryKey(streamId),
    queryFn: () => fetchMessages({ streamId }),
    refetchInterval: () => getRandomInterval(),
    retry: 3,
    retryDelay: (attempt) => Math.min(1500 * 2 ** attempt, 15000),
  })

  const mutation = useMutation({
    mutationFn: ({ content }: { content: string }) =>
      sendMessage({ streamId, content }),
    onSuccess: () => {
      setMessage('')
      queryClient.invalidateQueries({ queryKey: messagesQueryKey(streamId) })
    },
  })

  const isSubmitDisabled = mutation.isPending || message.trim().length === 0

  const remaining = useMemo(() => MAX_LENGTH - message.length, [message.length])

  return (
    <Flex
      direction="column"
      gap="4"
      mt="6"
    >
      <Box
        style={{
          borderRadius: 'var(--radius-4)',
          border: '1px solid var(--gray-a6)',
          backgroundColor: 'white',
          padding: 'var(--space-4)',
          minHeight: 200,
        }}
      >
        {query.isLoading ? (
          <Flex
            align="center"
            justify="center"
            style={{ minHeight: 120 }}
          >
            <Spinner />
          </Flex>
        ) : query.isError ? (
          <Text color="red">Unable to load recent messages.</Text>
        ) : query.data?.length ? (
          <Flex
            direction="column"
            gap="3"
          >
            {query.data.map((item) => {
              const formattedTime = format.dateTime(new Date(item.createdAt), {
                hour: 'numeric',
                minute: '2-digit',
                second: '2-digit',
              })

              return (
                <Box
                  key={item.id}
                  style={{
                    padding: 'var(--space-3)',
                    borderRadius: 'var(--radius-3)',
                    backgroundColor: 'var(--gray-a2)',
                  }}
                >
                  <Flex
                    justify="between"
                    align="center"
                    mb="1"
                  >
                    <Text
                      size="2"
                      weight="medium"
                    >
                      {item.user.name ?? item.user.address}
                    </Text>
                    <Text
                      size="1"
                      color="gray"
                    >
                      {formattedTime}
                    </Text>
                  </Flex>

                  <Text size="2">{item.content}</Text>
                </Box>
              )
            })}
          </Flex>
        ) : (
          <Text color="gray">No messages yet. Start the conversation.</Text>
        )}
      </Box>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          if (isSubmitDisabled) return
          mutation.mutate({ content: message.trim() })
        }}
      >
        <Flex
          direction="column"
          gap="2"
        >
          <Box
            asChild
            style={{
              borderRadius: 'var(--radius-3)',
              border: '1px solid var(--gray-a6)',
              backgroundColor: 'white',
              overflow: 'hidden',
            }}
          >
            <textarea
              value={message}
              onChange={(event) => {
                const nextValue = event.target.value
                if (nextValue.length <= MAX_LENGTH) {
                  setMessage(nextValue)
                }
              }}
              placeholder="Share an update with everyone"
              rows={3}
              style={{
                width: '100%',
                padding: 'var(--space-3)',
                resize: 'none',
                border: 'none',
                outline: 'none',
                background: 'transparent',
              }}
            />
          </Box>

          <Flex
            justify="between"
            align="center"
          >
            <Text
              size="1"
              color="gray"
            >
              {remaining} characters left
            </Text>

            <Button
              type="submit"
              loading={mutation.isPending}
              disabled={isSubmitDisabled}
            >
              Send
            </Button>
          </Flex>

          {mutation.isError ? (
            <Text color="red">{mutation.error?.message}</Text>
          ) : null}
        </Flex>
      </form>
    </Flex>
  )
}
