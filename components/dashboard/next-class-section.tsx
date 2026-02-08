'use client';

import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';

import { ListBooking } from '@/model/list-bookings-model';

import { CardListBookingStudent } from './card-list-booking-student';
import { CardListBookingMentor } from './card-list-booking-mentor';
import { Spinner } from '../ui/spinner';

interface NextClassSectionProps {
    listBookings: ListBooking[];
    loading: boolean;
    onRefreshBookings: () => Promise<void>;
}

export function NextClassSection({
    listBookings,
    loading,
    onRefreshBookings,
}: NextClassSectionProps) {
    const { user } = useAuth();

    function StatusBadge({ status }: { status: string }) {
        const map: Record<string, string> = {
            pendente_aprovacao: 'bg-yellow-500/20 text-yellow-300',
            reservado: 'bg-purple-600/20 text-purple-300',
            negado_mentor: 'bg-stone-500/20 text-stone-300',
            negado_inatividade: 'bg-black text-white',
            cancelado_mentor: 'bg-red-800/20 text-red-300',
        };

        return (
            <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${
                    map[status] ?? 'bg-gray-500/20 text-gray-300'
                }`}
            >
                {status.replace('_', ' ')}
            </span>
        );
    }

    return (
        <section>
            {user?.role === 'STUDENT' && (
                <h2 className="text-white text-sm md:text-base font-medium mb-3">
                    Sua próxima Aula
                </h2>
            )}
            <Card className="bg-[#0a5491] border-[#0d6bb8] p-6 md:p-8 text-center">
              
                {loading && (
                    <div className="w-full flex justify-center items-center">
                        <Spinner className="size-20 text-[#f0e087] " />
                    </div>
                )}

                {user?.role === 'STUDENT' && !loading && (
                    <CardListBookingStudent
                        listBookings={listBookings}
                        onRefreshBookings={onRefreshBookings}
                        functionStatusBadge={(status) => (
                            <StatusBadge status={status} />
                        )}
                    />
                )}

               
                {user?.role === 'MENTOR' && !loading && (
                    <CardListBookingMentor
                        listBookings={listBookings}
                        onRefreshBookings={onRefreshBookings}
                        functionStatusBadge={(status) => (
                            <StatusBadge status={status} />
                        )}
                    />
                )}
            </Card>
        </section>
    );
}
