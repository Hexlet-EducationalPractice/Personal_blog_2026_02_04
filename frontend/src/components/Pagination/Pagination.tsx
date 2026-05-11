import styles from './Pagination.module.css'
type PaginationItem = number | 'ellipsis-left' | 'ellipsis-right'
type PaginationProps = {
  currentPage: number
  totalCount: number
  perPage: number
  onPageChange: (page: number) => void
}
function buildPaginationItems(currentPage: number, totalPages: number): PaginationItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }
  const items: PaginationItem[] = [1]
  const start = Math.max(2, currentPage - 1)
  const end = Math.min(totalPages - 1, currentPage + 1)
  if (start > 2) {
    items.push('ellipsis-left')
  } else {
    for (let page = 2; page < start; page += 1) {
      items.push(page)
    }
  }
  for (let page = start; page <= end; page += 1) {
    items.push(page)
  }

  if (end < totalPages - 1) {
    items.push('ellipsis-right')
  } else {
    for (let page = end + 1; page < totalPages; page += 1) {
      items.push(page)
    }
  }
  items.push(totalPages)
  return items
}
export function Pagination({ currentPage, totalCount, perPage, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(totalCount / perPage)

  if (totalPages <= 1) {
    return null
  }
  const normalizedCurrentPage = Math.min(Math.max(1, currentPage), totalPages)
  const items = buildPaginationItems(normalizedCurrentPage, totalPages)

  const handlePrev = () => {
    if (normalizedCurrentPage > 1) {
      onPageChange(normalizedCurrentPage - 1)
    }
  }
  const handleNext = () => {
    if (normalizedCurrentPage < totalPages) {
      onPageChange(normalizedCurrentPage + 1)
    }
  }
  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <button
        type="button"
        className={styles.navButton}
        onClick={handlePrev}
        disabled={normalizedCurrentPage === 1}
        aria-label="Previous page"
      >
        {'<'}
      </button>
      <ul className={styles.pageList}>
        {items.map((item) => {
          if (typeof item !== 'number') {
            return (
              <li key={item} className={styles.ellipsis} aria-hidden="true">
                ...
              </li>
            )
          }
          const isActive = item === normalizedCurrentPage

          return (
            <li key={item}>
              <button
                type="button"
                className={`${styles.pageButton} ${isActive ? styles.activePage : ''}`}
                onClick={isActive ? undefined : () => onPageChange(item)}
                aria-current={isActive ? 'page' : undefined}
              >
                {item}
              </button>
            </li>
          )
        })}
      </ul>
      <button
        type="button"
        className={styles.navButton}
        onClick={handleNext}
        disabled={normalizedCurrentPage === totalPages}
        aria-label="Next page"
      >
        {'>'}
      </button>
    </nav>
  )
}
