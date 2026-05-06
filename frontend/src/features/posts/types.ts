import { type Database } from '@/types/database'

export type Post = Database['public']['Tables']['posts']['Row']

export type CreatePostInput = Database['public']['Tables']['posts']['Insert']

export type PostWithAuthor = Post & {
  author: Database['public']['Tables']['profiles']['Row']
}
