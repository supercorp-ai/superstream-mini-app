import NextAuth, { type DefaultSession } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { Adapter } from 'next-auth/adapters'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { verifySiweMessage } from '@worldcoin/minikit-js'
import { prisma } from '@/lib/prisma'
import { getSignedNonce } from '@/lib/auth/walletAuth/getSignedNonce'

declare module 'next-auth' {
  interface User {
    address: string
  }

  interface Session {
    user: {
      address: string
    } & DefaultSession['user']
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  adapter: PrismaAdapter(prisma) as Adapter,
  // adapter: PrismaAdapter(prisma) as unknown as Adapter,
  providers: [
    Credentials({
      name: 'Wallet',
      credentials: {
        nonce: { label: 'Nonce', type: 'text' },
        signedNonce: { label: 'Signed Nonce', type: 'text' },
        finalPayloadJson: { label: 'Final Payload', type: 'text' },
      },
      // @ts-expect-error TODO
      authorize: async ({
        nonce,
        signedNonce,
        finalPayloadJson,
      }: {
        nonce: string
        signedNonce: string
        finalPayloadJson: string
      }) => {
        const expectedSignedNonce = getSignedNonce({ nonce })

        if (signedNonce !== expectedSignedNonce) {
          console.log('Invalid signed nonce')
          return null
        }

        const finalPayload = JSON.parse(finalPayloadJson)
        const result = await verifySiweMessage(finalPayload, nonce)

        if (!result.isValid || !result.siweMessageData.address) {
          console.log('Invalid final payload')
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            address: result.siweMessageData.address,
          },
        })

        if (user) {
          return user
        }

        const newUser = await prisma.user.create({
          data: {
            address: result.siweMessageData.address,
          },
        })

        return newUser
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id
        token.address = user.address
      }

      return token
    },
    session: async ({ session, token }) => {
      if (token.userId) {
        session.user.id = token.userId as string
        session.user.address = token.address as string
      }

      return session
    },
  },
})
