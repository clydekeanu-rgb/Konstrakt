import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("REACT_APP_SUPABASE_URL is not set in the environment");
}
if (!supabaseAnonKey) {
  throw new Error("REACT_APP_SUPABASE_ANON_KEY is not set in the environment");
}

// ---------- cookie-based storage adapter ----------
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

const cookieStorage = {
  getItem(key) {
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith(encodeURIComponent(key) + "="));
    if (!match) return null;
    return decodeURIComponent(match.split("=").slice(1).join("="));
  },

  setItem(key, value) {
    document.cookie = [
      `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
      `path=/`,
      `max-age=${COOKIE_MAX_AGE}`,
      `SameSite=Lax`,
    ].join("; ");
  },

  removeItem(key) {
    document.cookie = [
      `${encodeURIComponent(key)}=`,
      `path=/`,
      `max-age=0`,
      `SameSite=Lax`,
    ].join("; ");
  },
};

// ---------- Supabase client ----------
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: cookieStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
