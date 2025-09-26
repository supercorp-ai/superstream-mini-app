import { redirect } from '@/i18n/navigation'
import { cookies } from 'next/headers'

export async function GET() {
  ;(await cookies()).set('test-G2IUVTOWXkSS', 'true')

  return redirect({
    href: '/streams',
    locale: 'en',
  })
}
