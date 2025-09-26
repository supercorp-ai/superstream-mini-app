'use client'

import { useParams } from 'next/navigation'
import { Locale, useLocale, useTranslations } from 'next-intl'
import { useTransition, useCallback, useMemo } from 'react'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { Dialog, Button, Flex } from '@radix-ui/themes'
import { localeConfigs } from '@/lib/locales/localeConfigs'
import { ChevronDownIcon } from '@radix-ui/react-icons'

const Item = ({ locale }: { locale: Locale }) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const pathname = usePathname()
  const params = useParams()
  const currentLocale = useLocale()

  const localeConfig = useMemo(
    () => localeConfigs.find((config) => config.locale === locale),
    [locale],
  )

  const onClick = useCallback(
    ({ locale }: { locale: Locale }) => {
      startTransition(() => {
        router.replace(
          // @ts-expect-error -- TypeScript will validate that only known `params`
          // are used in combination with a given `pathname`. Since the two will
          // always match for the current route, we can skip runtime checks.
          { pathname, params },
          { locale },
        )
      })
    },
    [router, pathname, params, startTransition],
  )

  return (
    <Button
      disabled={locale === currentLocale}
      onClick={() => onClick({ locale })}
      loading={isPending}
      variant="soft"
      size="3"
    >
      {localeConfig!.icon} {localeConfig!.name}
    </Button>
  )
}

export const LocaleInput = ({
  size = '3',
  variant = 'soft',
  isMinimal = false,
}: {
  size?: '1' | '2' | '3' | '4'
  variant?: 'soft' | 'ghost'
  isMinimal?: boolean
}) => {
  const currentLocale = useLocale()

  const currentLocaleConfig = useMemo(
    () => localeConfigs.find((config) => config.locale === currentLocale),
    [currentLocale],
  )
  const t = useTranslations('components.locales.LocaleInput')

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button
          variant={variant}
          size={size}
        >
          {currentLocaleConfig!.icon}{' '}
          {isMinimal ? '' : currentLocaleConfig!.name}
          <ChevronDownIcon />
        </Button>
      </Dialog.Trigger>
      <Dialog.Content maxWidth="450px">
        <Dialog.Title>{t('title')}</Dialog.Title>
        <Dialog.Description
          size="2"
          mb="4"
        >
          {t('description')}
        </Dialog.Description>

        <Flex
          direction="column"
          gap="1"
        >
          {routing.locales.map((locale) => (
            <Item
              locale={locale}
              key={locale}
            />
          ))}
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}
