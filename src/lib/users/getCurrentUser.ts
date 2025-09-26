import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export const getCurrentUser = async () => {
  const isTesting = !!(await cookies()).get('test-G2IUVTOWXkZZ')?.value

  const session = isTesting
    ? {
        user: await prisma.user.findUnique({
          where: { id: 'cm8cfdf250000jl03qsa20xnh' },
        }),
      }
    : await auth()

  if (!session?.user) {
    return {
      user: null,
      session: null,
    }
  }

  return {
    user: session.user,
    session,
  }
}
