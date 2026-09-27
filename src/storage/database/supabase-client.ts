import { createClient, SupabaseClient } from '@supabase/supabase-js';

let envLoaded = false;

function loadEnv(): void {
  if (envLoaded) return;
  try {
    require('dotenv').config();
  } catch {
    // dotenv not available
  }
  envLoaded = true;
}

function getSupabaseClient(): SupabaseClient {
  loadEnv();

  const url = process.env.COZE_SUPABASE_URL;
  const key =
    process.env.COZE_SUPABASE_SERVICE_ROLE_KEY ||
    process.env.COZE_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('COZE_SUPABASE_URL and COZE_SUPABASE_ANON_KEY must be set');
  }

  return createClient(url, key, {
    db: { timeout: 60000 },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export { getSupabaseClient };
