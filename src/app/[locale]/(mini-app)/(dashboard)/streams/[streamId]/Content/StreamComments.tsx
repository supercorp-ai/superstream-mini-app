'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Card,
  Flex,
  IconButton,
  Spinner,
  Text,
} from '@radix-ui/themes'
import { Cross2Icon, Pencil1Icon } from '@radix-ui/react-icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createStreamComment,
  listStreamComments,
} from '@/lib/streams/comments/actions'

const MAX_LENGTH = 140
const commentsQueryKey = (streamId: string) => ['streams', streamId, 'comments']
const getRandomInterval = () => 10000 + Math.floor(Math.random() * 10000)

export type CommentPayload = {
  id: string
  content: string
  createdAt: string
  user: {
    id: string
    name: string | null
    address: string
  }
}

type UsernameResponse = {
  username: string
  address: string
  profile_picture_url?: string
  minimized_profile_picture_url?: string
}

const fetchComments = async ({ streamId }: { streamId: string }) => {
  const result = await listStreamComments({ streamId })

  if (!result?.data) {
    throw new Error(result?.serverError ?? 'Failed to fetch comments')
  }

  return result.data.comments as CommentPayload[]
}

const fetchUsernames = async (addresses: string[]) => {
  if (addresses.length === 0) return [] as UsernameResponse[]

  const response = await fetch('https://usernames.worldcoin.org/api/v1/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ addresses }),
  })

  if (!response.ok) {
    throw new Error('Failed to load usernames')
  }

  return (await response.json()) as UsernameResponse[]
}

const sendComment = async ({
  streamId,
  content,
}: {
  streamId: string
  content: string
}) => {
  const result = await createStreamComment({ streamId, content })

  if (!result?.data) {
    throw new Error(result?.serverError ?? 'Failed to send comment')
  }

  return result.data.comment as CommentPayload
}

const truncateAddress = (address: string) =>
  address.length > 10 ? `${address.slice(0, 6)}…${address.slice(-4)}` : address

export const StreamComments = ({ streamId }: { streamId: string }) => {
  const queryClient = useQueryClient()
  const [comment, setComment] = useState('')
  const [isComposerOpen, setIsComposerOpen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!isComposerOpen) return
    const timeout = window.setTimeout(() => textareaRef.current?.focus(), 20)
    return () => window.clearTimeout(timeout)
  }, [isComposerOpen])

  const commentsQuery = useQuery({
    queryKey: commentsQueryKey(streamId),
    queryFn: () => fetchComments({ streamId }),
    refetchInterval: () => getRandomInterval(),
    retry: 3,
    retryDelay: (attempt) => Math.min(1500 * 2 ** attempt, 15000),
    staleTime: 10000,
  })

  const mutation = useMutation({
    mutationFn: ({ content }: { content: string }) =>
      sendComment({ streamId, content }),
    onSuccess: () => {
      setComment('')
      queryClient.invalidateQueries({ queryKey: commentsQueryKey(streamId) })
    },
  })

  const participantAddresses = useMemo(() => {
    if (!commentsQuery.data) return [] as string[]
    return Array.from(
      new Set(
        commentsQuery.data.map((item) => item.user.address.toLowerCase()),
      ),
    )
  }, [commentsQuery.data])

  const usernamesQuery = useQuery({
    queryKey: ['usernames', participantAddresses.sort().join(',')],
    queryFn: () => fetchUsernames(participantAddresses),
    enabled: participantAddresses.length > 0,
    staleTime: 60_000,
  })

  const usernameMap = useMemo(() => {
    if (!usernamesQuery.data) return new Map<string, UsernameResponse>()
    return new Map(
      usernamesQuery.data.map((item) => [item.address.toLowerCase(), item]),
    )
  }, [usernamesQuery.data])

  const isOverLimit = comment.length > MAX_LENGTH
  const trimmedComment = comment.trim()
  const isSubmitDisabled =
    mutation.isPending || trimmedComment.length === 0 || isOverLimit

  return (
    <Flex
      position="absolute"
      inset="0"
      direction="column"
      justify="end"
      style={{ pointerEvents: 'none', zIndex: 2 }}
    >
      <Flex
        direction="column"
        justify="end"
        gap="var(--space-3)"
        style={{
          pointerEvents: 'none',
          width: '100%',
          padding: 'var(--space-4)',
          paddingBottom: 'var(--space-3)',
        }}
      >
        <Box
          style={{
            position: 'relative',
            pointerEvents: 'none',
            maxHeight: '240px',
            overflow: 'hidden',
          }}
        >
          {!isComposerOpen && (
            <Box
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to top, rgba(18,18,18,0.85) 0%, rgba(18,18,18,0.45) 45%, rgba(18,18,18,0.12) 70%, rgba(18,18,18,0) 100%)',
                pointerEvents: 'none',
              }}
            />
          )}

          <Flex
            direction="column"
            gap="2"
            style={{
              position: 'relative',
              zIndex: 1,
              maskImage:
                'linear-gradient(to top, rgba(0,0,0,1) 65%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage:
                'linear-gradient(to top, rgba(0,0,0,1) 65%, rgba(0,0,0,0) 100%)',
              pointerEvents: 'none',
            }}
          >
            {commentsQuery.isLoading ? (
              <Flex
                align="center"
                justify="center"
                style={{ minHeight: 64 }}
              >
                <Spinner />
              </Flex>
            ) : commentsQuery.isError ? (
              <Text color="red">Unable to load recent comments.</Text>
            ) : commentsQuery.data && commentsQuery.data.length > 0 ? (
              commentsQuery.data.map((item) => {
                const lookup = usernameMap.get(item.user.address.toLowerCase())
                const displayName =
                  lookup?.username ??
                  item.user.name ??
                  truncateAddress(item.user.address)
                const avatarSrc =
                  lookup?.minimized_profile_picture_url ??
                  lookup?.profile_picture_url ??
                  undefined

                return (
                  <Flex
                    key={item.id}
                    align="start"
                    gap="2"
                    style={{
                      alignSelf: 'flex-start',
                      pointerEvents: 'none',
                      maxWidth: '80%',
                      flexShrink: 0,
                    }}
                  >
                    <Avatar
                      size="1"
                      src={avatarSrc}
                      radius="full"
                      fallback={displayName[0]?.toUpperCase() ?? 'U'}
                      style={{
                        width: 'var(--space-4)',
                        height: 'var(--space-4)',
                        minWidth: 'var(--space-4)',
                        flexShrink: 0,
                        marginTop: 'var(--space-1)',
                        boxShadow: '0 0 6px rgba(0,0,0,0.4)',
                      }}
                    />

                    <Flex
                      direction="column"
                      gap="1"
                      style={{
                        flex: 1,
                        minWidth: 0,
                        color: 'white',
                        textShadow: '0 1px 3px rgba(0,0,0,0.9)',
                      }}
                    >
                      <Text
                        size="1"
                        weight="medium"
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {displayName}
                      </Text>
                      <Text
                        size="1"
                        style={{
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                        }}
                      >
                        {item.content}
                      </Text>
                    </Flex>
                  </Flex>
                )
              })
            ) : (
              <Text color="gray">No comments yet. Start the conversation.</Text>
            )}
          </Flex>
        </Box>

        <Box style={{ width: '100%', pointerEvents: 'auto' }}>
          {isComposerOpen ? (
            <form
              onSubmit={(event) => {
                event.preventDefault()
                if (isSubmitDisabled) return
                mutation.mutate({ content: trimmedComment })
              }}
            >
              <Card
                variant="surface"
                style={{
                  border: isOverLimit
                    ? '1px solid var(--red-9)'
                    : '1px solid var(--gray-a5)',
                  padding: 'var(--space-2) var(--space-3) var(--space-3)',
                  backgroundColor: 'white',
                  boxShadow: 'var(--shadow-4)',
                }}
              >
                <Flex
                  justify="end"
                  mb="1"
                >
                  <IconButton
                    size="1"
                    variant="ghost"
                    color="gray"
                    onClick={() => setIsComposerOpen(false)}
                    type="button"
                  >
                    <Cross2Icon />
                  </IconButton>
                </Flex>

                <Box
                  asChild
                  style={{
                    borderRadius: 'var(--radius-3)',
                    border: isOverLimit
                      ? '1px solid var(--red-9)'
                      : '1px solid transparent',
                    backgroundColor: 'var(--color-surface)',
                    overflow: 'hidden',
                  }}
                >
                  <textarea
                    ref={textareaRef}
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    placeholder="Type…"
                    rows={1}
                    style={{
                      width: '100%',
                      padding: 'var(--space-3)',
                      resize: 'none',
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      color: 'inherit',
                    }}
                  />
                </Box>

                {mutation.isError ? (
                  <Text
                    size="1"
                    color="red"
                    mt="2"
                  >
                    {mutation.error?.message}
                  </Text>
                ) : null}

                {isOverLimit ? (
                  <Text
                    size="1"
                    color="red"
                    mt="2"
                  >
                    Comment is too long (140 characters max).
                  </Text>
                ) : null}

                <Flex
                  justify="end"
                  mt="3"
                >
                  <Button
                    type="submit"
                    loading={mutation.isPending}
                    disabled={isSubmitDisabled}
                  >
                    Send
                  </Button>
                </Flex>
              </Card>
            </form>
          ) : (
            <Button
              variant="surface"
              color="gray"
              onClick={() => setIsComposerOpen(true)}
              style={{
                width: '100%',
                justifyContent: 'flex-start',
                pointerEvents: 'auto',
                gap: 'var(--space-2)',
                backgroundColor: 'white',
                boxShadow: 'var(--shadow-3)',
              }}
            >
              <Pencil1Icon />
              <Text size="1">Type…</Text>
            </Button>
          )}
        </Box>
      </Flex>
    </Flex>
  )
}
