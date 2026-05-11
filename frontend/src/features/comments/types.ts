import type { Tables } from '@/types/database'

type Profile = Tables<'profiles'>

export type Comment = Tables<'comments'>

export type CommentWithAuthor = Comment & {
  author: Pick<Profile, 'id' | 'name' | 'avatar_url'> | null
}

export type CreateCommentInput = {
  post_id: string
  body: string
  parent_id?: string
}
