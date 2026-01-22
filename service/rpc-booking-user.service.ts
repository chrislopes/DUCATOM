import {
    ApproveOrDenyLessonUserRequest,
    cancelLessonMentorRequest,
    cancelLessonStudentRequest,
    createBookingStudentRequest,
} from '@/api/endpoints/rpc-booking';

// MENTOR/ALUNO APROVA OU NEGA A AGENDA COM O ALUNO QUE SOLICITOU SEM O MEET AINDA
export async function byApproveOrDenyLessonUserService(
    booking_id: number,
    action: 'approve' | 'deny' | 'negado_aluno',
    description?: string,
    mentor_id?: number,
    aluno_id?: number,
) {
    try {
        const data = await ApproveOrDenyLessonUserRequest(
            booking_id,
            action,
            description,
            mentor_id,
            aluno_id,
        );
        return { success: true, data };
    } catch (error: any) {
        return {
            success: false,
            message:
                error.response?.data?.message ||
                'Erro em Aceitar/Negar a aula com Mentor/aluno.',
        };
    }
}

// ALUNO FAZ O CANCELAMENTO DA AULA
export async function bycancelLessonStudentService(
    booking_id: number,
    aluno_id: number,
    description: string,
) {
    try {
        const data = await cancelLessonStudentRequest(
            booking_id,
            aluno_id,
            description,
        );
        return { success: true, data };
    } catch (error: any) {
        return {
            success: false,
            message:
                error.response?.data?.message ||
                'Erro em Cancelar a aula com Mentor.',
        };
    }
}

// MENTOR FAZ O CANCELAMENTO DA AULA
export async function bycancelLessonMentorService(
    booking_id: number,
    mentor_id: number,
    description: string,
) {
    try {
        const data = await cancelLessonMentorRequest(
            booking_id,
            mentor_id,
            description,
        );
        return { success: true, data };
    } catch (error: any) {
        return {
            success: false,
            message:
                error.response?.data?.message ||
                'Erro em Cancelar a aula com Aluno.',
        };
    }
}

// ALUNO CRIA AGENDAMENTO PARA MENTOR APROVAR OU NEGAR AULA (pendente_aprovacao)

export async function byCreateBookingStudentService(
    aluno_id: number,
    mentor_id: number,
    weekday_id: number,
    mentor_time_slot_id: number,
) {
    try {
        const data = await createBookingStudentRequest(
            aluno_id,
            mentor_id,
            weekday_id,
            mentor_time_slot_id,
        );
        return { success: true, data };
    } catch (error: any) {

        console.log(error.response.data.error);
        
        return {
            success: false,
            message:
                error.response?.data?.error ||
                'Erro em Criar agendamento com Mentor.',
        };
    }
}
