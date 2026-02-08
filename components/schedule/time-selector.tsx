'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useMentorWeekday } from '@/contexts/MentorWeekdayContext';
import { useAvailabilityTimeSlotMentor } from '@/hooks/useAvailabilityMentor';

const TIME_SLOTS = [
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
];

export function TimeSelector() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const day = searchParams.get('day');
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const { createTimeSlot, loading } = useAvailabilityTimeSlotMentor();

   const { mentorWeekdayId } = useMentorWeekday();

    const handleTimeClick = (time: string) => {
        setSelectedTime(time);
    };

    const handleConfirm = async () => {
        if (!selectedTime) return;

        if (!mentorWeekdayId) {
            console.error(
                'mentorWeekdayId não encontrado. Volte e selecione o dia novamente.'
            );
            return;
        }

        const result = await createTimeSlot(mentorWeekdayId, selectedTime);

        if (!result) return;

        router.push('/controle-agenda');
    };

    return (
        <div className="space-y-6">
           
            <div className="bg-[#05284a] rounded-3xl p-6 md:p-8">
                <div className="grid grid-cols-4 gap-3 md:gap-4">
                    {TIME_SLOTS.map((time) => (
                        <Button
                            key={time}
                            onClick={() => handleTimeClick(time)}
                            className={`h-12 md:h-14 text-sm md:text-base font-semibold rounded-xl transition-all duration-200 ${
                                selectedTime === time
                                    ? 'bg-[#f0e087] text-[#083d71] hover:bg-[#e5d580] shadow-lg scale-105'
                                    : 'bg-[#083d71] text-white hover:bg-[#0a4d8f] hover:scale-105'
                            }`}
                        >
                            {time}
                        </Button>
                    ))}
                </div>
            </div>

            
            {selectedTime && (
                <div className="flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <Button
                        onClick={handleConfirm}
                        size="icon"
                        className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:scale-110 transition-all duration-200"
                    >
                        <Check className="w-7 h-7" />
                    </Button>
                </div>
            )}
        </div>
    );
}
