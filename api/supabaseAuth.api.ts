// src/api/supabaseAuth.api.ts
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_AUTHORIZATION = process.env.NEXT_PUBLIC_SUPABASE_AUTHORIZATION!;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Missing SUPABASE env vars');
}

export const supabaseAuth = axios.create({
    baseURL: SUPABASE_URL,
    headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: SUPABASE_AUTHORIZATION,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
    },
    // não forçar withCredentials aqui — ajuste conforme necessidade de cookies
});

//APENAS PARA REQUISICOES DE EDGE FUNCTIONS
export const supabaseEdgeFunction = axios.create({
    baseURL: SUPABASE_URL,
    headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: SUPABASE_AUTHORIZATION,
        'Content-Type': 'application/json',
    },
    
});

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
