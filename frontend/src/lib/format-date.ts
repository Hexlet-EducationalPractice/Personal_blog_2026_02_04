function getValidDate(iso: string | null | undefined): Date | null {
  if (!iso) return null
  const date = new Date(iso)
  return isNaN(date.getTime()) ? null : date
}

function formatDate(iso: string | null | undefined): string {
  const date = getValidDate(iso)
  if (!date) return ''

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}.${month}.${year}`
}

function formatRelative(iso: string): string {
  const date = getValidDate(iso)
  if (!date) return ''

  const diffMs = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diffMs / 60_000)

  if (minutes < 1) {
    return 'только что'
  }

  if (minutes < 60) {
    return `${minutes} мин назад`
  }

  const hours = Math.floor(minutes / 60)

  if (hours < 24) {
    return `${hours} ч назад`
  }

  return formatDate(iso)
}

export { formatDate, formatRelative }
