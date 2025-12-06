// js/supabase-config.js

const SUPABASE_URL = "https://mldkmjrgoofavsnkbqqb.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_LVQFXUiMEMq6AjkFW0PEdw__9xZY_IX";

window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,       // <--- SUPER IMPORTANT
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

console.log("Supabase configured successfully.");
