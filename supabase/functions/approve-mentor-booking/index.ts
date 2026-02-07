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
// FUNÇÃO AUXILIAR → FORMATAR DATA LOCAL (SEM UTC)
// ======================================================
function formatDateTimeLocal(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate(),
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
        date.getSeconds(),
    )}`;
}

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
// CONFIGURAÇÕES GOOGLE
// ======================================================
const GOOGLE_CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar';
const GOOGLE_WORKSPACE_USER = 'prime@ducatom.com.br';

// ======================================================
// EDGE FUNCTION → MENTOR APROVA AULA
// ======================================================
Deno.serve({ verifyJwt: false }, async (req) => {
    const origin = req.headers.get('origin');
    const corsHeaders = getCorsHeaders(origin);

    // ======================================================
    // PRE-FLIGHT (CORS)
    // ======================================================
    if (req.method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: corsHeaders,
        });
    }

    try {
        // ======================================================
        // VALIDAR MÉTODO
        // ======================================================
        if (req.method !== 'POST') {
            return new Response(
                JSON.stringify({ error: 'Método não permitido' }),
                {
                    status: 405,
                    headers: corsHeaders,
                },
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
                {
                    status: 400,
                    headers: corsHeaders,
                },
            );
        }

        const { booking_id, mentor_id, action, description } = body;

        if (!action) {
            return new Response(
                JSON.stringify({ error: 'action é obrigatório' }),
                {
                    status: 400,
                    headers: corsHeaders,
                },
            );
        }

        if (!booking_id || !mentor_id) {
            return new Response(
                JSON.stringify({ error: 'Campos obrigatórios ausentes' }),
                {
                    status: 400,
                    headers: corsHeaders,
                },
            );
        }

        // ======================================================
        // BUSCAR BOOKING (SEGURANÇA)
        // ======================================================
        const { data: booking, error: bookingFetchError } = await supabase
            .from('mentor_bookings')
            .select(
                `
        id,
        status,
        booking_date,
        mentor_id,
        aluno_id,
        mentor_time_slot_id
      `,
            )
            .eq('id', booking_id)
            .eq('mentor_id', mentor_id)
            .single();

        if (bookingFetchError || !booking) {
            return new Response(
                JSON.stringify({ error: 'Booking não encontrado' }),
                {
                    status: 404,
                    headers: corsHeaders,
                },
            );
        }

        if (booking.status !== 'pendente_aprovacao') {
            return new Response(
                JSON.stringify({
                    error: 'Esse booking não pode mais ser aprovado',
                }),
                {
                    status: 409,
                    headers: corsHeaders,
                },
            );
        }

        // ======================================================
        // BUSCAR HORÁRIO DO SLOT
        // ======================================================
        const { data: slot, error: slotError } = await supabase
            .from('mentor_time_slot')
            .select('start_time')
            .eq('id', booking.mentor_time_slot_id)
            .single();

        if (slotError || !slot) {
            return new Response(
                JSON.stringify({ error: 'Erro ao obter horário do mentor' }),
                {
                    status: 500,
                    headers: corsHeaders,
                },
            );
        }

        if (action === 'negado_aluno') {
            // ======================================================
            // SEGURANÇA: GARANTIR QUE É O ALUNO DO BOOKING
            // ======================================================
            const { aluno_id } = body;

            if (!aluno_id) {
                return new Response(
                    JSON.stringify({ error: 'aluno_id é obrigatório' }),
                    {
                        status: 400,
                        headers: corsHeaders,
                    },
                );
            }

            if (!description || description.trim().length < 5) {
                return new Response(
                    JSON.stringify({
                        error: 'Descrição é obrigatória para negar a aula',
                    }),
                    {
                        status: 400,
                        headers: corsHeaders,
                    },
                );
            }

            if (booking.aluno_id !== aluno_id) {
                return new Response(
                    JSON.stringify({
                        error: 'Aluno não autorizado para este booking',
                    }),
                    {
                        status: 403,
                        headers: corsHeaders,
                    },
                );
            }

            // ======================================================
            // ATUALIZAR STATUS PARA NEGADO_ALUNO
            // ======================================================
            const { error: updateError } = await supabase
                .from('mentor_bookings')
                .update({
                    status: 'negado_aluno',
                    description,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', booking_id);

            if (updateError) {
                return new Response(
                    JSON.stringify({
                        error: 'Erro ao negar booking pelo aluno',
                    }),
                    {
                        status: 500,
                        headers: corsHeaders,
                    },
                );
            }

            await refundAlunoCredit(booking.aluno_id);

            return new Response(
                JSON.stringify({
                    success: true,
                    message: 'Booking negado pelo aluno com sucesso',
                }),
                {
                    status: 200,
                    headers: corsHeaders,
                },
            );
        }

        if (action === 'deny') {
            if (!description || description.trim().length < 5) {
                return new Response(
                    JSON.stringify({
                        error: 'Descrição é obrigatória para negar a aula',
                    }),
                    {
                        status: 400,
                        headers: corsHeaders,
                    },
                );
            }

            const { error: updateError } = await supabase
                .from('mentor_bookings')
                .update({
                    status: 'negado_mentor',
                    description,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', booking_id);

            if (updateError) {
                return new Response(
                    JSON.stringify({
                        error: 'Erro ao negar booking pelo mentor',
                    }),
                    {
                        status: 500,
                        headers: corsHeaders,
                    },
                );
            }

            // DEVOLVE CRÉDITO AO ALUNO
            await refundAlunoCredit(booking.aluno_id);

            return new Response(
                JSON.stringify({
                    success: true,
                    message: 'Booking negado pelo mentor',
                }),
                {
                    status: 200,
                    headers: corsHeaders,
                },
            );
        }

        // ======================================================
        // APROVAR → CRIAR GOOGLE MEET
        // ======================================================
        if (action !== 'approve') {
            return new Response(JSON.stringify({ error: 'Action inválida' }), {
                status: 400,
                headers: corsHeaders,
            });
        }

        // ======================================================
        // MONTAR DATA/HORA LOCAL
        // ======================================================
        const startDateTime = new Date(
            `${booking.booking_date}T${slot.start_time}`,
        );

        const endDateTime = new Date(startDateTime);
        endDateTime.setMinutes(endDateTime.getMinutes() + 60);

        const startLocal = formatDateTimeLocal(startDateTime);
        const endLocal = formatDateTimeLocal(endDateTime);

        // ======================================================
        // GOOGLE SERVICE ACCOUNT
        // ======================================================
        const rawKey = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY');

        if (!rawKey) {
            return new Response(
                JSON.stringify({
                    error: 'GOOGLE_SERVICE_ACCOUNT_KEY não configurado',
                }),
                {
                    status: 500,
                    headers: corsHeaders,
                },
            );
        }

        const serviceAccount = JSON.parse(rawKey);
        const now = Math.floor(Date.now() / 1000);

        const jwt = await new SignJWT({
            iss: serviceAccount.client_email,
            scope: GOOGLE_CALENDAR_SCOPE,
            aud: 'https://oauth2.googleapis.com/token',
            iat: now,
            exp: now + 60 * 60,
            sub: GOOGLE_WORKSPACE_USER,
        })
            .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
            .sign(await importPKCS8(serviceAccount.private_key, 'RS256'));

        // ======================================================
        // OBTER ACCESS TOKEN
        // ======================================================
        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                assertion: jwt,
            }),
        });

        const tokenData = await tokenRes.json();

        if (!tokenRes.ok || !tokenData.access_token) {
            return new Response(
                JSON.stringify({
                    error: 'Erro ao obter token do Google',
                    details: tokenData,
                }),
                {
                    status: 500,
                    headers: corsHeaders,
                },
            );
        }

        // ======================================================
        // CRIAR EVENTO COM GOOGLE MEET
        // ======================================================
        const eventPayload = {
            summary: 'Aula Ducatom',
            description: `Mentoria aprovada (booking ${booking.id})`,
            start: {
                dateTime: startLocal,
                timeZone: 'America/Sao_Paulo',
            },
            end: {
                dateTime: endLocal,
                timeZone: 'America/Sao_Paulo',
            },
            conferenceData: {
                createRequest: {
                    requestId: crypto.randomUUID(),
                    conferenceSolutionKey: {
                        type: 'hangoutsMeet',
                    },
                },
            },
        };

        const eventRes = await fetch(
            'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${tokenData.access_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventPayload),
            },
        );

        const eventData = await eventRes.json();

        if (!eventRes.ok) {
            return new Response(
                JSON.stringify({
                    error: 'Erro ao criar evento no Google Calendar',
                    details: eventData,
                }),
                {
                    status: 500,
                    headers: corsHeaders,
                },
            );
        }

        const meetLink =
            eventData.hangoutLink ??
            eventData.conferenceData?.entryPoints?.find(
                (e: any) => e.entryPointType === 'video',
            )?.uri ??
            null;

        const googleEventId = eventData.id ?? null;

        // ======================================================
        // ATUALIZAR BOOKING → reservado + video_link
        // ======================================================
        const { error: updateError } = await supabase
            .from('mentor_bookings')
            .update({
                status: 'reservado',
                video_link: meetLink,
                google_event_id: googleEventId,
                updated_at: new Date().toISOString(),
            })
            .eq('id', booking.id);

        if (updateError) {
            return new Response(
                JSON.stringify({
                    error: 'Meet criado, mas erro ao atualizar booking',
                    details: updateError.message,
                }),
                {
                    status: 500,
                    headers: corsHeaders,
                },
            );
        }

        // ======================================================
        // SUCESSO
        // ======================================================
        return new Response(
            JSON.stringify({
                success: true,
                message:
                    'Aula aprovada com sucesso! O link da aula já está disponível.',
                booking_id: booking.id,
                meet_link: meetLink,
                starts_at: startDateTime,
                ends_at: endDateTime,
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
