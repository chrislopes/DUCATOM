import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth-context';
import {
    postConfirmationClassService,
    searchPendingConfirmationService,
} from '@/service/dashboard-user.service';
import { PendingBooking } from '@/model/dashboard-model';

export function useClassConfirmation() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [pendingBookings, setPendingBookings] = useState<PendingBooking[]>(
        [],
    );
    const [currentIndex, setCurrentIndex] = useState(0);

    async function fetchPendingConfirmations(user_id: number) {
        if (!user?.role) return;

        setLoading(true);
        try {
            const response = await searchPendingConfirmationService(
                user_id,
                user.role,
            );

            if (!response.success) {
                toast.error(response.message);
                return;
            }

            setPendingBookings(response.data || []);
            setCurrentIndex(0);
        } catch (error: any) {
            toast.error(
                error?.message || 'Erro ao buscar pendências de confirmação.',
            );
        } finally {
            setLoading(false);
        }
    }

    async function confirmOrDenyBooking(
        bookingId: number,
        confirm: boolean,
        user_id: number,
    ) {
        if (!user?.role) return;

        setLoading(true);
        try {
            const response = await postConfirmationClassService(
                bookingId,
                user_id,
                user.role,
                confirm,
            );

            if (!response.success) {
                toast.error(response.message);
                return;
            }

            setPendingBookings((prev) =>
                prev.filter((b) => b.booking_id !== bookingId),
            );
        } catch (error: any) {
            toast.error(error?.message || 'Erro ao confirmar ou negar a aula.');
        } finally {
            setLoading(false);
        }
    }

    function goToNextBooking() {
        const nextIndex = currentIndex + 1;

        if (nextIndex < pendingBookings.length) {
            setCurrentIndex(nextIndex);
        } else {
            
            setPendingBookings([]);
            setCurrentIndex(0);
        }
    }

    const hasPendingConfirmation = pendingBookings.length > 0;
    const currentBooking = pendingBookings[currentIndex] || null;

    return {
        fetchPendingConfirmations,
        confirmOrDenyBooking,
        hasPendingConfirmation,
        currentBooking,
        pendingBookings,
        loading,
    };
}
