import { ListBooking } from '@/model/list-bookings-model';
import { byBookingsListSummaryService } from '@/service/list-summary-bookings.service';

import { useState } from 'react';
import { toast } from 'sonner';

export function useBookingsListSummary() {
    const [loading, setLoading] = useState(false);
    const [listBookings, setListBookings] = useState<ListBooking[]>([]);

    async function byBookingsListSummary(p_user_id: number) {
        setLoading(true);
        try {
            if (!p_user_id) {
                throw new Error('ID do usuário não encontrado');
            }
         
            
            const response = await byBookingsListSummaryService(p_user_id);

            if (!response.success) {
                toast.error(
                    response.message ||
                        'Erro ao buscar lista de reservas/bookings.',
                );
                return null;
            }
            
            setListBookings(response.data || []);
            return response.data;
        } catch (error: any) {
            toast.error(
                error?.message ||
                    'Erro ao buscar lista de reserva/bookings do Mentor/Aluno.',
            );
            return null;
        } finally {
            setLoading(false);
        }
    }

    return {
        byBookingsListSummary,
        listBookings,
        loading,
    };
}
