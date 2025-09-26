import { IconButton, Flex } from '@radix-ui/themes'
import { useRouter } from '@/i18n/navigation'
import { useTransition } from 'react'
import Image from 'next/image'
import supertokenSrc from '@/assets/images/tokens/supertoken.png'

export const SupertokensButton = () => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <IconButton
      variant="ghost"
      loading={isPending}
      size="3"
      onClick={() => {
        startTransition(() => {
          router.push('/supertokens')
        })
      }}
    >
      <Flex
        style={{
          position: 'relative',
          width: 'var(--space-5)',
          borderRadius: 'var(--radius-2)',
          display: 'inline-flex',
          alignItems: 'center',
          overflow: 'hidden',
          flexShrink: 0,
          aspectRatio: 1,
        }}
      >
        <Image
          src={supertokenSrc}
          alt=""
          quality={75}
          placeholder="blur"
          fill
          sizes="(max-width: 768px) 52px, 52px"
          style={{
            objectFit: 'cover',
          }}
        />
      </Flex>
    </IconButton>
  )
}
