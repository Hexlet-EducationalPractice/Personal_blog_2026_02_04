import { supabase } from '@/lib/supabase'

export async function uploadAvatar(file: File, userId: string): Promise<string> {
  const ext = file.name.split('.').pop()
  const filePath = `${userId}/${Date.now()}.${ext}`

  const { error } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true })

  if (error) throw error

  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
  return data.publicUrl
}

export async function deleteAvatar(url: string): Promise<void> {
  const filePath = url.split('avatars/')[1]

  const { error } = await supabase.storage.from('avatars').remove([filePath])

  if (error) throw error
}
