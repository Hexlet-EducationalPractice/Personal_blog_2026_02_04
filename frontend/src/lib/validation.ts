const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const isValidEmail = (value: string): boolean => {
  return EMAIL_REGEX.test(value)
}
export const isValidUrl = (value: string): boolean => {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}
