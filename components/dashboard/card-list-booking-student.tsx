'use client';

import { ListBooking, CancelAction } from '@/model/list-bookings-model';
import { Calendar, Clock, User, CalendarX, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ReactNode, useState } from 'react';
import Image from 'next/image';
import { StudentCancelBookingModal } from './StudentCancelBookingModal';
import { useRPC_Bookings } from '@/hooks/use-RPC_bookings';

export interface CardListBookingProps {
    listBookings: ListBooking[];
    functionStatusBadge: (status: string) => ReactNode;
    onRefreshBookings: () => Promise<void>;
}

type StudentBookingStatus =
    | 'pendente_aprovacao'
    | 'reservado'
    | 'negado_inatividade'
    | 'negado_mentor'
    | 'cancelado_mentor';

export function CardListBookingStudent({
    listBookings,
    functionStatusBadge,
    onRefreshBookings,
}: CardListBookingProps) {
    const router = useRouter();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState<CancelAction | null>(null);
    const [selectedBookingId, setSelectedBookingId] = useState<any | null>(
        null,
    );

    const {
        studentApproveOrDenyLesson,
        studentCancelLesson,
        loading: ModalLoading,
    } = useRPC_Bookings();

    function renderStudentActions(
        status: StudentBookingStatus,
        booking: ListBooking,
    ) {
        switch (status) {
            case 'pendente_aprovacao':
                return (
                    <Button
                        variant="destructive"
                        size="sm"
                        className="rounded-lg cursor-pointer"
                        onClick={() =>
                            openStudentCancelModal('desistir', booking)
                        }
                    >
                        Desistir da aula
                    </Button>
                );

            case 'reservado':
                return (
                    <Button
                        variant="destructive"
                        size="sm"
                        className="rounded-lg cursor-pointer"
                        onClick={() =>
                            openStudentCancelModal('cancelar', booking)
                        }
                    >
                        Cancelar aula
                    </Button>
                );

            default:
                return null;
        }
    }

    function renderDescription(
        status: StudentBookingStatus,
        description?: string,
    ) {
        if (
            (status === 'negado_mentor' ||
                status === 'cancelado_mentor' ||
                status === 'negado_inatividade') &&
            description
        ) {
            return (
                <p className="text-sm text-white bg-white/5 p-3 rounded-lg border border-white/10">
                    {description}
                </p>
            );
        }

        return null;
    }

    function renderMeetLink(status: string, video_link?: string) {
        if (status !== 'reservado' || !video_link) return null;

        return (
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
                <a
                    href={video_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-300 text-sm font-medium underline underline-offset-2 hover:text-emerald-200 w-full flex items-center transition"
                >
                    <Image
                        src="/google-meet.png"
                        alt="Google Meet"
                        width={80}
                        height={80}
                        className="shrink-0"
                    />
                    Entrar na videochamada
                </a>
            </div>
        );
    }

    function openStudentCancelModal(action: CancelAction, bookingId: any) {
        setModalAction(action);
        setSelectedBookingId(bookingId);
        setModalOpen(true);
    }

    function formatDateBR(dateString: string) {
        const date = new Date(dateString + 'T00:00:00'); // evita bug de fuso
        return date.toLocaleDateString('pt-BR');
    }

    return (
        <>
            {/* SEM EVENTOS */}
            {listBookings?.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                        <CalendarX className="w-10 h-10 text-white/40" />
                    </div>

                    <p className="text-[#6db5e8] text-lg md:text-xl lg:text-2xl font-bold uppercase mb-3 tracking-wider">
                        Nenhum Evento Futuro
                    </p>

                    <p className="text-white/50 text-sm mb-8 max-w-xs">
                        Você ainda não possui aulas agendadas. Que tal começar
                        agora?
                    </p>

                    <Button
                        onClick={() => router.push('/selecionar-mentor')}
                        className="group relative bg-gradient-to-r from-[#f0e087] to-[#e5d67a] hover:from-[#e5d67a] hover:to-[#dac95f] text-[#083d71] font-semibold text-base md:text-lg px-8 py-6 rounded-2xl w-full md:w-auto cursor-pointer transition-all duration-300 shadow-lg shadow-[#f0e087]/20 hover:shadow-xl hover:shadow-[#f0e087]/30 hover:scale-[1.02]"
                    >
                        <Sparkles className="mr-2 h-5 w-5 transition-transform group-hover:rotate-12" />
                        Agendar Aula
                    </Button>
                </div>
            )}

            {/* LISTA DE AULAS */}
            {listBookings?.length > 0 && (
                <div className="space-y-1">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#f0e087] animate-pulse" />
                            <span className="text-white/70 text-sm font-medium">
                                {listBookings.length === 1 ? 'Notificação': ''} 
                                {listBookings.length > 1 ? 'Notificações' : ''}
                               
                            </span>
                        </div>
                    </div>

                    {/* Lista com scroll */}
                    <div
                        className="space-y-3 max-h-[400px] overflow-y-auto pr-3 text-left
                    [&::-webkit-scrollbar]:w-2
                    [&::-webkit-scrollbar-track]:bg-white/5
                    [&::-webkit-scrollbar-track]:rounded-full
                    [&::-webkit-scrollbar-thumb]:bg-gradient-to-b
                    [&::-webkit-scrollbar-thumb]:from-[#f0e087]/50
                    [&::-webkit-scrollbar-thumb]:to-[#e5d67a]/30
                    [&::-webkit-scrollbar-thumb]:rounded-full
                    [&::-webkit-scrollbar-thumb]:border-2
                    [&::-webkit-scrollbar-thumb]:border-transparent
                    hover:[&::-webkit-scrollbar-thumb]:from-[#f0e087]/70
                    hover:[&::-webkit-scrollbar-thumb]:to-[#e5d67a]/50"
                    >
                        {listBookings.map((item: any, index: number) => (
                            <div
                                key={item.booking_id}
                                className="group relative bg-gradient-to-r from-white/[0.03] to-white/[0.06] hover:from-white/[0.08] hover:to-white/[0.12] transition-all duration-300 rounded-2xl p-5 border border-white/[0.08] hover:border-white/20 hover:shadow-lg hover:shadow-black/20"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* Indicador lateral */}
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-gradient-to-b from-[#f0e087] to-[#e5d67a] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                                    {/* COLUNA ESQUERDA */}
                                    <div className="flex-1 space-y-3">
                                        {/* Data e hora */}
                                        <div className="flex flex-wrap items-center gap-2 text-white">
                                            <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg text-sm font-medium">
                                                <Calendar className="w-3.5 h-3.5 text-[#f0e087]" />
                                                {item.weekday_label}
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg text-sm font-medium">
                                                {formatDateBR(
                                                    item.booking_date,
                                                )}
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 bg-[#f0e087]/10 px-3 py-1.5 rounded-lg text-sm font-semibold text-[#f0e087]">
                                                <Clock className="w-3.5 h-3.5" />
                                                {item.start_time.slice(0, 5)}
                                            </span>
                                        </div>

                                        {/* Mentor */}
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0d6bb8] to-[#083d71] flex items-center justify-center border border-white/10">
                                                <User className="w-4 h-4 text-white/80" />
                                            </div>
                                            <div>
                                                <p className="text-white/50 text-xs">
                                                    Mentor
                                                </p>
                                                <p className="text-white font-semibold text-sm">
                                                    {item.mentor_nome}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Google Meet */}
                                        {renderMeetLink(
                                            item.status,
                                            item.video_link,
                                        )}

                                        {/* DESCRIÇÃO CONDICIONAL */}
                                        {renderDescription(
                                            item.status,
                                            item.description,
                                        )}
                                    </div>

                                    {/* COLUNA DIREITA */}
                                    <div className="flex flex-col items-end gap-3 sm:self-start">
                                        {functionStatusBadge(item.status)}
                                        {renderStudentActions(
                                            item.status,
                                            item,
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="mt-6 pt-4 border-t border-white/10 text-center flex flex-col gap-2">
                        <p className="text-white/40 text-xs">
                            Role para ver mais aulas
                        </p>
                    </div>
                </div>
            )}

            <StudentCancelBookingModal
                open={modalOpen}
                loading={ModalLoading}
                action={modalAction!}
                onClose={() => setModalOpen(false)}
                onConfirm={async (description) => {
                    if (modalAction === 'desistir') {
                        await studentApproveOrDenyLesson(
                            selectedBookingId.booking_id,
                            'negado_aluno',
                            description,
                            selectedBookingId.mentor_id,
                            selectedBookingId.aluno_id,
                        );

                        await onRefreshBookings();
                    } else if (modalAction === 'cancelar') {
                        await studentCancelLesson(
                            selectedBookingId.booking_id,
                            selectedBookingId.aluno_id,
                            description,
                        );

                        await onRefreshBookings();
                    }

                    setModalAction(null);
                    setModalOpen(false);
                }}
            />
        </>
    );
}
