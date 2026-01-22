import {
    byApproveOrDenyLessonUserService,
    bycancelLessonMentorService,
    bycancelLessonStudentService,
    byCreateBookingStudentService,
} from '@/service/rpc-booking-user.service';

import { useState } from 'react';
import { toast } from 'sonner';

export function useRPC_Bookings() {
    const [loading, setLoading] = useState(false);

    //MENTOR APROVA OU NEGA A AULA COM ALUNO
    async function mentorApproveOrDenyLesson(
        booking_id: number,
        action: 'approve' | 'deny' | 'negado_aluno',
        description?: string,
        mentor_id?: number,
    ) {
        setLoading(true);
        try {
            if (!mentor_id || !booking_id) {
                throw new Error('ID do Mentor ou Booking não encontrado');
            }

            // MENTOR APROVA OU NEGA BOOKING
            const response = await byApproveOrDenyLessonUserService(
                booking_id,
                action,
                description,
                mentor_id,
            );

            if (!response.success) {
                toast.error(
                    response.message || 'Erro ao Aprovar/Negar Aula com Aluno.',
                );
                return null;
            } else {
                toast.success(response.data.message);
            }

            return response.data;
        } catch (error: any) {
            toast.error(
                error?.message || 'Erro ao Aprovar/Negar Aula com Aluno.',
            );
            return null;
        } finally {
            setLoading(false);
        }
    }

    //ALUNO NEGA AULA COM MENTOR
    async function studentApproveOrDenyLesson(
        booking_id: number,
        action: 'approve' | 'deny' | 'negado_aluno',
        description?: string,
        mentor_id?: number,
        aluno_id?: number,
    ) {
        setLoading(true);
        try {
            if (!mentor_id || !booking_id || !aluno_id) {
                throw new Error(
                    'ID do Mentor ou Booking ou aluno não encontrado',
                );
            }

            // ALUNO NEGA BOOKING COM MENTOR
            const response = await byApproveOrDenyLessonUserService(
                booking_id,
                action,
                description,
                mentor_id,
                aluno_id,
            );

            if (!response.success) {
                toast.error(
                    response.message || 'Erro ao Negar Aula com Mentor.',
                );
                return null;
            } else {
                toast.success(response.data.message);
            }

            return response.data;
        } catch (error: any) {
            toast.error(error?.message || 'Erro ao Negar Aula com Mentor.');
            return null;
        } finally {
            setLoading(false);
        }
    }

    //ALUNO CANCELA AULA COM MENTOR
    async function studentCancelLesson(
        booking_id: number,
        aluno_id: number,
        description: string,
    ) {
        setLoading(true);
        try {
            if (!booking_id || !aluno_id) {
                throw new Error('ID do Aluno ou Booking não encontrado');
            }

            const response = await bycancelLessonStudentService(
                booking_id,
                aluno_id,
                description,
            );

            if (!response.success) {
                toast.error(
                    response.message || 'Erro ao Cancelar Aula com Mentor.',
                );
                return null;
            } else {
                toast.success(response.data.message);
            }

            return response.data;
        } catch (error: any) {
            toast.error(error?.message || 'Erro ao Cancelar Aula com Mentor.');
            return null;
        } finally {
            setLoading(false);
        }
    }

    //MENTOR CANCELA AULA COM ALUNO
    async function mentorCancelLesson(
        booking_id: number,
        mentor_id: number,
        description: string,
    ) {
        setLoading(true);
        try {
            if (!booking_id || !mentor_id) {
                throw new Error('ID do Mentor ou Booking não encontrado');
            }

            const response = await bycancelLessonMentorService(
                booking_id,
                mentor_id,
                description,
            );

            if (!response.success) {
                toast.error(
                    response.message || 'Erro ao Cancelar Aula com Aluno.',
                );
                return null;
            } else {
                toast.success(response.data.message);
            }

            return response.data;
        } catch (error: any) {
            toast.error(error?.message || 'Erro ao Cancelar Aula com Aluno.');
            return null;
        } finally {
            setLoading(false);
        }
    }

    // ALUNO CRIA AGENDAMENTO PARA MENTOR APROVAR OU NEGAR AULA (pendente_aprovacao)
    async function studentBookingWithMentor(
        aluno_id: number,
        mentor_id: number,
        weekday_id: number,
        mentor_time_slot_id: number,
    ) {
        setLoading(true);
        try {
            // if (!booking_id || !mentor_id) {
            //     throw new Error('ID do Mentor ou Booking não encontrado');
            // }

            const response = await byCreateBookingStudentService(
                aluno_id,
                mentor_id,
                weekday_id,
                mentor_time_slot_id,
            );

            if (!response.success) {
                toast.error(response.message);
                return null;
            } else {
                toast.success(response.data.message);
            }

            return response.data;
        } catch (error: any) {
            toast.error(error?.message || 'Erro em Marcar aula com o Mentor');
            return null;
        } finally {
            setLoading(false);
        }
    }

    return {
        mentorApproveOrDenyLesson,
        studentApproveOrDenyLesson,
        studentCancelLesson,
        mentorCancelLesson,
        studentBookingWithMentor,
        loading,
    };
}
