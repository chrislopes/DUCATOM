'use client';

import { CardListBookingProps } from './card-list-booking-student';
import { Calendar, Clock, User, CalendarX, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { MentorCancelBookingModal } from './MentorCancelBookingModal';
import { CancelAction, ListBooking } from '@/model/list-bookings-model';
import Image from 'next/image';
import { MentorAcceptBookingModal } from './MentorAcceptBookingModal';
import { useRPC_Bookings } from '@/hooks/use-RPC_bookings';

import { MentorData } from '@/model/user-model';

type MentorBookingStatus =
    | 'pendente_aprovacao'
    | 'reservado'
    | 'negado_aluno'
    | 'cancelado_aluno';

export function CardListBookingMentor({
    listBookings,
    functionStatusBadge,
    onRefreshBookings,
}: CardListBookingProps) {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState<number | null>(
        null,
    );
    const [mentorData, setMentorData] = useState<MentorData | null>(null);

    const {
        mentorApproveOrDenyLesson,
        mentorCancelLesson,
        loading: ModalLoading,
    } = useRPC_Bookings();

    const [acceptModalOpen, setAcceptModalOpen] = useState(false);

    const [action, setAction] = useState<CancelAction | null>(null);

    const didRun = useRef(false);

    useEffect(() => {
        if (didRun.current) return;
        didRun.current = true;
        const data = localStorage.getItem('mentor_id');
        if (data) {
            setMentorData(JSON.parse(data));
        }
    }, [mentorData?.id]);

    function openMentorModal(action: CancelAction, bookingId: any) {
        setAction(action);
        setSelectedBookingId(bookingId);
        setModalOpen(true);
    }

    function openMentorAcceptModal(bookingId: any) {
        setAcceptModalOpen(true);
        setSelectedBookingId(bookingId);
    }

    function renderMentorActions(
        status: MentorBookingStatus,
        booking: ListBooking,
    ) {
        switch (status) {
            case 'pendente_aprovacao':
                return (
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            className="bg-green-500/20 text-green-300 hover:bg-green-500/30 cursor-pointer"
                            onClick={() => openMentorAcceptModal(booking)}
                        >
                            Aceitar a aula
                        </Button>

                        <Button
                            size="sm"
                            className="bg-red-500/20 text-red-300 hover:bg-red-500/30 cursor-pointer"
                            onClick={() => openMentorModal('desistir', booking)}
                        >
                            Negar a aula
                        </Button>
                    </div>
                );

            case 'reservado':
                return (
                    <Button
                        variant="destructive"
                        size="sm"
                        className="rounded-lg cursor-pointer"
                        onClick={() => openMentorModal('cancelar', booking)}
                    >
                        Cancelar aula
                    </Button>
                );

            default:
                return null;
        }
    }

    function renderDescription(
        status: MentorBookingStatus,
        description?: string,
    ) {
        if (
            (status === 'negado_aluno' || status === 'cancelado_aluno') &&
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
                    className="text-emerald-300 text-sm font-medium underline underline-offset-2 hover:text-emerald-200 w-full flex items-center transition w-full"
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

    function formatDateBR(dateString: string) {
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('pt-BR');
    }

    return (
        <>
            {/* SEM SOLICITAÇÕES */}
            {listBookings?.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                        <CalendarX className="w-10 h-10 text-white/40" />
                    </div>

                    <p className="text-[#6db5e8] text-lg md:text-xl lg:text-2xl font-bold uppercase mb-3 tracking-wider">
                        Nenhuma Solicitação
                    </p>

                    <p className="text-white/50 text-sm max-w-xs">
                        No momento você não possui solicitações de aula
                        pendentes.
                    </p>
                </div>
            )}

            {/* LISTA */}
            {listBookings?.length > 0 && (
                <div className="space-y-1">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                            <span className="text-white/70 text-sm font-medium">
                                {listBookings.length} aula
                                {listBookings.length > 1 ? 's' : ''} agendada
                                {listBookings.length > 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>

                    {/* Scroll */}
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
                                className="group relative bg-gradient-to-r from-white/[0.03] to-white/[0.06]
                                hover:from-white/[0.08] hover:to-white/[0.12]
                                transition-all duration-300 rounded-2xl p-5
                                border border-white/[0.08] hover:border-white/20"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* Indicador lateral */}
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-gradient-to-b from-[#f0e087] to-[#e5d67a] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                                    {/* ESQUERDA */}
                                    <div className="space-y-3">
                                        <div className="flex flex-wrap gap-2 text-white">
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

                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0d6bb8] to-[#083d71] flex items-center justify-center border border-white/10">
                                                <User className="w-4 h-4 text-white/80" />
                                            </div>
                                            <div>
                                                <p className="text-white/50 text-xs">
                                                    Aluno
                                                </p>
                                                <p className="text-white font-semibold text-sm">
                                                    {item.aluno_nome}
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

                                    {/* DIREITA */}
                                    <div className="flex flex-col items-end gap-3">
                                        {functionStatusBadge(item.status)}

                                        {renderMentorActions(
                                            item.status,
                                            item.booking_id,
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="mt-6 pt-4 border-t border-white/10 text-center">
                        <p className="text-white/40 text-xs">
                            Role para ver mais aulas
                        </p>
                    </div>
                </div>
            )}

            {/* MODAL */}
            <MentorCancelBookingModal
                open={modalOpen}
                loading={ModalLoading}
                onClose={() => setModalOpen(false)}
                onConfirm={async (description) => {
                    if (action === 'desistir') {
                        await mentorApproveOrDenyLesson(
                            selectedBookingId!,
                            'deny',
                            description,
                            mentorData?.id,
                        );
                        await onRefreshBookings();
                    } else if (action === 'cancelar') {
                        await mentorCancelLesson(
                            selectedBookingId!,
                            mentorData?.id!,
                            description,
                        );
                        await onRefreshBookings();
                    }

                    setAction(null);
                    setModalOpen(false);
                }}
            />

            <MentorAcceptBookingModal
                open={acceptModalOpen}
                onClose={() => setAcceptModalOpen(false)}
                loading={ModalLoading}
                onConfirm={async () => {
                    await mentorApproveOrDenyLesson(
                        selectedBookingId!,
                        'approve', // 'approve'
                        undefined, // pode ser undefined
                        mentorData?.id,
                    );
                    await onRefreshBookings();

                    setSelectedBookingId(null);
                    setAcceptModalOpen(false);
                }}
            />
        </>
    );
}
