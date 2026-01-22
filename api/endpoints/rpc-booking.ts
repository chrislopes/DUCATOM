import { supabaseEdgeFunction } from '../supabaseAuth.api';

// MENTOR/ALUNO APROVA OU NEGA A AGENDA COM O ALUNO QUE SOLICITOU SEM O MEET AINDA
export async function ApproveOrDenyLessonUserRequest(
    booking_id: number,
    action: 'approve' | 'deny' | 'negado_aluno',
    description?: string,
    mentor_id?: number,
    aluno_id?: number,
) {
    const url = `/functions/v1/approve-mentor-booking`;
    const body = { booking_id, mentor_id, aluno_id, action, description };

    const resp = await supabaseEdgeFunction.post<any>(url, body);
    return resp.data;
}

// ALUNO FAZ O CANCELAMENTO DA AULA
export async function cancelLessonStudentRequest(
    booking_id: number,
    aluno_id: number,
    description: string,
) {
    const url = `/functions/v1/cancel-booking`;
    const body = { booking_id, aluno_id, description };

    const resp = await supabaseEdgeFunction.post<any>(url, body);
    return resp.data;
}

// MENTOR FAZ O CANCELAMENTO DA AULA
export async function cancelLessonMentorRequest(
    booking_id: number,
    mentor_id: number,
    description: string,
) {
    const url = `/functions/v1/cancel-booking`;
    const body = { booking_id, mentor_id, description };

    const resp = await supabaseEdgeFunction.post<any>(url, body);
    return resp.data;
}


// ALUNO CRIA AGENDAMENTO PARA MENTOR APROVAR OU NEGAR AULA (pendente_aprovacao)
export async function createBookingStudentRequest(
    aluno_id: number,
    mentor_id: number,
    weekday_id: number,
    mentor_time_slot_id: number,
) {
    const url = `/functions/v1/criar-agendamento`;
    const body = { aluno_id, mentor_id, weekday_id, mentor_time_slot_id };

    const resp = await supabaseEdgeFunction.post<any>(url, body);
    return resp.data;
}
