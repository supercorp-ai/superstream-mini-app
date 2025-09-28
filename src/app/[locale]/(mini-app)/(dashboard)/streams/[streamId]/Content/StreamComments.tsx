'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Theme,
  Avatar,
  Box,
  Button,
  Card,
  Flex,
  IconButton,
  Text,
} from '@radix-ui/themes'
import { Cross2Icon } from '@radix-ui/react-icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createStreamComment,
  listStreamComments,
} from '@/lib/streams/comments/actions'
import { MiniKit, VerificationLevel } from '@worldcoin/minikit-js'

const MAX_LENGTH = 140
const MAX_VISIBLE_COMMENTS = 8
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

// API functions
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
    headers: { 'Content-Type': 'application/json' },
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
  const { finalPayload: verifyPayload } = await MiniKit.commandsAsync.verify({
    action: 'create-comment',
    verification_level: VerificationLevel.Orb,
  })

  if (verifyPayload.status !== 'success') {
    throw new Error('Verification failed')
  }

  const result = await createStreamComment({ streamId, content, verifyPayload })

  if (!result?.data) {
    throw new Error(result?.serverError ?? 'Failed to send comment')
  }
  return result.data.comment as CommentPayload
}

// Helper function
const truncateAddress = (address: string) =>
  address.length > 10 ? `${address.slice(0, 6)}…${address.slice(-4)}` : address

// Comment Item Component
const CommentItem = ({
  comment,
  usernameMap,
}: {
  comment: CommentPayload
  usernameMap: Map<string, UsernameResponse>
}) => {
  const lookup = usernameMap.get(comment.user.address.toLowerCase())
  const displayName =
    lookup?.username ??
    comment.user.name ??
    truncateAddress(comment.user.address)
  const avatarSrc =
    lookup?.minimized_profile_picture_url ?? lookup?.profile_picture_url

  return (
    <Flex
      align="start"
      gap="2"
      maxWidth="80%"
      style={{ flexShrink: 0 }}
    >
      <Avatar
        size="1"
        src={avatarSrc}
        radius="full"
        fallback={displayName[0]?.toUpperCase() ?? 'U'}
        width="4"
        height="4"
        style={{
          minWidth: 'var(--space-4)',
          marginTop: 'var(--space-1)',
          boxShadow: '0 0 6px rgba(0,0,0,0.4)',
        }}
      />
      <Flex
        direction="column"
        gap="1"
        style={{ minWidth: 0, flex: 1 }}
      >
        <Text
          size="1"
          weight="medium"
          style={{
            color: 'white',
            textShadow: '0 1px 3px rgba(0,0,0,0.9)',
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
            color: 'white',
            textShadow: '0 1px 3px rgba(0,0,0,0.9)',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {comment.content}
        </Text>
      </Flex>
    </Flex>
  )
}

// Comment Composer Component
const CommentComposer = ({
  comment,
  setComment,
  onSubmit,
  onClose,
  isSubmitting,
  error,
}: {
  comment: string
  setComment: (value: string) => void
  onSubmit: (content: string) => void
  onClose: () => void
  isSubmitting: boolean
  error: string | null
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isOverLimit = comment.length > MAX_LENGTH
  const trimmedComment = comment.trim()
  const isSubmitDisabled =
    isSubmitting || trimmedComment.length === 0 || isOverLimit

  useEffect(() => {
    const timeout = setTimeout(() => textareaRef.current?.focus(), 20)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!isSubmitDisabled) onSubmit(trimmedComment)
      }}
    >
      <Card
        variant="surface"
        size="1"
        style={{ boxShadow: 'var(--shadow-4)' }}
      >
        <Flex
          justify="end"
          mb="1"
          position="absolute"
          top="3"
          right="3"
        >
          <IconButton
            size="1"
            variant="ghost"
            color="gray"
            onClick={onClose}
            type="button"
          >
            <Cross2Icon />
          </IconButton>
        </Flex>

        <Box asChild>
          <textarea
            ref={textareaRef}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            autoFocus
            placeholder="Type…"
            rows={1}
            style={{
              width: '100%',
              resize: 'none',
              border: isOverLimit
                ? '1px solid var(--red-9)'
                : '1px solid transparent',
              outline: 'none',
              background: 'transparent',
              color: 'inherit',
            }}
          />
        </Box>

        {error && (
          <Text
            size="1"
            color="red"
            mt="2"
          >
            {error}
          </Text>
        )}

        {isOverLimit && (
          <Text
            size="1"
            color="red"
            mt="2"
          >
            Comment is too long (140 characters max).
          </Text>
        )}

        <Flex
          justify="end"
          mt="3"
        >
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitDisabled}
          >
            Send
          </Button>
        </Flex>
      </Card>
    </form>
  )
}

// Comments List Component
const CommentsList = ({
  comments,
  usernameMap,
  isLoading,
  isError,
}: {
  comments: CommentPayload[]
  usernameMap: Map<string, UsernameResponse>
  isLoading: boolean
  isError: boolean
}) => {
  const commentsEndRef = useRef<HTMLDivElement>(null)

  // Keep only the most recent comments and auto-scroll
  const visibleComments = useMemo(() => {
    return comments.slice(-MAX_VISIBLE_COMMENTS)
  }, [comments])

  // Auto-scroll to bottom when new comments arrive
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [visibleComments.length])

  if (isLoading) return null

  return (
    <Box
      style={{
        maxHeight: '150px',
        overflowY: 'auto',
        maskImage:
          'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)',
        WebkitMaskImage:
          'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)',
      }}
    >
      <Flex
        direction="column"
        gap="2"
      >
        {isError ? (
          <Text color="red">Unable to load recent comments.</Text>
        ) : visibleComments.length > 0 ? (
          <>
            {visibleComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                usernameMap={usernameMap}
              />
            ))}
            <div ref={commentsEndRef} />
          </>
        ) : (
          <Text color="gray">No comments yet. Start the conversation.</Text>
        )}
      </Flex>
    </Box>
  )
}

// Main Component
export const StreamComments = ({ streamId }: { streamId: string }) => {
  const queryClient = useQueryClient()
  const [comment, setComment] = useState('')
  const [isComposerOpen, setIsComposerOpen] = useState(false)

  // Queries
  const commentsQuery = useQuery({
    queryKey: commentsQueryKey(streamId),
    queryFn: () => fetchComments({ streamId }),
    refetchInterval: getRandomInterval,
    retry: 3,
    retryDelay: (attempt) => Math.min(1500 * 2 ** attempt, 15000),
    staleTime: 10000,
  })

  const participantAddresses = useMemo(() => {
    if (!commentsQuery.data?.length) return []
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
    staleTime: 600_000,
  })

  const usernameMap = useMemo(() => {
    if (!usernamesQuery.data) return new Map<string, UsernameResponse>()
    return new Map(
      usernamesQuery.data.map((item) => [item.address.toLowerCase(), item]),
    )
  }, [usernamesQuery.data])

  // Mutation
  const mutation = useMutation({
    mutationFn: ({ content }: { content: string }) =>
      sendComment({ streamId, content }),
    onSuccess: () => {
      setComment('')
      setIsComposerOpen(false)
      queryClient.invalidateQueries({ queryKey: commentsQueryKey(streamId) })
    },
  })

  return (
    <Theme appearance="dark">
      <Flex
        position="absolute"
        inset="0"
        direction="column"
        justify="end"
        style={{ pointerEvents: 'none', zIndex: 2 }}
      >
        <Box
          p="4"
          pb="3"
          width="100%"
          style={{ pointerEvents: 'none' }}
        >
          <Flex
            direction="column"
            gap="3"
          >
            <CommentsList
              comments={commentsQuery.data ?? []}
              usernameMap={usernameMap}
              isLoading={commentsQuery.isLoading}
              isError={commentsQuery.isError}
            />

            <Flex
              flexGrow="1"
              direction="column"
              style={{ pointerEvents: 'auto' }}
            >
              {isComposerOpen ? (
                <CommentComposer
                  comment={comment}
                  setComment={setComment}
                  onSubmit={(content) => mutation.mutate({ content })}
                  onClose={() => setIsComposerOpen(false)}
                  isSubmitting={mutation.isPending}
                  error={mutation.error?.message ?? null}
                />
              ) : (
                <Button
                  radius="full"
                  onClick={() => setIsComposerOpen(true)}
                  style={{
                    width: '100%',
                    justifyContent: 'flex-start',
                    gap: 'var(--space-2)',
                    backgroundColor: 'var(--gray-4)',
                    opacity: 0.5,
                  }}
                >
                  <Text size="1">Type…</Text>
                </Button>
              )}
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </Theme>
  )
}
