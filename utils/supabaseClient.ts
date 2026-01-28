import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nkdlrycrrafrsglptkyk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rZGxyeWNycmFmcnNnbHB0a3lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNTExMjEsImV4cCI6MjA4MDYyNzEyMX0.KAC5KsGMcCsrb3DJ-BPZIUaqbXEL2V2RHwnmOkvNQhc';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    console.warn("Mancano le variabili d'ambiente Supabase. Le funzionalità database non saranno disponibili.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
