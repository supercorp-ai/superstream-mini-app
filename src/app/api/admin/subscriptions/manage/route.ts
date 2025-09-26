import { NextRequest, NextResponse } from 'next/server'
import dayjs from 'dayjs'
import { prisma } from '@/lib/prisma'
import type { PlanType } from '@prisma/client'

const PLAN_RANK: Record<PlanType, number> = {
  BASIC: 0,
  STARTER: 1,
  PRO: 2,
  ENTERPRISE: 3,
}

export const GET = async (req: NextRequest) => {
  const DEBUG = new URL(req.url).searchParams.has('debug')

  const now = dayjs().toDate()

  const workspaces = await prisma.workspace.findMany({
    where: {
      subscripions: {
        some: { status: 'VERIFIED', periodEndTime: { lte: now } },
      },
    },
    select: { id: true, planType: true },
    orderBy: { updatedAt: 'desc' },
  })

  if (DEBUG) {
    console.log({ message: 'Expired-sub workspaces', count: workspaces.length })
  }

  await Promise.all(
    workspaces.map(({ id, planType: fromPlan }) =>
      prisma.$transaction(async (tx) => {
        const activeSubs = await tx.subscription.findMany({
          where: {
            workspaceId: id,
            status: 'VERIFIED',
            periodStartTime: { lte: now },
            periodEndTime: { gt: now },
          },
          select: {
            id: true,
            planType: true,
            periodStartTime: true,
            periodEndTime: true,
          },
        })

        const expiredSubs = await tx.subscription.findMany({
          where: {
            workspaceId: id,
            status: 'VERIFIED',
            periodEndTime: { lte: now },
          },
          select: {
            id: true,
            planType: true,
            periodStartTime: true,
            periodEndTime: true,
          },
        })

        const toPlan =
          activeSubs
            .map((s) => s.planType)
            .sort((a, b) => PLAN_RANK[b] - PLAN_RANK[a])[0] ?? 'BASIC'

        const role = await tx.userRole.findFirst({
          where: { workspaceId: id },
          include: { user: { select: { address: true } } },
        })

        let worldUsername: string | null = null
        if (DEBUG && role?.user?.address) {
          try {
            const res = await fetch(
              `https://usernames.worldcoin.org/api/v1/${role.user.address.toLowerCase()}`,
            ).then((r) => r.json())
            worldUsername = res.username ?? null
          } catch {
            /* ignore network errors in debug mode */
          }
        }

        if (DEBUG) {
          console.log({
            workspaceId: id,
            fromPlan,
            toPlan,
            userAddress: role?.user?.address ?? null,
            worldcoinUsername: worldUsername,
            expiredSubscriptions: expiredSubs.map((s) => ({
              plan: s.planType,
              started: s.periodStartTime,
              ended: s.periodEndTime,
            })),
            activeSubscriptions: activeSubs.map((s) => ({
              plan: s.planType,
              started: s.periodStartTime,
              ends: s.periodEndTime,
            })),
          })
        }

        if (!DEBUG && fromPlan !== toPlan) {
          console.log('Updating workspace plan', {
            workspaceId: id,
            fromPlan,
            toPlan,
            userAddress: role?.user?.address ?? null,
            worldcoinUsername: worldUsername,
            expiredSubscriptions: expiredSubs.map((s) => ({
              plan: s.planType,
              started: s.periodStartTime,
              ended: s.periodEndTime,
            })),
            activeSubscriptions: activeSubs.map((s) => ({
              plan: s.planType,
              started: s.periodStartTime,
              ends: s.periodEndTime,
            })),
          })
          await tx.workspace.update({
            where: { id },
            data: { planType: toPlan },
          })
        }
      }),
    ),
  )

  console.log('Expired subscriptions processed')

  return NextResponse.json({
    success: true,
    processed: workspaces.length,
    dryRun: DEBUG,
  })
}
