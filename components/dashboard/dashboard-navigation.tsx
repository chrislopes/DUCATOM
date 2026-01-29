'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { BookOpen, TrendingUp, LucideCalendarDays, CalendarMinus2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function DashboardNavigation() {
    const router = useRouter();
    const { user } = useAuth();

    return (
        <nav className="space-y-4">
            {user?.role === 'MENTOR' && (
                <Button
                    className="w-full bg-linear-to-r from-[#f0e087] to-[#e5d67a] hover:from-[#e5d67a] hover:to-[#dac95f] text-[#083d71] font-semibold text-base md:text-lg py-6 md:py-7 rounded-lg cursor-pointer transition-colors"
                    onClick={() => router.push('/controle-agenda')}
                >
                    <LucideCalendarDays className="mr-2 h-5 w-5" />
                    Controle da Agenda
                </Button>
            )}

            {user?.role === 'STUDENT' && (
                <Button
                    className="w-full bg-linear-to-r from-[#f0e087] to-[#e5d67a] hover:from-[#e5d67a] hover:to-[#dac95f] text-[#083d71] font-semibold text-base md:text-lg py-6 md:py-7 rounded-lg cursor-pointer transition-colors"
                    onClick={() => router.push('/selecionar-mentor')}
                >
                    <CalendarMinus2Icon className="mr-2 h-5 w-5" />
                    Agendar aula
                </Button>
            )}

            <Button
                className="w-full bg-[#0a5491] hover:bg-[#0d6bb8] text-white font-semibold text-base md:text-lg py-6 md:py-7 rounded-lg transition-colors cursor-pointer"
                onClick={() => router.push('/materiais-didaticos')}
            >
                <BookOpen className="mr-2 h-5 w-5" />
                Materiais Didáticos
            </Button>

            {/* <Button className="w-full bg-[#0a5491] hover:bg-[#0d6bb8] text-white font-semibold text-base cursor-pointer md:text-lg py-6 md:py-7 rounded-lg transition-colors">
                <TrendingUp className="mr-2 h-5 w-5" />
                Progresso do Aluno
            </Button> */}
        </nav>
    );
}
