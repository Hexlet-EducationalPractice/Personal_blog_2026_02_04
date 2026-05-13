import { supabase } from '@/lib/supabase'
import type { Story } from './types'

export async function getStories(): Promise<Story[]> {
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error

  return data
}
