import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { Button, Theme, Grid } from '@radix-ui/themes'
import {
  ExclamationTriangleIcon,
  PersonIcon,
  ResetIcon,
} from '@radix-ui/react-icons'
import { FocusLayout } from '@/components/layouts/FocusLayout'
import '@/lib/styles/globals.css'

export const FullScreenError = ({ reset }: { reset: () => void }) => {
  const t = useTranslations('components.errors.FullScreenError')

  return (
    <Theme
      accentColor="gray"
      radius="large"
      panelBackground="solid"
      // hasBackground={false}
    >
      <FocusLayout.Root>
        <FocusLayout.Header.Root>
          <ExclamationTriangleIcon
            height="24px"
            width="24px"
          />

          <FocusLayout.Header.Title>{t('title')}</FocusLayout.Header.Title>
        </FocusLayout.Header.Root>

        <FocusLayout.Description>{t('description')}</FocusLayout.Description>

        <Grid
          gap="4"
          columns={{
            initial: '1',
            sm: '2',
          }}
        >
          <Button
            highContrast
            size="3"
            onClick={() => reset()}
          >
            <ResetIcon /> {t('resetButtonLabel')}
          </Button>

          <Button
            highContrast
            size="3"
            variant="soft"
            asChild
          >
            <Link href="mailto:domas@supercorp.ai">
              <PersonIcon />
              {t('contactButtonLabel')}
            </Link>
          </Button>
        </Grid>
      </FocusLayout.Root>
    </Theme>
  )
}
