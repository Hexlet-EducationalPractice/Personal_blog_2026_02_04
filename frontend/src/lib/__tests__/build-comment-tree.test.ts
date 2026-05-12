import { buildCommentTree } from "../build-comment-tree";
import type { CommentWithAuthor } from '@/features/comments/types';


const makeComment = (overrides: Partial<CommentWithAuthor>): CommentWithAuthor => {
  return {
    id: 'c12',
    parent_id: null,
    body: 'Текст сообщения',
    created_at: '2026-05-11T12:00:00Z',
    user_id: 'u12',
    post_id: 'p11',
    author: {
      id: 'u11',
      name: 'Тест Тестович',
      avatar_url: 'https://studio-petukh.ru/shakal_images'
    },
    ...overrides,
  } as CommentWithAuthor;
};

describe('buildCommentTree', () => {

  it('должно вернуть пустой массив на пустой массив ', () => {
    expect(buildCommentTree([])).toEqual([])
  })

  it('должно вернуть корневой коммент', () => {
    const input = [makeComment({ id: 'c1', parent_id: null })]
    const result = buildCommentTree(input)
    
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('c1')
    expect(result[0].replies).toEqual([])
  })

  it('должно вернуть два корневых коммента', () => {
    const input = [
      makeComment({ id: 'c1' }),
      makeComment({ id: 'c2' })
    ]
    const result = buildCommentTree(input)
    expect(result).toHaveLength(2)
  })

  it('должно вернуть один корневой коммент плюс один ответ', () => {
    const input = [
      makeComment({ id: 'root' }),
      makeComment({ id: 'reply', parent_id: 'root' })
    ]
    const result = buildCommentTree(input)
    
    expect(result).toHaveLength(1)
    expect(result[0].replies).toHaveLength(1)
    expect(result[0].replies[0].id).toBe('reply')
  })

  it('глубокая вложенность комментов до 3', () => {
    const input = [
      makeComment({ id: '1' }),
      makeComment({ id: '2', parent_id: '1' }),
      makeComment({ id: '3', parent_id: '2' })
    ]
    const result = buildCommentTree(input)
    
    expect(result[0].replies[0].replies[0].id).toBe('3')
  })

  it('должно вернуть несколько ответов на один родительский коммент', () => {
    const input = [
      makeComment({ id: 'root' }),
      makeComment({ id: 'r1', parent_id: 'root' }),
      makeComment({ id: 'r2', parent_id: 'root' })
    ]
    const result = buildCommentTree(input)
    expect(result[0].replies).toHaveLength(2)
  })

  it('должно вернуть коммент без родителя', () => {
    const input = [makeComment({ id: 'exist?', parent_id: '?' })]
    const result = buildCommentTree(input)
    
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('exist?')
  })

  it('должно вернуть что map отрабатывает независимо от идекса в массиве', () => {
    const input = [
      makeComment({ id: 'child', parent_id: 'parent' }),
      makeComment({ id: 'parent', parent_id: null })
    ]
    const result = buildCommentTree(input)
    
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('parent')
    expect(result[0].replies[0].id).toBe('child')
  })
})