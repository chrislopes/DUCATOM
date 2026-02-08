import { supabaseAuth } from './supabaseAuth.api';

//BUSCA TODOS OS MODULOS DAS AULAS
export async function searchModulosRequest() {
    const url = '/rest/v1/modulos';

    const response = await supabaseAuth.get(url, {
        params: {
            select: '*',
        },
    });

    return response.data;
}

// BUSCA AS AULAS DO MODULO SELECIONADO E SEU STATUS PARA O MENTOR SELECIONADO
export async function searchLessonRequest(
    p_mentor_id: number,
    p_modulo_id: number,
) {
    const url = `/rest/v1/rpc/get_aulas_modulo_mentor`;
    const body = { p_mentor_id, p_modulo_id };

    const resp = await supabaseAuth.post<any>(url, body);
    return resp.data;
}

// BUSCA O PROGRESSO DAS AULAS DO MENTOR
export async function getMentorLessonRequest(
    aula_id: number,
    mentor_id: number,
) {
    const url = `/rest/v1/mentor_aulas?aula_id=eq.${aula_id}&mentor_id=eq.${mentor_id}&limit=1`;

    const resp = await supabaseAuth.get<any[]>(url);
    return resp.data?.[0] ?? null;
}

// REGISTRA QUE O MENTOR ABRIU A AULA PELA PRIMEIRA VEZ E UMA UNICA VEZ
export async function sendMentorLessonRequest(
    aula_id: number,
    mentor_id: number,
) {
    
    const existing = await getMentorLessonRequest(aula_id, mentor_id);

    if (existing) {
        return existing;
    }

   
    const url = `/rest/v1/mentor_aulas`;
    const body = { aula_id, mentor_id };

    const resp = await supabaseAuth.post<any>(url, body);
    return resp.data;
}

// MENTOR ENVIA O VIDEO DA AULA PARA O ADMIN
export async function updateMentorLessonStatusRequest(
    aula_id: number,
    mentor_id: number,
    status: string,
) {
    const url = `/rest/v1/mentor_aulas?aula_id=eq.${aula_id}&mentor_id=eq.${mentor_id}`;

    const body = { status };

    const resp = await supabaseAuth.patch(url, body);
    return resp.data;
}

//ADMIN NEGA OU APROVA A AULA DO MENTOR
export async function updateMentorLessonStatusFeedbackRequest(
    aula_id: number,
    mentor_id: number,
    status: 'aprovado' | 'negado',
    feedback_admin?: string,
) {
    const url = `/rest/v1/mentor_aulas?aula_id=eq.${aula_id}&mentor_id=eq.${mentor_id}`;

    const body = {
        status,
        feedback_admin,
    };

    const resp = await supabaseAuth.patch(url, body);
    return resp.data;
}
