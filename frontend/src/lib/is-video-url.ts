import { POST_FILE_TYPES } from './constants'

const videoTypes = POST_FILE_TYPES.filter((type) => type.includes('video')).map((type) =>
  type.split('/')[1].toLowerCase(),
)

export function isVideoUrl(url: string): boolean {
  const pathname = url.split('?')[0].split('#')[0].toLowerCase()
  const ext = pathname.slice(url.lastIndexOf('.') + 1)

  return videoTypes.includes(ext)
}
