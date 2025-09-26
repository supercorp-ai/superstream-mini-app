import { describe, it } from 'node:test'
import assert from 'node:assert'
import { prisma } from '../../src/lib/prisma'
import { createTestUser } from '../lib/users/createTestUser'
// @ts-ignore-next-line
import { createTestWorkspace } from '../lib/workspaces/createTestWorkspace'
// @ts-ignore-next-line
import { createTestUserRole } from '../lib/userRoles/createTestUserRole'
// @ts-ignore-next-line
import { createTestThread } from '../lib/threads/createTestThread'
// @ts-ignore-next-line
import { createTestUserMessageLog } from '../lib/userMessageLogs/createTestUserMessageLog'
import { getUnclaimedSupertokensCount } from '../../src/lib/supertokens/getUnclaimedSupertokensCount'
import { SupertokenClaimStatus } from '@prisma/client'
import { createTestSupertokenClaim } from '../lib/supertokenClaims/createTestSupertokenClaim'

describe('supertoken flow', () => {
  it('computes unclaimed count and completes claim', async () => {
    const user = await createTestUser()
    const workspace = await createTestWorkspace()
    await createTestUserRole({
      data: { userId: user.id, workspaceId: workspace.id },
    })
    const thread = await createTestThread({
      data: { workspaceId: workspace.id },
    })
    await createTestUserMessageLog({
      data: { userId: user.id, workspaceId: workspace.id, threadId: thread.id },
    })
    await createTestUserMessageLog({
      data: { userId: user.id, workspaceId: workspace.id, threadId: thread.id },
    })
    await prisma.user.update({
      where: { id: user.id },
      data: { claimedSupertokensCount: 1 },
    })

    const count = await getUnclaimedSupertokensCount({ userId: user.id })
    assert.strictEqual(count, 1)

    const claim = await createTestSupertokenClaim({
      data: { userId: user.id, uid: 'test', quantity: count },
    })

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { claimedSupertokensCount: { increment: claim.quantity } },
      }),
      prisma.supertokenClaim.update({
        where: { id: claim.id },
        data: { status: SupertokenClaimStatus.COMPLETED },
      }),
    ])

    const updated = await prisma.user.findUnique({ where: { id: user.id } })
    assert.strictEqual(updated?.claimedSupertokensCount, 2)

    const claimRecord = await prisma.supertokenClaim.findUnique({
      where: { id: claim.id },
    })
    assert.strictEqual(claimRecord?.status, SupertokenClaimStatus.COMPLETED)
  })
})
