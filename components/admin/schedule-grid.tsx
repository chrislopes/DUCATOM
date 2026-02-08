'use client';

import { useMemo, useState } from 'react';
import { ReservedSlotModal } from './reserved-slot-modal';
import { CanceledSlotModal } from './canceled-slot-modal';
import {
    MentorAgendaDay,
    MentorAgendaSlot,
    MentorAgendaSlotHistory,
} from '@/model/grid_mentor-model';
import { MentorData } from '@/model/user-model';

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface ScheduleGridProps {
    agenda: MentorAgendaDay[];
    mentor: MentorData[];
}

type TimeSlot = MentorAgendaSlot;

export function ScheduleGrid({ agenda, mentor }: ScheduleGridProps) {
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
    const [showReservedModal, setShowReservedModal] = useState(false);
    const [showCanceledModal, setShowCanceledModal] = useState(false);
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    const daysLabel = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

    const timeSlots = useMemo(() => {
        if (!agenda.length) return [];
        return agenda[0].slots.map((slot) => slot.time.slice(0, 5));
    }, [agenda]);

    const dates = useMemo(() => {
        if (!agenda.length) return [];
        return agenda.map((day) => {
            const date = new Date(day.date + 'T00:00:00');
            return {
                key: day.date,
                label: `${daysLabel[day.weekday]}, ${String(
                    date.getDate(),
                ).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(
                    2,
                    '0',
                )}`,
                slots: day.slots,
            };
        });
    }, [agenda]);

    function getSlotMainColor(slot: MentorAgendaSlot) {
        if (['available'].includes(slot.status))
            return 'bg-green-600 hover:bg-green-700';

        if (slot.status === 'pendente_aprovacao')
            return 'bg-yellow-500 hover:bg-yellow-600';

        if (slot.status === 'reservado')
            return 'bg-purple-600 hover:bg-purple-700';

        if (slot.status === 'negado_aluno')
            return 'bg-orange-600 hover:bg-orange-700';

        if (slot.status === 'cancelado_aluno')
            return 'bg-pink-600 hover:bg-pink-700';

        if (slot.status === 'negado_mentor')
            return 'bg-stone-500 hover:bg-stone-600';

        if (slot.status === 'cancelado_mentor')
            return 'bg-red-800  hover:bg-red-900';

        if (slot.status === 'concluido')
            return 'bg-gradient-to-br from-emerald-700 via-emerald-800 to-gray-300';

        if (slot.status === 'no_show')
            return 'bg-linear-to-r from-[#8B2F4E] to-[#4B1F3A]';

        if (slot.status === 'negado_inatividade')
            return 'bg-black hover:bg-black/50';

        if (slot.status === 'empty') return 'bg-blue-600 hover:bg-blue-700';
        return 'bg-blue-600 hover:bg-blue-700';
    }

    function getBadgeColor(status: string) {
        switch (status) {
            case 'negado_mentor':
                return 'bg-stone-500 text-white';
            case 'negado_aluno':
                return 'bg-orange-600 text-white';
            case 'cancelado_mentor':
                return 'bg-red-800 text-white';
            case 'cancelado_aluno':
                return 'bg-pink-600 text-white';
            case 'no_show':
                return 'bg-linear-to-r from-[#8B2F4E] to-[#4B1F3A] text-white';
            case 'negado_inatividade':
                return 'bg-black text-white';
            case 'concluido':
                return 'bg-gradient-to-br from-emerald-700 via-emerald-800 to-gray-300 text-black';
            default:
                return 'bg-gray-400 text-white';
        }
    }

    function handleSlotClick(
        slot: MentorAgendaSlot,
        time: string,
        date: string,
    ) {
        setSelectedSlot(slot);
        setSelectedTime(time);
        setSelectedDate(date);

        if (['reservado', 'pendente_aprovacao'].includes(slot.status)) {
            setShowReservedModal(true);
            return;
        }
        if (
            [
                'negado_mentor',
                'negado_aluno',
                'negado_inatividade',
                'cancelado_mentor',
                'cancelado_aluno',
            ].includes(slot.status)
        ) {
            setShowCanceledModal(true);
            return;
        }
        if (slot.status === 'no_show') {
            slot.description =
                'Alguma coisa aconteceu entre Mentor e Aluno para a não conclusão da aula.';
            setShowCanceledModal(true);
            return;
        }
    }

    function labelStatusGrid(slot: MentorAgendaSlot): string {
        if (
            [
                'concluido',
                'negado_aluno',
                'negado_mentor',
                'cancelado_mentor',
                'negado_inatividade',
                'cancelado_aluno',
                'no_show',
            ].includes(slot.status)
        ) {
            return `Status atual: ${slot.status}, Mentor está disponivel.`;
        } else if (['reservado', 'pendente_aprovacao'].includes(slot.status)) {
            return `Status atual: ${slot.status}, Mentor não está disponivel.`;
        } else if (slot.status == 'empty') {
            return 'Sem atividades nesta data e horário';
        } else {
            return 'Mentor disponivel para esta data e horário';
        }
    }

    return (
        <>
            <div className="bg-[#041c3a]/50 rounded-lg p-4">
                

                <div className="md:hidden space-y-4">
                    {timeSlots.map((time) => (
                        <div
                            key={time}
                            className="bg-[#083d71] rounded-lg p-3 space-y-3 shadow-md"
                        >
                          
                            <div className="text-center text-sm font-bold text-[#f0e087]">
                                {time}
                            </div>

                          
                            <div className="space-y-2">
                                {dates.map((date) => {
                                    const slot = date.slots.find((s) =>
                                        s.time.startsWith(time),
                                    );

                                    if (!slot) return null;

                                    return (
                                        <button
                                            key={`${date.key}-${time}`}
                                            onClick={() =>
                                                handleSlotClick(
                                                    slot,
                                                    time,
                                                    date.key,
                                                )
                                            }
                                            className={`w-full h-12 rounded-lg flex items-center justify-between px-3 text-sm font-medium transition-all ${getSlotMainColor(
                                                slot,
                                            )}`}
                                        >
                                            <span className="font-semibold">
                                                {date.label}
                                            </span>

                                            <span className="text-xs opacity-90">
                                                {labelStatusGrid(slot)}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                
                <div className="hidden md:block overflow-x-auto custom-scrollbar">
                    <div className="min-w-[1200px]">
                       
                        <div className="grid grid-cols-[120px_repeat(auto-fit,minmax(120px,1fr))] gap-2 mb-3">
                            <div className="flex items-center justify-center font-medium text-gray-200">
                                Horários
                            </div>

                            {dates.map((date) => (
                                <div
                                    key={date.key}
                                    className="text-center py-2 bg-[#083d71] rounded-lg text-sm font-medium"
                                >
                                    {date.label}
                                </div>
                            ))}
                        </div>

                       
                        <div className="space-y-2">
                            {timeSlots.map((time) => (
                                <div
                                    key={time}
                                    className="grid grid-cols-[120px_repeat(auto-fit,minmax(120px,1fr))] gap-2"
                                >
                                  
                                    <div className="flex items-center justify-center text-sm text-gray-300 font-medium">
                                        {time}
                                    </div>

                                  
                                    {dates.map((date) => {
                                        const slot = date.slots.find((s) =>
                                            s.time.startsWith(time),
                                        );

                                        if (!slot)
                                            return (
                                                <div
                                                    key={`${date.key}-${time}`}
                                                />
                                            );

                                        return (
                                            <div
                                                key={`${date.key}-${time}`}
                                                className="relative"
                                            >
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <button
                                                            onClick={() =>
                                                                handleSlotClick(
                                                                    slot,
                                                                    time,
                                                                    date.key,
                                                                )
                                                            }
                                                            className={`h-12 w-full rounded-lg transition-all cursor-pointer ${getSlotMainColor(
                                                                slot,
                                                            )}`}
                                                        />
                                                    </TooltipTrigger>

                                                    <TooltipContent>
                                                        <p className="text-sm font-medium">
                                                            {labelStatusGrid(
                                                                slot,
                                                            )}
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>

                                             
                                                {slot.history &&
                                                    slot.history.length > 0 && (
                                                        <Popover>
                                                            <PopoverTrigger
                                                                asChild
                                                            >
                                                                <div className="absolute top-1 right-1 flex space-x-1 cursor-pointer hover:scale-110">
                                                                    {slot.history.map(
                                                                        (
                                                                            h: MentorAgendaSlotHistory,
                                                                            idx,
                                                                        ) => (
                                                                            <Tooltip
                                                                                key={
                                                                                    idx
                                                                                }
                                                                            >
                                                                                <TooltipTrigger
                                                                                    asChild
                                                                                >
                                                                                    <span
                                                                                        className={`w-5 h-5 rounded-full border border-white ${getBadgeColor(
                                                                                            h.status,
                                                                                        )}`}
                                                                                    />
                                                                                </TooltipTrigger>

                                                                                <TooltipContent>
                                                                                    <p className="text-xs">
                                                                                        Clique
                                                                                        no
                                                                                        ícone
                                                                                        para
                                                                                        ver
                                                                                        histórico
                                                                                    </p>
                                                                                </TooltipContent>
                                                                            </Tooltip>
                                                                        ),
                                                                    )}
                                                                </div>
                                                            </PopoverTrigger>

                                                            <PopoverContent className="w-72 p-2 max-h-60 overflow-y-auto bg-[#0a4d8f] rounded-lg shadow-lg border border-gray-600 animate-in fade-in-0 slide-in-from-top-2 duration-300">
                                                                <div className="flex flex-col space-y-2">
                                                                    {slot.history.map(
                                                                        (
                                                                            h: MentorAgendaSlotHistory,
                                                                            idx,
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    idx
                                                                                }
                                                                                className="p-2 bg-[#083d71] rounded-lg text-xs text-gray-100 border border-gray-500"
                                                                            >
                                                                                <div className="flex justify-between items-center mb-1">
                                                                                    <span
                                                                                        className={`px-1 rounded ${getBadgeColor(
                                                                                            h.status,
                                                                                        )}`}
                                                                                    >
                                                                                        {h.status.replace(
                                                                                            '_',
                                                                                            ' ',
                                                                                        )}
                                                                                    </span>

                                                                                    <span className="text-gray-300 text-[10px]">
                                                                                        {new Date(
                                                                                            h.created_at,
                                                                                        ).toLocaleString()}
                                                                                    </span>
                                                                                </div>

                                                                                <div className="text-gray-200 text-xs">
                                                                                    <strong>
                                                                                        {h.status ===
                                                                                            'negado_mentor' ||
                                                                                        h.status ===
                                                                                            'cancelado_mentor'
                                                                                            ? mentor[0]
                                                                                                  ?.nome
                                                                                            : h.nome_aluno}
                                                                                    </strong>{' '}
                                                                                    -{' '}
                                                                                    {h.description ??
                                                                                        '-'}
                                                                                </div>
                                                                            </div>
                                                                        ),
                                                                    )}
                                                                </div>
                                                            </PopoverContent>
                                                        </Popover>
                                                    )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

           
            <ReservedSlotModal
                isOpen={showReservedModal}
                onClose={() => setShowReservedModal(false)}
                mentorName={mentor[0]?.nome ?? ''}
                studentName={selectedSlot?.nome_aluno ?? ''}
                time={selectedTime}
            />

            <CanceledSlotModal
                isOpen={showCanceledModal}
                onClose={() => setShowCanceledModal(false)}
                mentorName={mentor[0]?.nome ?? ''}
                studentName={selectedSlot?.nome_aluno ?? ''}
                colorBg={
                    selectedSlot
                        ? getSlotMainColor(selectedSlot).replace(
                              /hover:bg-\S+/g,
                              '',
                          )
                        : ''
                }
                cancelReason={selectedSlot?.description ?? ''}
            />
        </>
    );
}
