import { byBookingsListSummaryRequest } from '@/api/endpoints/list-bookings-summary';

export async function byBookingsListSummaryService(p_user_id: number) {
    try {
        const data = await byBookingsListSummaryRequest(p_user_id);
        return { success: true, data };
    } catch (error: any) {
        return {
            success: false,
            message:
                error.response?.data?.message ||
                'Erro ao buscar lista de reserva/bookings do Mentor/aluno.',
        };
    }
}
