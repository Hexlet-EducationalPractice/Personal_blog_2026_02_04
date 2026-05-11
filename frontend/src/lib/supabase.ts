import { createClient } from '@supabase/supabase-js'
import { env } from './env'
import type { Database } from '@/types/database'

export const supabase = createClient<Database>(env.supabaseUrl, env.supabaseAnonKey)
