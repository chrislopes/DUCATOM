'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Loader2,
    CheckCircle2,
    XCircle,
    CalendarDays,
    Clock,
} from 'lucide-react';

export interface PendingBooking {
    booking_id: number;
    booking_date: string;
    start_time: string;
}

interface ModalClassConfirmationProps {
    open: boolean;
    bookings: PendingBooking[];
    loading?: boolean;
    onConfirm: (bookingId: number) => void;
    onDeny: (bookingId: number) => void;
}

export function ModalClassConfirmation({
    open,
    bookings,
    loading,
    onConfirm,
    onDeny,
}: ModalClassConfirmationProps) {
    return (
        <Dialog open={open}>
            <DialogContent
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
                className="w-[95vw] max-w-lg p-0 border-none overflow-hidden rounded-2xl shadow-2xl sm:w-full [&>button]:hidden"
                style={{ backgroundColor: '#083d71' }}
            >
                <DialogHeader className="px-4 pt-6 pb-4 sm:px-6 sm:pt-8 sm:pb-6 text-center space-y-3">
                    <div
                        className="mx-auto w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-2"
                        style={{ backgroundColor: '#f0e087' }}
                    >
                        <CalendarDays
                            className="w-7 h-7 sm:w-8 sm:h-8"
                            style={{ color: '#083d71' }}
                        />
                    </div>
                    <DialogTitle
                        className="text-xl text-center sm:text-2xl font-bold tracking-tight"
                        style={{ color: '#f0e087' }}
                    >
                        Confirmação de Aula
                    </DialogTitle>
                    <DialogDescription
                        className="text-sm text-center sm:text-base opacity-90 max-w-xs mx-auto leading-relaxed"
                        style={{ color: '#f0e087' }}
                    >
                        Você precisa confirmar ou negar a conclusão das aulas
                        abaixo para continuar.
                    </DialogDescription>
                </DialogHeader>

                <div className="px-4 pb-6 sm:px-6 sm:pb-8">
                    <ScrollArea className="h-[40vh] sm:h-[45vh] max-h-80 pr-3 sm:pr-4">
                        <div className="space-y-3 sm:space-y-4">
                            {bookings.map((booking) => (
                                <div
                                    key={booking.booking_id}
                                    className="rounded-xl p-4 sm:p-5 transition-all duration-200 hover:scale-[0.99]"
                                    style={{
                                        backgroundColor:
                                            'rgba(240, 224, 135, 0.1)',
                                        border: '1px solid rgba(240, 224, 135, 0.2)',
                                    }}
                                >
                                    <div className="flex flex-col gap-4">
                                        
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <CalendarDays
                                                        className="w-4 h-4 flex-shrink-0"
                                                        style={{
                                                            color: '#f0e087',
                                                        }}
                                                    />
                                                    <span
                                                        className="font-semibold text-sm sm:text-base truncate"
                                                        style={{
                                                            color: '#f0e087',
                                                        }}
                                                    >
                                                        {new Date(
                                                            booking.booking_date,
                                                        ).toLocaleDateString(
                                                            'pt-BR',
                                                            {
                                                                weekday:
                                                                    'short',
                                                                day: '2-digit',
                                                                month: 'short',
                                                                year: 'numeric',
                                                            },
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock
                                                        className="w-4 h-4 flex-shrink-0 opacity-80"
                                                        style={{
                                                            color: '#f0e087',
                                                        }}
                                                    />
                                                    <span
                                                        className="text-xs sm:text-sm opacity-80"
                                                        style={{
                                                            color: '#f0e087',
                                                        }}
                                                    >
                                                        Início:{' '}
                                                        {booking.start_time.slice(
                                                            0,
                                                            5,
                                                        )}
                                                        h · Duração: 1h
                                                    </span>
                                                </div>
                                            </div>
                                            <span
                                                className="text-[10px] sm:text-xs font-medium px-2 py-1 rounded-full flex-shrink-0"
                                                style={{
                                                    backgroundColor:
                                                        'rgba(240, 224, 135, 0.2)',
                                                    color: '#f0e087',
                                                }}
                                            >
                                                Pendente
                                            </span>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                            <Button
                                                className="flex-1 h-10 sm:h-11 text-sm font-semibold rounded-lg transition-all duration-200 hover:bg-green-400 active:scale-[0.98] cursor-pointer bg-green-500 text-white"
                                                onClick={() =>
                                                    onConfirm(
                                                        booking.booking_id,
                                                    )
                                                }
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                ) : (
                                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                                )}
                                                Confirmar
                                            </Button>
                                            <Button
                                                className="flex-1 h-10 sm:h-11 text-sm font-semibold text-white rounded-lg transition-all duration-200 hover:bg-red-600 active:scale-[0.98] cursor-pointer bg-red-500"
                                                onClick={() =>
                                                    onDeny(booking.booking_id)
                                                }
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                ) : (
                                                    <XCircle className="w-4 h-4 mr-2" />
                                                )}
                                                Negar
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}
