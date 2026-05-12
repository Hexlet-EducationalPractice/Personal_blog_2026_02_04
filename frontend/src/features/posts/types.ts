import { type Tables } from '@/types/database'

export type Post = Tables<'posts'>

export type Profile = Tables<'profiles'>

export type PostWithAuthor = Post & {
  author: Pick<Profile, 'id' | 'name' | 'avatar_url'> | null
}

export type CreatePostInput = {
  title: string
  body: string
  image_url: string | null
  tag: string | null
  user_id?: string
}
