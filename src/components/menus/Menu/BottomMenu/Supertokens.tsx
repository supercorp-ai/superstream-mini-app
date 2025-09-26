import { Box, Button } from '@radix-ui/themes'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import supertokenSrc from '@/assets/images/tokens/supertoken.png'
import { useTranslations } from 'next-intl'

export const Supertokens = () => {
  const t = useTranslations('components.menus.Menu.BottomMenu.Supertokens')

  return (
    <Button
      size="3"
      variant="soft"
      asChild
    >
      <Link href="/supertokens">
        <Box
          style={{
            position: 'relative',
            width: 'var(--space-5)',
            height: 'var(--space-5)',
            borderRadius: 'var(--radius-2)',
            display: 'inline-flex',
            alignItems: 'center',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          <Image
            src={supertokenSrc}
            alt={t('imageAlt')}
            quality={75}
            placeholder="blur"
            fill
            sizes="(max-width: 768px) 100px, 300px"
            style={{
              objectFit: 'cover',
            }}
          />
        </Box>
        {t('buttonLabel')}
      </Link>
    </Button>
  )
}
