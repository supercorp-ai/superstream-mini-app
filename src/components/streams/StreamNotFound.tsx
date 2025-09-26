import { useTranslations } from 'next-intl'
import { FullPageNotFound } from '@/components/misc/FullPageNotFound'

export const StreamNotFound = () => {
  const t = useTranslations('components.threads.ThreadNotFound')

  return (
    <FullPageNotFound
      title={t('title')}
      subtitle={t('subtitle')}
    />
  )
}
