import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'id', 'es', 'pt', 'th', 'pl', 'de', 'ms'],

  // Used when no locale matches
  defaultLocale: 'en',
})
