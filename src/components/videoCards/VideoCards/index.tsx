import { Flex, Box } from '@radix-ui/themes'
import { LazyBackgroundVideo } from '@/components/videos/LazyBackgroundVideo'
import { Root } from './Root'

const Item = ({ children, src }: { children: React.ReactNode; src: any }) => (
  <Flex
    flexGrow="1"
    style={{
      width: 'calc(100dvw - 2 * 50px)',
      maxWidth: '400px',
      scrollSnapAlign: 'center',
      flexShrink: 0,
    }}
  >
    <Flex
      flexGrow="1"
      direction="column"
      style={{
        position: 'relative',
        backgroundColor: 'var(--gray-3)',
        borderRadius: 'var(--radius-4)',
        overflow: 'hidden',
      }}
    >
      <Box style={{ width: '100%', position: 'relative' }}>
        <Box
          style={{
            width: '100%',
            minHeight: '45dvh',
            position: 'relative',
            flexGrow: 1,
            aspectRatio: 1,
          }}
        >
          <LazyBackgroundVideo
            src={src}
            autoPlay
            loop
            playsInline
            containerStyle={{
              width: '100%',
              minHeight: '45dvh',
              aspectRatio: '1 / 1',
            }}
            style={{
              flexGrow: 1,
              aspectRatio: 1,
              objectFit: 'cover',
              objectPosition: 'center top',
            }}
          />
        </Box>

        <Box
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: '-200px',
            height: '350px',
            background:
              'linear-gradient(to bottom, var(--gray-a1) 0%, var(--gray-3) 20%)',
            pointerEvents: 'none',
          }}
        >
          <Box
            style={{
              position: 'absolute',
              inset: 0,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              background: 'transparent',
              maskImage:
                'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.1) 10%, black 50%)',
              WebkitMaskImage:
                'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.1) 10%, black 50%)',
            }}
          />
        </Box>
      </Box>

      <Flex
        direction="column"
        px="4"
        pt="9"
        pb="4"
        flexShrink="0"
        style={{
          marginTop: '-175px',
          flexGrow: 1,
          zIndex: 1,
        }}
      >
        {children}
      </Flex>
    </Flex>
  </Flex>
)

export const VideoCards = {
  Root,
  Item,
}
