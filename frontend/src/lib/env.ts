const required = (key: string): string => {
  const value = import.meta.env[key]
  if (!value || typeof value !== 'string') {
    throw new Error(
      `Missing required env variable: ${key}. ` +
        `Скопируйте frontend/.env.example в frontend/.env и заполните значения.`
    )
  }
  return value
}

export const env = {
  apiUrl: required('VITE_API_URL'),
  blogOwnerId: required('VITE_BLOG_OWNER_ID'),
  siteUrl: required('VITE_SITE_URL'),
} as const
