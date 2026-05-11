import { supabase } from '@/lib/supabase'

import type { CommentWithAuthor, CreateCommentInput } from './types'

const COMMENT_WITH_AUTHOR_QUERY = `
  *,
  author:profiles(id, name, avatar_url)
`

export async function getComments(postId: string): Promise<CommentWithAuthor[]> {
  const { data, error } = await supabase
    .from('comments')
    .select(COMMENT_WITH_AUTHOR_QUERY)
    .eq('post_id', postId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as unknown as CommentWithAuthor[]
}

export async function createComment(input: CreateCommentInput): Promise<CommentWithAuthor> {
  const { data, error } = await supabase
    .from('comments')
    .insert(input)
    .select(COMMENT_WITH_AUTHOR_QUERY)
    .single()

  if (error) throw error
  return data as unknown as CommentWithAuthor
}

export async function updateComment(id: string, body: string): Promise<CommentWithAuthor> {
  const { data, error } = await supabase
    .from('comments')
    .update({ body })
    .eq('id', id)
    .select(COMMENT_WITH_AUTHOR_QUERY)
    .single()

  if (error) throw error
  return data as unknown as CommentWithAuthor
}

export async function deleteComment(id: string): Promise<void> {
  const { error } = await supabase.from('comments').delete().eq('id', id)

  if (error) throw error
}
