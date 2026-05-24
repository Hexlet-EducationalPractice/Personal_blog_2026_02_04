export const DEFAULT_ERROR_MESSAGE = 'Что-то пошло не так. Попробуйте ещё раз.'
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String(error.message)
  }
  return DEFAULT_ERROR_MESSAGE
}
