import { User } from 'next-auth'
import { publicErrors, AuthError } from '@/lib/errors'
import { createSafeActionClient } from 'next-safe-action'
import { getCurrentUser } from '@/lib/users/getCurrentUser'

export const actionClient = createSafeActionClient({
  handleServerError(error) {
    if (publicErrors.some((e) => error instanceof e)) {
      return error.message
    }

    console.dir({ error }, { depth: null })

    return 'Something went wrong while executing the action. Please try again later or contact support.'
  },
})

export const authActionClient = actionClient.use(
  async ({ next }: { next: any }) => {
    const { user, session } = await getCurrentUser()

    if (!user) {
      throw new AuthError()
    }

    return next({
      ctx: {
        session,
        user,
      } as {
        session: any
        user: User
      },
    })
  },
)

export const workspaceActionClient = actionClient.use(
  async ({ next }: { next: any }) => {
    const { user, session } = await getCurrentUser()

    if (!user) {
      throw new AuthError()
    }

    return next({
      ctx: {
        session,
        user,
      } as {
        session: any
        user: User
      },
    })
  },
)
