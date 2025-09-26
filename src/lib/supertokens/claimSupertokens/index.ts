import { MiniKit, VerificationLevel } from '@worldcoin/minikit-js'
import { getTransaction } from './getTransaction'
import { verify } from './verify'

export const claimSupertokens = async () => {
  const { finalPayload: verifyPayload } = await MiniKit.commandsAsync.verify({
    action: 'supertokens-claim',
    verification_level: VerificationLevel.Orb,
  })

  if (verifyPayload.status !== 'success') {
    throw new Error('Verification failed')
  }

  const result = await getTransaction({
    verifyPayload,
  })

  if (!result?.data) {
    throw new Error('Error sending transaction')
  }

  const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
    transaction: result.data.transaction,
  })

  if (finalPayload.status !== 'success') {
    throw new Error('Error sending transaction')
  }

  await verify({
    finalPayload,
  })
}
