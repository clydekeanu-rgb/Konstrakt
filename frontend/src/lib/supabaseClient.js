import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("REACT_APP_SUPABASE_URL is not set in the environment");
}
if (!supabaseAnonKey) {
  throw new Error("REACT_APP_SUPABASE_ANON_KEY is not set in the environment");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
