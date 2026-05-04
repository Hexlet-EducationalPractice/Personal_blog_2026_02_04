/// <reference types="vite/client" />

const required = (key: string): string => {
  const v = (import.meta.env as Record<string, string | undefined>)[key];
  if (!v) {
    throw new Error(`Missing env ${key}. Скопируйте .env.example в .env.`);
  }
  return v;
};

export const env = {
  blogOwnerId: required('VITE_BLOG_OWNER_ID'),
  siteUrl: required('VITE_SITE_URL'),
} as const;
