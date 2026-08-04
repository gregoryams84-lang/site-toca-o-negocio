import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://tldmtouhyiglqszwxdmc.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_dhQZyHqufAU9vfR2KLEkHQ_hdx5c5ki';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
