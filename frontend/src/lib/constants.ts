export const POSTS_PER_PAGE = 3
export const MIN_SEARCH_LENGTH = 2
export const RELATED_POSTS_COUNT = 4
export const DEBOUNCE_MS = 300
export const MOBILE_BREAKPOINT = 768
export const ROUTES = {
  home: '/',
  post: (id: string) => `/post/${id}`,
  search: '/search',
  works: '/works',
  auth: '/auth',
  authReset: '/auth/reset',
  authUpdatePassword: '/auth/update-password',
  profile: '/profile',
} as const
export const VISIBLE_PAGE_COUNT = 3
export const CONTACT_EMAIL = 'grazhdantsev@yandex.ru'
export const CONTACT_PHONE = '+8-800-555-35-35'
export const CONTACT_PHONE_HREF = '88005553535'
