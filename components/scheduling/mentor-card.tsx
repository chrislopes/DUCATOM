'use client';

import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Music, ArrowRight, Calendar } from 'lucide-react';
import type { ListMentor, StudentData } from '@/model/user-model';
import { useState, useMemo } from 'react';
import { ConfirmationDialog } from './confirmation-dialog';
import { Button } from '@/components/ui/button';
import { Toggle } from '../ui/toggle';

interface MentorCardProps {
    mentor: ListMentor;
    student: StudentData;
    onToggleFavorite: (mentorId: string) => void;
}

const WEEKDAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

export function MentorCard({ mentor, onToggleFavorite, student }: MentorCardProps) {
    const [showConfirmation, setShowConfirmation] = useState(false);

    const groupedAgenda = useMemo(() => {
        if (!mentor.agenda_mentor?.length) return {};

        const result: Record<string, string[]> = {};

        mentor.agenda_mentor.forEach((slot: any) => {
            const day = WEEKDAYS[slot.weekday];
            const time = slot.start_time?.slice(0, 5);

            if (!day || !time) return;

            if (!result[day]) result[day] = [];
            result[day].push(time);
        });

        return result;
    }, [mentor.agenda_mentor]);

    return (
        <>
            <Card className="relative bg-linear-to-br from-[#0a5491] to-[#083d71] border-[#0d6bb8] border-2 p-5 hover:shadow-xl transition-all">
                <Toggle
                    pressed={mentor.isFavorite}
                    onPressedChange={() => onToggleFavorite(mentor.id)}
                    className="absolute cursor-pointer top-3 right-3 h-15 w-15 rounded-full bg-[#083d71]/70 border border-[#0d6bb8]/50 backdrop-blur data-[state=on]:bg-[#f0e087]/20 data-[state=on]:border-[#f0e087]/60 hover:bg-[#083d71]/90 transition-all"
                >
                    <Star
                        className={`h-15 w-15 text-2xl transition-colors ${
                            mentor.isFavorite
                                ? 'fill-[#f0e087] text-[#f0e087]'
                                : 'text-white'
                        }`}
                    />
                </Toggle>

                <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20 border-2 border-[#f0e087]">
                        <AvatarImage
                            src={mentor.avatar || '/placeholder.svg'}
                        />
                        <AvatarFallback className="text-[#f0e087] font-bold">
                            {mentor.nome
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                        </AvatarFallback>
                    </Avatar>

                    <div>
                        <h3 className="text-white font-bold text-lg">
                            {mentor.nome}
                        </h3>
                        <div className="flex gap-2 text-white/80 text-sm">
                            <Music className="h-4 w-4 text-[#f0e087]" />
                            {mentor.especialidade} • Nível {mentor.nivel}
                        </div>
                    </div>
                </div>

                {Object.keys(groupedAgenda).length > 0 && (
                    <div className="mt-6 rounded-xl bg-linear-to-br from-[#083d71]/80 to-[#0a5491]/80 border border-[#0d6bb8]/60 p-4 shadow-inner">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f0e087]/20">
                                <Calendar className="h-4 w-4 text-[#f0e087]" />
                            </div>
                            <h4 className="text-white font-semibold text-sm tracking-wide">
                                Disponibilidade
                            </h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {Object.entries(groupedAgenda).map(
                                ([day, times]) => (
                                    <div
                                        key={day}
                                        className="rounded-lg bg-[#083d71]/70 border border-[#0d6bb8]/50 p-3 hover:bg-[#083d71]/90 transition-colors"
                                    >
                                        <div className="mb-2 text-xs font-semibold text-[#f0e087] uppercase tracking-wide">
                                            {day}
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {times.map((time) => (
                                                <span
                                                    key={time}
                                                    className="rounded-md bg-[#0a5491] px-2 py-1 text-xs font-medium text-white border border-[#0d6bb8]/60"
                                                >
                                                    {time}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                )}

                <div className="mt-4">
                    <Button
                        onClick={() => setShowConfirmation(true)}
                        className="w-full text-base hover:bg-yellow-200  cursor-pointer bg-[#f0e087] text-[#083d71] font-bold py-5"
                    >
                        Clique para Agendar
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </Card>

            <ConfirmationDialog
                isOpen={showConfirmation}
                onClose={() => setShowConfirmation(false)}
                mentor={mentor}
                student={student}
            />
        </>
    );
}
