import { withNextVideo } from 'next-video/process'
import createNextIntlPlugin from 'next-intl/plugin'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: path.join(__dirname, '.'),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.superinterface.ai',
      },
    ],
  },
}

const withNextIntl = createNextIntlPlugin()

export default withNextVideo(withNextIntl(nextConfig), {
  provider: 'cloudflare-r2',
  providerConfig: {
    'cloudflare-r2': {
      endpoint:
        'https://ccdfd7313264accfec08849748233475.r2.cloudflarestorage.com',
      bucket: 'superstream-mini-app-videos',
      bucketUrlPublic: 'https://mini-app-videos.superstream.sh',
    },
  },
})
