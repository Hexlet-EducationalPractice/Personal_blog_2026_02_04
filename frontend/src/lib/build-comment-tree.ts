type FlatComment = {
  id: string
  parent_id: string | null
  [key: string]: unknown
}

type CommentTree = FlatComment & { replies: CommentTree[] }

function buildCommentTree(flat: FlatComment[]): CommentTree[] {
  const roots: CommentTree[] = []
  const map = new Map<string, CommentTree>()

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

export type { FlatComment, CommentTree }
export { buildCommentTree }
