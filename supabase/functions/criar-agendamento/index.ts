/// <reference types="jsr:@supabase/functions-js/edge-runtime.d.ts" />

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SignJWT, importPKCS8 } from 'https://esm.sh/jose@5';

// ======================================================
// CLIENTE SUPABASE (SERVICE ROLE)
// ======================================================
const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

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

// ======================================================
// EDGE FUNCTION → ALUNO SOLICITA AULA
// ======================================================
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

        // ======================================================
        // VALIDAR MÉTODO
        // ======================================================
        if (req.method !== 'POST') {
            return new Response(
                JSON.stringify({ error: 'Método não permitido' }),
                { status: 405, headers: corsHeaders },
            );
        }

        // ======================================================
        // LER BODY
        // ======================================================
        let body: any;
        try {
            body = await req.json();
        } catch {
            return new Response(
                JSON.stringify({ error: 'Body inválido ou vazio' }),
                { status: 400, headers: corsHeaders },
            );
        }

        const { aluno_id, mentor_id, weekday_id, mentor_time_slot_id } = body;

        if (
            !aluno_id ||
            !mentor_id ||
            weekday_id === undefined ||
            !mentor_time_slot_id
        ) {
            return new Response(
                JSON.stringify({
                    error: 'Campos obrigatórios ausentes',
                    expected: [
                        'aluno_id',
                        'mentor_id',
                        'weekday_id',
                        'mentor_time_slot_id',
                        'booking_date',
                    ],
                }),
                { status: 400, headers: corsHeaders },
            );
        }

        // ======================================================
        // CRIAR BOOKING (STATUS = pendente_aprovacao POR DEFAULT)
        // ======================================================
        const { data: booking, error: bookingError } = await supabase
            .rpc('create_mentor_booking', {
                p_aluno_id: aluno_id,
                p_mentor_id: mentor_id,
                p_mentor_weekday_id: weekday_id,
                p_mentor_time_slot_id: mentor_time_slot_id,
            })
            .single();

        // ======================================================
        // SLOT JÁ OCUPADO / ERRO DE CONFLITO
        // ======================================================
        if (bookingError) {
            const message =
                bookingError.message === 'Crédito insuficiente'
                    ? 'Você não possui créditos suficientes para agendar essa aula'
                    : bookingError.message === 'Horário indisponível'
                      ? 'Esse horário acabou de ser solicitado por outro aluno'
                      : 'Erro ao criar agendamento';

            return new Response(JSON.stringify({ error: message }), {
                status: 400,
                headers: corsHeaders,
            });
        }

        // ======================================================
        // SUCESSO
        // ======================================================
        return new Response(
            JSON.stringify({
                success: true,
                message:
                    'Solicitação enviada com sucesso! O mentor precisa aprovar o horário. Você será avisado assim que ele responder.',
                booking_id: booking.id,
                status: booking.status, // pendente_aprovacao
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
        console.error(err);
        return new Response(
            JSON.stringify({
                error: 'Erro interno inesperado',
                details: err.message,
            }),
            { status: 500, headers: corsHeaders },
        );
    }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/criar-agendamento' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
