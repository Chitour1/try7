import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rduqhzkypzlwjxmarunv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkdXFoemt5cHpsd2p4bWFydW52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMjcyMzIsImV4cCI6MjA2OTgwMzIzMn0.8i9pqDiKY3MKLR5j2cGak18lqR7T34xDZxGIqRbXMWA';

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and Anon Key must be provided.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
