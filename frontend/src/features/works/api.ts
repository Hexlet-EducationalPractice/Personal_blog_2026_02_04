import  { supabase } from '@/lib/supabase'; 
import type { Work } from './types';

export const getWorks = async (): Promise<Work[]> => {

const { data, error } = await supabase
  .from('works')
  .select('*')
  .order('created_at', { ascending: false });
if (error) { throw new Error(error.message);
}

  return data as Work[];
};