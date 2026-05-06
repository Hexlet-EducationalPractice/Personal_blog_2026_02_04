import { supabase } from '@/lib/supabase'
import type { PostWithAuthor, CreatePostInput } from './types'

type GetPostsParams = {
    page: number
    perPage: number
    q?: string
}

const POST_WITH_AUTHOR_QUERY = `
  *,
  author:profiles(id, name, avatar_url)
`

export async function getPosts({ page, perPage, q }: GetPostsParams): Promise<{ posts: PostWithAuthor[], total: number }> {
    const from = (page - 1) * perPage
    const to = from + perPage - 1

    let query = supabase
        .from('posts')
        .select(POST_WITH_AUTHOR_QUERY, { count: 'exact' })

    if (q) {
        query = query.or(`title.ilike.%${q}%,body.ilike.%${q}%`)
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
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        throw new Error('Unauthorized: You must be logged in to create a post')
    }

    const { data, error } = await supabase
        .from('posts')
        .insert({
            ...input,
            user_id: user.id
        })
        .select(POST_WITH_AUTHOR_QUERY)
        .single()

    if (error) throw error
    return data as unknown as PostWithAuthor
}

export async function updatePost(id: string, partial: Partial<CreatePostInput>): Promise<PostWithAuthor> {
    const { data, error } = await supabase
        .from('posts')
        .update(partial)
        .eq('id', id)
        .select(POST_WITH_AUTHOR_QUERY)
        .single()

    if (error) throw error
    return data as unknown as PostWithAuthor
}

export async function deletePost(id: string): Promise<void> {
    const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id)

    if (error) throw error
}