import { VideoIcon, GlobeIcon, DoubleArrowUpIcon } from '@radix-ui/react-icons'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { Flex, Strong, Card, Button, Heading, Text } from '@radix-ui/themes'
import Image from 'next/image'
import supertokenSrc from '@/assets/images/tokens/supertoken.png'
import { ClaimSupertokensButton } from './ClaimSupertokensButton'
import supertokenVideoSrc from '/videos/tokens/supertoken.mp4'
import { LazyBackgroundVideo } from '@/components/videos/LazyBackgroundVideo'

export const TextSupertoken = () => (
  <Flex
    style={{
      position: 'relative',
      width: '100%',
      borderRadius: 'var(--radius-2)',
      display: 'inline-flex',
      alignItems: 'center',
      overflow: 'hidden',
      flexShrink: 0,
      maxWidth: 'var(--space-6)',
      aspectRatio: 1,
    }}
  >
    <Image
      src={supertokenSrc}
      alt=""
      quality={75}
      placeholder="blur"
      fill
      sizes="(max-width: 768px) 768px, 1024px"
      style={{
        objectFit: 'cover',
      }}
    />
  </Flex>
)

export const Content = ({
  unclaimedSupertokensCount,
  pendingClaimQuantity,
  balance,
}: {
  unclaimedSupertokensCount: number
  pendingClaimQuantity: number
  balance: string
}) => {
  const t = useTranslations('app.miniApp.dashboard.supertokens.Content')

  return (
    <Flex
      direction="column"
      gap="4"
      px="4"
      pb="9"
      style={{ flexGrow: 1 }}
    >
      <Flex justify="center">
        <Flex
          style={{
            position: 'relative',
            width: '100%',
            alignItems: 'center',
            overflow: 'hidden',
            flexShrink: 0,
            maxWidth: '200px',
            aspectRatio: 1,
          }}
        >
          <LazyBackgroundVideo
            src={supertokenVideoSrc}
            autoPlay
            loop
            playsInline
            style={{
              flexGrow: 1,
              aspectRatio: 1,
              objectFit: 'contain',
              objectPosition: 'center',
            }}
          />
        </Flex>
      </Flex>
      <Flex
        direction="column"
        flexShrink="0"
      >
        <Heading
          color="gray"
          highContrast
        >
          {t('title')}
        </Heading>
        <Heading
          size="4"
          color="gray"
        >
          {t('subtitle')}
        </Heading>

        <Flex
          direction="column"
          gap="2"
        >
          <Flex
            direction="column"
            py="2"
          >
            <Card size="1">
              <Flex
                direction="column"
                gap="4"
              >
                <Flex
                  direction="column"
                  gap="1"
                >
                  <Text color="gray">{t('balanceTitle')}</Text>

                  <Flex
                    align="center"
                    gap="2"
                  >
                    <TextSupertoken />

                    <Heading>
                      {t('balanceValue', {
                        balance,
                      })}
                    </Heading>
                  </Flex>
                </Flex>

                <Flex
                  direction="column"
                  gap="2"
                >
                  {unclaimedSupertokensCount < 1 ? (
                    <Button
                      disabled
                      size="4"
                    >
                      {t('noUnclaimedSupertokens')}
                    </Button>
                  ) : (
                    <ClaimSupertokensButton
                      totalClaimable={unclaimedSupertokensCount}
                      pendingClaimQuantity={pendingClaimQuantity}
                    />
                  )}
                </Flex>
              </Flex>
            </Card>
          </Flex>

          <Flex
            direction="column"
            gap="1"
          >
            <Flex
              align="center"
              gap="4"
            >
              <Flex flexShrink="0">
                <VideoIcon
                  width="20px"
                  height="20px"
                />
              </Flex>

              <Text color="gray">
                {t.rich('claimNote', {
                  strong: (children) => <Strong>{children}</Strong>,
                })}
              </Text>
            </Flex>
          </Flex>

          <Flex
            align="center"
            gap="4"
          >
            <Flex flexShrink="0">
              <GlobeIcon
                width="20px"
                height="20px"
              />
            </Flex>
            <Text
              mt="2"
              color="gray"
            >
              {t.rich('spendNote', {
                strong: (children) => <Strong>{children}</Strong>,
              })}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}
