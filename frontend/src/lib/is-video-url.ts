import { POST_FILE_TYPES } from './constants'

const videoTypes = POST_FILE_TYPES.filter((type) => type.includes('video')).map(
  (type) => type.split('/')[1],
)

export function isVideoUrl(url: string): boolean {
  const ext = url.slice(url.lastIndexOf('.') + 1)
  return videoTypes.includes(ext)
}
