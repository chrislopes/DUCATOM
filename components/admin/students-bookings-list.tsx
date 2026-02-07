'use client';

import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Calendar,
    Clock,
    User,
    GraduationCap,
    XCircle,
    BookOpenCheck,
    AlertCircle,
    BadgeCheck,
} from 'lucide-react';
import { useDashboardAdmin } from '@/hooks/useDashboard_Admin';

interface StudentsHistoryProps {
    studentId: number | null;
}

export function StudentsBookingsList({ studentId }: StudentsHistoryProps) {
    const { loading, getHistoryStudentByIdHook, studentBookingId } =
        useDashboardAdmin();

    useEffect(() => {
        if (!studentId) return;

        getHistoryStudentByIdHook(studentId);
    }, [studentId]);

    // Função para obter cor e texto do status
    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'pendente_aprovacao':
                return {
                    label: 'Pendente de aprovação',
                    color: 'bg-yellow-500 text-white font-semibold border-yellow-500',
                    icon: AlertCircle,
                };
            case 'negado_aluno':
                return {
                    label: 'Negado Pelo Aluno',
                    color: 'bg-orange-600 text-white font-semibold border-orange-500',
                    icon: XCircle,
                };
            case 'cancelado_aluno':
                return {
                    label: 'Cancelado pelo aluno',
                    color: 'bg-pink-600 text-white font-semibold border-pink-500',
                    icon: XCircle,
                };
            case 'negado_mentor':
                return {
                    label: 'Negado pelo mentor',
                    color: 'bg-stone-500 text-white font-semibold border-stone-500',
                    icon: XCircle,
                };
            case 'cancelado_mentor':
                return {
                    label: 'Cancelado pelo mentor',
                    color: 'bg-red-800 text-white font-semibold border-red-500',
                    icon: XCircle,
                };
            case 'no_show':
                return {
                    label: 'No-show (conflito)',
                    color: 'bg-linear-to-r from-[#8B2F4E] to-[#4B1F3A] text-white font-semibold border-gray-500',
                    icon: XCircle,
                };
            case 'reservado':
                return {
                    label: 'Aula reservada',
                    color: 'bg-purple-600 text-white font-semibold border-purple-500',
                    icon: BookOpenCheck,
                };
            case 'negado_inatividade':
                return {
                    label: 'Negado por inatividade',
                    color: 'bg-black text-white font-semibold border-white',
                    icon: BookOpenCheck,
                };
            case 'concluido':
                return {
                    label: 'Aula concluída',
                    color: 'bg-linear-to-br from-emerald-700 via-emerald-800 to-gray-300 text-white font-semibold border-green-500',
                    icon: BadgeCheck,
                };
            default:
                return {
                    label: status,
                    color: 'bg-blue-500 text-white font-semibold border-blue-500',
                    icon: AlertCircle,
                };
        }
    };

    return (
        <div className="space-y-6">
            {/* Loading */}
            {loading && (
                <p className="text-gray-300 text-sm">Carregando histórico...</p>
            )}

            {/* Nenhum aluno selecionado */}
            {!loading && studentId === null && (
                <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] bg-[#0a4d8f]/30 rounded-xl border-2 border-dashed border-[#0a4d8f] p-6 sm:p-8">
                    <div className="text-center space-y-4 max-w-md">
                        <div className="w-16 h-16 mx-auto bg-[#0a4d8f] rounded-full flex items-center justify-center">
                            <svg
                                className="w-8 h-8 text-[#f0e087]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                        </div>

                        <h3 className="text-xl font-semibold text-[#f0e087]">
                            Selecione um Aluno
                        </h3>

                        <p className="text-gray-300 text-sm leading-relaxed">
                            Para visualizar o histórico das aulas do aluno,
                            selecione um aluno no filtro acima.
                        </p>
                    </div>
                </div>
            )}

            {/* Vazio */}
            {!loading &&
                studentId != null &&
                studentBookingId?.length === 0 && (
                    <div className="flex flex-col items-center justify-center min-h-[250px] bg-[#0a4d8f]/20 rounded-xl border border-[#0a4d8f] p-6 text-center">
                        <h3 className="text-lg sm:text-xl font-semibold text-[#f0e087]">
                            Nenhum agendamento encontrado para este aluno.
                        </h3>
                    </div>
                )}

            {/* ================= LISTA DE BOOKINGS ================= */}
            {studentBookingId && studentBookingId.length > 0 && (
                <div
                    className="
                    space-y-3
                    overflow-y-auto
                    pr-2
                    custom-scroll
                    max-h-none
                    md:max-h-[420px]
                    lg:max-h-[500px]
                "
                >
                    {studentBookingId.map((booking) => {
                        const statusInfo = getStatusInfo(booking.status);
                        const StatusIcon = statusInfo.icon;

                        return (
                            <Card
                                key={booking.booking_id}
                                className="
                                bg-[#0a4d8f]/30
                                border-[#0a4d8f]
                                p-4
                                hover:bg-[#0a4d8f]/50
                                transition-all
                                duration-200
                            "
                            >
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-start gap-4">
                                        {/* Avatar */}
                                        <div className="w-12 h-12 rounded-full bg-[#f0e087]/20 flex items-center justify-center shrink-0">
                                            <GraduationCap className="h-6 w-6 text-[#f0e087]" />
                                        </div>

                                        {/* Conteúdo */}
                                        <div className="flex-1 min-w-0">
                                            {/* Nome + Status */}
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                                <h3 className="font-semibold text-white truncate">
                                                    {booking.aluno_nome}
                                                </h3>

                                                <Badge
                                                    variant="outline"
                                                    className={`${statusInfo.color} border w-fit`}
                                                >
                                                    <StatusIcon className="h-3 w-3 mr-1" />
                                                    {statusInfo.label}
                                                </Badge>
                                            </div>

                                            {/* Infos */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                                                <div className="flex items-center gap-2 text-gray-300">
                                                    <User className="h-4 w-4 text-[#f0e087]" />
                                                    <span className="truncate">
                                                        Mentor:{' '}
                                                        {booking.mentor_nome}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2 text-gray-300">
                                                    <Calendar className="h-4 w-4 text-[#f0e087]" />
                                                    <span>
                                                        {booking.booking_date}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2 text-gray-300">
                                                    <Clock className="h-4 w-4 text-[#f0e087]" />
                                                    <span>
                                                        {booking.start_time}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
