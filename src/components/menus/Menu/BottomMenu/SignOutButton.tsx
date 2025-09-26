import { useRouter } from '@/i18n/navigation'
import { useTranslations } from 'use-intl'
import { signOut } from 'next-auth/react'
import { useCallback } from 'react'
import { Button } from '@radix-ui/themes'

export const SignOutButton = () => {
  const t = useTranslations('components.menus.Menu.BottomMenu.SignOutButton')
  const router = useRouter()

  const onClick = useCallback(async () => {
    await signOut({ redirect: false })
    router.replace('/')
  }, [router])

  return (
    <Button
      variant="soft"
      size="3"
      onClick={onClick}
      style={{
        cursor: 'pointer',
      }}
    >
      {t('label')}
    </Button>
  )
}
