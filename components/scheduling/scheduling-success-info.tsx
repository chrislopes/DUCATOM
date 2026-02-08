'use client';

import { Card } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';

export function SchedulingSuccessInfo() {
    return (
        <div className="w-full grid grid-cols-2 gap-4">
         
            <Card className="bg-[#0a5491] border-[#0d6bb8] border-2 p-6 flex flex-col items-center justify-center space-y-3 hover:bg-[#0d6bb8] transition-colors">
                <Calendar
                    className="h-12 w-12 md:h-14 md:w-14 text-[#f0e087]"
                    strokeWidth={1.5}
                />
                <div className="text-center">
                    <p className="text-white text-xs md:text-sm font-semibold">
                        Quarta
                    </p>
                    <p className="text-white text-sm md:text-base font-bold">
                        4 de Novembro
                    </p>
                </div>
            </Card>

            <Card className="bg-[#0a5491] border-[#0d6bb8] border-2 p-6 flex flex-col items-center justify-center space-y-3 hover:bg-[#0d6bb8] transition-colors">
                <Clock
                    className="h-12 w-12 md:h-14 md:w-14 text-[#f0e087]"
                    strokeWidth={1.5}
                />
                <div className="text-center">
                    <p className="text-white text-lg md:text-xl font-bold">
                        20:00 PM
                    </p>
                </div>
            </Card>
        </div>
    );
}
