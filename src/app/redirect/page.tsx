import { redirect } from '@/i18n/navigation'
import type { Locale } from 'next-intl'

export default async function Page(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  params: Promise<{
    locale: Locale
  }>
}) {
  const searchParams = await props.searchParams
  // TODO locale here
  const params = await props.params

  // Extract the URL from the query parameters
  const urlParam = searchParams.url
  if (!urlParam || Array.isArray(urlParam)) {
    throw new Error("Missing or invalid 'url' parameter")
  }

  // Remove the "url" parameter from the query string
  const queryParams = new URLSearchParams()
  for (const key in searchParams) {
    if (key === 'url') continue
    const value = searchParams[key]
    if (Array.isArray(value)) {
      value.forEach((v) => queryParams.append(key, v))
    } else if (value !== undefined) {
      queryParams.set(key, value)
    }
  }

  const queryString = queryParams.toString()
  const redirectUrl = `${urlParam}${queryString ? '?' + queryString : ''}`

  return redirect({
    href: redirectUrl,
    locale: 'en',
  })
}
