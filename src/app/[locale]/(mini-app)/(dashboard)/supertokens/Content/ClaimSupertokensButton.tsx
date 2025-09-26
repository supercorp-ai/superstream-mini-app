'use client'
import { useRouter } from '@/i18n/navigation'
import { useCallback, useState, useTransition, useMemo } from 'react'
import {
  Button,
  Dialog,
  Text,
  Strong,
  Flex,
  IconButton,
} from '@radix-ui/themes'
import { Cross1Icon } from '@radix-ui/react-icons'
import { claimSupertokens } from '@/lib/supertokens/claimSupertokens'
import { useTranslations } from 'next-intl'
import { useToasts } from '@/hooks/toasts/useToasts'

export const ClaimSupertokensButton = ({
  totalClaimable,
  pendingClaimQuantity,
}: {
  totalClaimable: number
  pendingClaimQuantity: number
}) => {
  const t = useTranslations(
    'app.miniApp.dashboard.supertokens.Content.ClaimSupertokensButton',
  )

  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isPendingManual, setIsPendingManual] = useState(false)
  const { addToast } = useToasts()

  const [isOpen, setIsOpen] = useState(false)

  const additionalClaimable = useMemo(() => {
    const claimNow =
      pendingClaimQuantity > 0 ? pendingClaimQuantity : totalClaimable

    return Math.max(totalClaimable - claimNow, 0)
  }, [totalClaimable, pendingClaimQuantity])

  const startClaim = useCallback(async () => {
    setIsPendingManual(true)
    try {
      await claimSupertokens()
    } catch (error) {
      console.error('Error claiming tokens:', error)
      addToast({
        type: 'error',
        message: t('claimSupertokensErrorMessage'),
      })
      setIsPendingManual(false)
      setIsOpen(false)
      return
    }

    setIsPendingManual(false)
    setIsOpen(false)
    startTransition(() => {
      router.refresh()
    })
  }, [router, addToast, t])

  const onClick = useCallback(() => {
    if (additionalClaimable > 0) {
      setIsOpen(true)
    } else {
      startClaim()
    }
  }, [additionalClaimable, startClaim])

  if (additionalClaimable === 0) {
    return (
      <Button
        size="4"
        color="mint"
        loading={isPending || isPendingManual}
        onClick={onClick}
      >
        {t('buttonLabel', {
          totalClaimable,
        })}
      </Button>
    )
  }

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <Dialog.Trigger>
        <Button
          size="4"
          color="mint"
          loading={isPending || isPendingManual}
          onClick={onClick}
        >
          {t('buttonLabel', {
            totalClaimable,
          })}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Close>
          <IconButton
            variant="ghost"
            color="gray"
            style={{
              position: 'absolute',
              top: 'var(--space-5)',
              right: 'var(--space-5)',
            }}
          >
            <Cross1Icon />
          </IconButton>
        </Dialog.Close>
        <Dialog.Title>{t('dialogTitle')}</Dialog.Title>
        <Dialog.Description>
          <Text size="2">
            {t.rich('dialogDescription', {
              strong: (children) => <Strong>{children}</Strong>,
              pendingClaimQuantity,
              additionalClaimable,
            })}
          </Text>
        </Dialog.Description>
        <Flex
          pt="4"
          direction="column"
          gap="2"
        >
          <Button
            size="4"
            color="mint"
            onClick={startClaim}
            loading={isPending || isPendingManual}
          >
            {t('confirmButtonLabel')}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}
