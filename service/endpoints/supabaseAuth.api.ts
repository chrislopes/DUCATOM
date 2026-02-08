import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Missing SUPABASE env vars');
}

export const supabaseAuth = axios.create({
    baseURL: SUPABASE_URL,
    headers: {
        apikey: SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
    },
});

export const supabaseEdgeFunction = (token: string) =>
    axios.create({
        baseURL: SUPABASE_URL,
        headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
