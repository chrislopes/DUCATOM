/// <reference types="jsr:@supabase/functions-js/edge-runtime.d.ts" />

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SignJWT, importPKCS8 } from 'https://esm.sh/jose@5';

//DEVOLVE O CREDITO PARA O ALUNO MEDIANTE SITUACOES
async function refundAlunoCredit(aluno_id: number) {
    const { error } = await supabase.rpc('increment_aluno_credit', {
        p_aluno_id: aluno_id,
        p_value: 1,
    });

    if (error) {
        throw new Error('Erro ao devolver crédito ao aluno');
    }
}

// ======================================================
// CORS
// ======================================================
function getCorsHeaders(origin: string | null): Record<string, string> {
     const allowedOrigins = [
        'http://localhost:3000',
        'https://ducatom.vercel.app',
    ];

    const allowOrigin =
        origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
    return {
        'Access-Control-Allow-Origin': allowOrigin,
        'Access-Control-Allow-Headers':
            'authorization, apikey, content-type, x-client-info',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
    };
}

const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

const GOOGLE_CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar';
const GOOGLE_WORKSPACE_USER = 'prime@ducatom.com.br';

Deno.serve({ verifyJwt: false }, async (req) => {
    const origin = req.headers.get('origin');
    const corsHeaders = getCorsHeaders(origin);

    try {
        // ======================================================
        // PRE-FLIGHT (CORS)
        // ======================================================
        if (req.method === 'OPTIONS') {
            return new Response(null, {
                status: 204,
                headers: corsHeaders,
            });
        }

        if (req.method !== 'POST') {
            return new Response(
                JSON.stringify({ error: 'Método não permitido' }),
                { status: 405, headers: corsHeaders },
            );
        }

        const body = await req.json();

        const { booking_id, mentor_id, aluno_id, description } = body;

        if (!booking_id || !description) {
            return new Response(
                JSON.stringify({
                    error: 'booking_id e description são obrigatórios',
                }),
                { status: 400, headers: corsHeaders },
            );
        }

        if (!mentor_id && !aluno_id) {
            return new Response(
                JSON.stringify({
                    error: 'mentor_id ou aluno_id é obrigatório',
                }),
                { status: 400, headers: corsHeaders },
            );
        }

        // ======================================================
        // BUSCAR BOOKING
        // ======================================================
        const { data: booking, error: bookingError } = await supabase
            .from('mentor_bookings')
            .select('*')
            .eq('id', booking_id)
            .single();

        if (bookingError || !booking) {
            return new Response(
                JSON.stringify({ error: 'Agendamento não encontrado' }),
                { status: 404, headers: corsHeaders },
            );
        }

        if (booking.status !== 'reservado') {
            return new Response(
                JSON.stringify({ error: 'Aula não pode mais ser cancelada' }),
                { status: 400, headers: corsHeaders },
            );
        }

        // ======================================================
        // DEFINIR STATUS
        // ======================================================
        let newStatus: string;

        if (mentor_id && booking.mentor_id !== mentor_id) {
            return new Response(
                JSON.stringify({ error: 'Mentor não autorizado' }),
                { status: 403, headers: corsHeaders },
            );
        }

        if (aluno_id && booking.aluno_id !== aluno_id) {
            return new Response(
                JSON.stringify({ error: 'Aluno não autorizado' }),
                { status: 403, headers: corsHeaders },
            );
        }

        if (mentor_id) newStatus = 'cancelado_mentor';
        else newStatus = 'cancelado_aluno';

        // ======================================================
        // REMOVER EVENTO DO GOOGLE MEET
        // ======================================================
        if (booking.google_event_id) {
            const rawKey = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY')!;
            const serviceAccount = JSON.parse(rawKey);

            const now = Math.floor(Date.now() / 1000);

            const jwt = await new SignJWT({
                iss: serviceAccount.client_email,
                scope: GOOGLE_CALENDAR_SCOPE,
                aud: 'https://oauth2.googleapis.com/token',
                iat: now,
                exp: now + 3600,
                sub: GOOGLE_WORKSPACE_USER,
            })
                .setProtectedHeader({ alg: 'RS256' })
                .sign(await importPKCS8(serviceAccount.private_key, 'RS256'));

            const tokenRes = await fetch(
                'https://oauth2.googleapis.com/token',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        grant_type:
                            'urn:ietf:params:oauth:grant-type:jwt-bearer',
                        assertion: jwt,
                    }),
                },
            );

            const token = await tokenRes.json();

            if (token.access_token) {
                await fetch(
                    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${booking.google_event_id}`,
                    {
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${token.access_token}`,
                        },
                    },
                );
            }
        }

        // ======================================================
        // ATUALIZAR BOOKING
        // ======================================================
        await supabase
            .from('mentor_bookings')
            .update({
                status: newStatus,
                description,
                updated_at: new Date().toISOString(),
            })
            .eq('id', booking_id);

        // ======================================================
        // REGRA DE DEVOLUÇÃO DE CRÉDITO
        // ======================================================
        let shouldRefund = false;

        // Mentor cancelou → sempre devolve
        if (newStatus === 'cancelado_mentor') {
            shouldRefund = true;
        }

        // Aluno cancelou → só se >= 24h antes
        if (newStatus === 'cancelado_aluno') {
            // Buscar horário do slot
            const { data: slot } = await supabase
                .from('mentor_time_slot')
                .select('start_time')
                .eq('id', booking.mentor_time_slot_id)
                .single();

            if (slot) {
                const bookingDateTime = new Date(
                    `${booking.booking_date}T${slot.start_time}`,
                );

                const now = new Date();
                const diffHours =
                    (bookingDateTime.getTime() - now.getTime()) /
                    (1000 * 60 * 60);

                if (diffHours >= 24) {
                    shouldRefund = true;
                }
            }
        }

        // Executar devolução
        if (shouldRefund) {
            await refundAlunoCredit(booking.aluno_id);
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: 'Aula cancelada com sucesso',
                status: newStatus,
            }),
            {
                status: 200,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json',
                },
            },
        );
    } catch (err: any) {
        return new Response(
            JSON.stringify({
                error: 'Erro interno',
                details: err.message,
            }),
            { status: 500, headers: corsHeaders },
        );
    }
});
