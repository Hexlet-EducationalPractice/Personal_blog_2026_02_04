import styles from './Pagination.module.css'

const VISIBLE_PAGE_COUNT = 3

type PaginationProps = {
  currentPage: number
  totalCount: number
  perPage: number
  onPageChange: (page: number) => void
}

function buildPaginationItems(currentPage: number, totalPages: number): number[] {
  const visibleCount = Math.min(VISIBLE_PAGE_COUNT, totalPages)
  const halfVisibleCount = Math.floor(visibleCount / 2)

  let start = currentPage - halfVisibleCount
  let end = start + visibleCount - 1

  if (start < 1) {
    start = 1
    end = visibleCount
  }

  if (end > totalPages) {
    end = totalPages
    start = totalPages - visibleCount + 1
  }

  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
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
