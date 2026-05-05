import dotenv from 'dotenv';
import path from 'node:path';

const envPath = path.resolve(__dirname, '../../.env');

dotenv.config({ path: envPath });

const getRequiredEnv = (key: string): string => {
  const value = process.env[key];
  if (!value || typeof value !== 'string') {
    throw new Error(`Backend: Missing required environment variable "${key}".`);
  }
  return value;
};

export const env = {
  supabaseUrl: getRequiredEnv('SUPABASE_URL'),
  supabaseAnonKey: getRequiredEnv('SUPABASE_ANON_KEY'),
  port: parseInt(getRequiredEnv('PORT'), 10),
} as const;