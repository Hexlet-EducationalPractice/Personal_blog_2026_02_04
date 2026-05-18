import { supabase } from '@/lib/supabase'
import type { PostWithAuthor, CreatePostInput } from './types'

type GetPostsParams = {
  page: number
  perPage: number
  q?: string
  tag?: string
}

const POST_WITH_AUTHOR_QUERY = `
  *,
  author:profiles(id, name, avatar_url)
`

export async function getPosts({
  page,
  perPage,
  q,
  tag,
}: GetPostsParams): Promise<{ posts: PostWithAuthor[]; total: number }> {
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  let query = supabase.from('posts').select(POST_WITH_AUTHOR_QUERY, { count: 'exact' })

  if (q) {
    query = query.or(`title.ilike.%${q}%,body.ilike.%${q}%`)
  }

  if (tag) {
    query = query.eq('tag', tag)
  }

  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw error

  return {
    posts: (data as unknown as PostWithAuthor[]) || [],
    total: count || 0,
  }
}

export async function getPostById(id: string): Promise<PostWithAuthor> {
  const { data, error } = await supabase
    .from('posts')
    .select(POST_WITH_AUTHOR_QUERY)
    .eq('id', id)
    .single()

  if (error) throw error
  return data as unknown as PostWithAuthor
}

export async function createPost(input: CreatePostInput): Promise<PostWithAuthor> {
  const { media, ...postData } = input
  const image_url = media ? await uploadPostMedia(media) : null

  const { data, error } = await supabase
    .from('posts')
    .insert({ ...postData, image_url })
    .select(POST_WITH_AUTHOR_QUERY)
    .single()

  if (error) throw error
  return data as unknown as PostWithAuthor
}

export async function updatePost(
  id: string,
  partial: Partial<CreatePostInput>,
): Promise<PostWithAuthor> {
  const { media, ...updateData } = partial
  const image_url = media ? await uploadPostMedia(media) : null

  const { data, error } = await supabase
    .from('posts')
    .update({ ...updateData, image_url })
    .eq('id', id)
    .select(POST_WITH_AUTHOR_QUERY)
    .single()

  if (error) throw error
  return data as unknown as PostWithAuthor
}

export async function deletePost(id: string, media_url: string): Promise<void> {
  await deletePostMedia(media_url)
  const { error } = await supabase.from('posts').delete().eq('id', id)

  if (error) throw error
}

export async function uploadPostMedia(file: File): Promise<string> {
  const ext = file.name.split('.').pop()
  const filePath = `${Date.now()}.${ext}`

  const { error } = await supabase.storage.from('posts').upload(filePath, file, { upsert: true })

  if (error) throw error

  const { data } = supabase.storage.from('posts').getPublicUrl(filePath)
  return data.publicUrl
}

export async function deletePostMedia(url: string): Promise<void> {
  const filePath = url.split('posts/')[1]

  const { error } = await supabase.storage.from('posts').remove([filePath])

  if (error) throw error
}
