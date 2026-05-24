export const truncate = (text: string, max: number): string => {
  if (max < 0) {
    return text
  }
  if (text.length <= max) {
    return text
  }
  return text.slice(0, max).trimEnd() + '...'
} 