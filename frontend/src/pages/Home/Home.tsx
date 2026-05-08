import { useSearchParams } from 'react-router-dom';
import { usePosts } from '@/features/posts/hooks/use-posts';
import { PostCard } from '@/features/posts/components/PostCard';
import { Pagination } from '@/components/Pagination';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { POSTS_PER_PAGE } from '@/lib/constants';
import styles from './Home.module.css';

export function Home() {
  const [searchParams, setSearchParams] = useSearchParams();

  const rawPage = Number(searchParams.get('page'));
  const uiPage = Number.isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

  const apiPage = uiPage - 1;

  const { posts, total, isLoading, error } = usePosts({
    page: apiPage,
    perPage: POSTS_PER_PAGE,
  });

  const handlePageChange = (page: number) => {
    setSearchParams({ page: String(page) });
  };

  if (isLoading) {
    return (
      <div className={styles.center}>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.center}>
        <ErrorMessage>
          Ошибка загрузки постов
        </ErrorMessage>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className={styles.center}>
        Постов пока нет
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <Pagination
        currentPage={uiPage}
        totalCount={total ?? 0}
        perPage={POSTS_PER_PAGE}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
