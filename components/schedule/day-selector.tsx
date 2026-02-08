'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useAvailabilityMentor } from '@/hooks/useAvailabilityMentor';
import { useMentorWeekday } from '@/contexts/MentorWeekdayContext';
import { MentorData } from '@/model/user-model';

const DAYS = [
    { id: 'monday', label: 'Segunda', fullLabel: 'Segunda-feira' },
    { id: 'tuesday', label: 'Terça', fullLabel: 'Terça-feira' },
    { id: 'wednesday', label: 'Quarta', fullLabel: 'Quarta-feira' },
    { id: 'thursday', label: 'Quinta', fullLabel: 'Quinta-feira' },
    { id: 'friday', label: 'Sexta', fullLabel: 'Sexta-feira' },
    { id: 'saturday', label: 'Sábado', fullLabel: 'Sábado' },
    { id: 'sunday', label: 'Domingo', fullLabel: 'Domingo' },
];

const DAY_TO_NUMBER: Record<string, number> = {
    monday: 0,
    tuesday: 1,
    wednesday: 2,
    thursday: 3,
    friday: 4,
    saturday: 5,
    sunday: 6,
};

export function DaySelector() {
    const router = useRouter();
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const { createAvailabilityMentor, loading } = useAvailabilityMentor();
    const { setMentorWeekdayId } = useMentorWeekday();
    const [mentorUser, setMentorUser] = useState<MentorData>();

    const didRun = useRef(false);

    useEffect(() => {
        if (didRun.current) return;
        didRun.current = true;

        const saved = localStorage.getItem('mentor_id');
        if (saved) {
            const mentor = JSON.parse(saved);
            setMentorUser(mentor);
        }
    }, []);

    const handleDayClick = (dayId: string) => {
        setSelectedDay(dayId);
    };

    const handleConfirm = async () => {
        if (!selectedDay) return;

        const weekdayNumber = DAY_TO_NUMBER[selectedDay];

        try {
            if (!mentorUser?.id) {
                throw new Error('ID do mentor não encontrado');
            }

            const result = await createAvailabilityMentor(
                mentorUser?.id,
                weekdayNumber
            );

            if (!result) {
                return;
            }

            setMentorWeekdayId(result);

           
            const day = DAYS.find((d) => d.id === selectedDay);

            router.push(
                `/controle-agenda/selecionar-horario?day=${selectedDay}&label=${day?.fullLabel}`
            );
        } catch (error) {
            console.error('Erro ao cadastrar dia:', error);
        }
    };

    return (
        <div className="space-y-6">
            
            <div className="grid grid-cols-2 gap-3 md:gap-4">
                {DAYS.map((day) => (
                    <Button
                        key={day.id}
                        onClick={() => handleDayClick(day.id)}
                        disabled={loading}
                        className={`h-14 md:h-16 text-base md:text-lg font-semibold rounded-full transition-all duration-200 ${
                            selectedDay === day.id
                                ? 'bg-white text-[#083d71] hover:bg-gray-100 shadow-lg scale-105'
                                : 'bg-white text-[#083d71] hover:bg-gray-100 hover:scale-105'
                        }`}
                    >
                        <span className="relative">
                            {day.label}
                            {selectedDay === day.id && (
                                <Check className="absolute -top-1 -right-5 w-4 h-4 text-green-500" />
                            )}
                        </span>
                    </Button>
                ))}
            </div>

            {selectedDay && (
                <div className="flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <Button
                        onClick={handleConfirm}
                        size="icon"
                        disabled={loading}
                        className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:scale-110 transition-all duration-200"
                    >
                        <Check className="w-7 h-7" />
                    </Button>
                </div>
            )}
        </div>
    );
}
