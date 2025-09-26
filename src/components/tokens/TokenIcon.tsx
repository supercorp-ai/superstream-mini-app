import Image, { type StaticImageData } from 'next/image'
import { Box } from '@radix-ui/themes'

export const TokenIcon = ({
  src,
  alt,
  style = {},
}: {
  src: StaticImageData
  alt: string
  style?: React.CSSProperties
}) => (
  <Box
    style={{
      position: 'relative',
      width: 'var(--space-5)',
      height: 'var(--space-5)',
      borderRadius: 'var(--radius-2)',
      display: 'inline-flex',
      alignItems: 'center',
      flexShrink: 0,
      ...style,
    }}
  >
    <Image
      src={src}
      alt={alt}
      quality={75}
      placeholder="blur"
      fill
      sizes="(max-width: 768px) 100px, 300px"
      style={{
        objectFit: 'cover',
      }}
    />
  </Box>
)
