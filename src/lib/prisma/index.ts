import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@/generated/prisma/client'

const prismaClientSingleton = () => {
  const connectionString = `${process.env.DATABASE_URL}`

  if (process.env.NODE_ENV === 'test') {
    return new PrismaClient()
  }

  const adapter = new PrismaNeon({ connectionString })

  return new PrismaClient({
    adapter,
    transactionOptions: {
      timeout: 15000,
    },
  })
}

declare global {
  // eslint-disable-next-line no-var
  var prisma: ReturnType<typeof prismaClientSingleton> | undefined
}

export const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
