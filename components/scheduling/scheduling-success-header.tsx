'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Check, User } from 'lucide-react';

export function SchedulingSuccessHeader() {
    return (
        <div className="flex flex-col items-center space-y-6">
          
            <div className="relative">
                <Avatar className="h-32 w-32 md:h-40 md:w-40 bg-[#0a5491] border-4 border-[#0d6bb8]">
                    <AvatarFallback className="bg-[#0a5491]">
                        <User className="h-16 w-16 md:h-20 md:w-20 text-white/70" />
                    </AvatarFallback>
                </Avatar>

                <div className="absolute -bottom-2 -right-2 h-14 w-14 md:h-16 md:w-16 bg-green-500 rounded-full flex items-center justify-center border-4 border-[#083d71] shadow-lg">
                    <Check
                        className="h-7 w-7 md:h-8 md:w-8 text-white"
                        strokeWidth={3}
                    />
                </div>
            </div>

            <div className="text-center space-y-2">
                <h1 className="text-white text-2xl md:text-3xl font-bold">
                    Obrigado!
                </h1>
                <p className="text-white text-lg md:text-xl font-semibold">
                    Agendamento Marcado
                </p>
            </div>
        </div>
    );
}
