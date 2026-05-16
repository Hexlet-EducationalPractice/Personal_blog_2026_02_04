import type { CommentNode, CommentWithAuthor } from '@/features/comments/types'

function buildCommentTree(flat: CommentWithAuthor[]): CommentNode[] {
  const roots: CommentNode[] = []
  const map = new Map<string, CommentNode>()

  for (const comment of flat) {
    map.set(comment.id, { ...comment, replies: [] })
  }

  for (const comment of flat) {
    const current = map.get(comment.id)!
    const parentId = comment.parent_id

    if (parentId && map.has(parentId)) {
      const parent = map.get(parentId)!
      parent.replies.push(current)
    } else {
      roots.push(current)
    }
  }

  return roots
}

export { buildCommentTree }
