import { useTranslations } from 'next-intl'
import { FullPageNotFound } from '@/components/misc/FullPageNotFound'

export const WorldcoinUserNotFound = () => {
  const t = useTranslations('components.worldcoinUsers.WorldcoinUserNotFound')

  return (
    <FullPageNotFound
      title={t('title')}
      subtitle={t('subtitle')}
    />
  )
}
