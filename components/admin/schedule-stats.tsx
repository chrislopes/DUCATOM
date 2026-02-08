import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MentorData } from '@/model/user-model';
import { useEffect, useRef } from 'react';
import { useDashboardAdmin } from '@/hooks/useDashboard_Admin';

interface ScheduleStatsProps {
    availableSlots: number;
    reservedSlots: number;
    selectedMentor: any;
}

export function ScheduleStats({
    availableSlots,
    reservedSlots,
    selectedMentor,
}: ScheduleStatsProps) {
    const {
        loading,
        byMentorIdAdmin,
        mentorId,
    } = useDashboardAdmin();

    const didRun = useRef(false);

    useEffect(() => {
        if (didRun.current) return;
        didRun.current = true;
      
        byMentorIdAdmin(selectedMentor);
    }, [byMentorIdAdmin]);

    return (
        <div className="flex lg:flex-row justify-center gap-2">
            <Card className="w-full lg:w-[460px] bg-[#0a4d8f]/40 border border-white/10 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl py-3">
                <CardHeader className="pb-2">
                    <CardTitle className="text-[#f0e087] text-lg text-center">
                        Informações do Mentor
                    </CardTitle>
                </CardHeader>

                
                <CardContent
                    className="
                            space-y-4
                            max-h-[175px]
                            overflow-y-auto
                            pr-4
                            [&::-webkit-scrollbar]:w-1.5
                            [&::-webkit-scrollbar-track]:bg-transparent
                            [&::-webkit-scrollbar-thumb]:bg-[#f0e087]
                            [&::-webkit-scrollbar-thumb]:rounded-full
                            hover:[&::-webkit-scrollbar-thumb]:bg-[#f0e087]
                            "
                >
                    <div className="flex justify-between items-center">
                        <span className="text-gray-300 font-semibold text-base">
                            Nome
                        </span>
                       
                        <span className="font-semibold text-white">
                            {mentorId?.nome ?? '-'}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-300 font-semibold text-base">
                            Especialidade
                        </span>
                        <span className="font-semibold text-white">
                            {mentorId?.especialidade ?? '-'}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-300 font-semibold text-base">
                            Nível
                        </span>
                        <Badge variant="secondary" className="text-sm">
                            {mentorId?.nivel ?? '-'}
                        </Badge>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-300 font-semibold text-base">
                            Agenda
                        </span>

                        <Badge
                            className={
                                true
                                    ? 'bg-green-600 hover:bg-green-700'
                                    : 'bg-red-600 hover:bg-red-700'
                            }
                        >
                            {mentorId?.agenda_publicada ? 'Ativa' : 'Desativada'}
                        </Badge>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-300 font-semibold text-base">
                            Horários Disponíveis
                        </span>

                        <span className="font-bold text-lg text-[#f0e087]">
                            {availableSlots}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-300 font-semibold text-base">
                            Horários Reservados
                        </span>

                        <span className="font-bold text-lg text-[#f0e087]">
                            {reservedSlots}
                        </span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
