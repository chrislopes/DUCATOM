'use client';

import { useState, useEffect } from 'react';
import { Calendar, LogOut } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { MentorData, StudentData } from '@/model/user-model';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ScheduleTrackingHeaderProps {
    activeTab: 'alunos' | 'mentores';
    onTabChange: (tab: 'alunos' | 'mentores') => void;
    mentors: MentorData[];
    student: StudentData[];
    selectedMentor: string | undefined;
    onMentorChange: (mentorId: string) => void;
    selectedStudent: string | undefined;
    onStudentChange: (studentId: string) => void;
    loading: boolean;
}

export function ScheduleTrackingHeader({
    activeTab,
    onTabChange,
    mentors,
    selectedMentor,
    onMentorChange,
    selectedStudent,
    onStudentChange,
    student,
    loading,
}: ScheduleTrackingHeaderProps) {
    const [currentTime, setCurrentTime] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const router = useRouter();

    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();

          
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            setCurrentTime(`${hours}:${minutes}:${seconds}`);

            const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
            const months = [
                'Janeiro',
                'Fevereiro',
                'Março',
                'Abril',
                'Maio',
                'Junho',
                'Julho',
                'Agosto',
                'Setembro',
                'Outubro',
                'Novembro',
                'Dezembro',
            ];

            const dayName = days[now.getDay()];
            const day = now.getDate();
            const month = months[now.getMonth()];

            setCurrentDate(`${dayName}, ${day} de ${month}`);
        };

        updateDateTime();
        const interval = setInterval(updateDateTime, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleSwitchScreen = () => {
        router.push('/validacao-aulas');
    };

    function logout() {
        document.cookie =
            'sb_access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie =
            'sb_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

        router.replace('/');
    }

    return (
        <div className="space-y-4">
            <div className='w-full flex justify-end'>
                <Button
                    onClick={logout}
                    variant="ghost"
                    className="
        w-full md:w-auto
        flex items-center justify-center gap-2
        border border-red-400/40
        text-red-300
        hover:text-red-200
        hover:bg-red-500/20
        rounded-xl cursor-pointer
        px-4 py-2.5
        transition-all
    "
                >
                    <LogOut className="w-5 h-5" />
                    <span className="hidden sm:inline">Sair</span>
                </Button>
            </div>
           
            <div
                className="
    flex flex-col gap-4 pb-3
    md:flex-row md:items-center md:justify-between
  "
            >
                
                <div className="order-1 md:order-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={handleSwitchScreen}
                                    className=" cursor-pointer
                                                w-full md:w-auto
                                                bg-linear-to-r
                                                from-[#f0e087]
                                                to-[#d4c474]
                                                hover:from-[#d4c474]
                                                hover:to-[#f0e087]
                                                text-[#083d71]
                                                font-semibold
                                                px-4 py-2.5
                                                rounded-xl
                                                shadow-lg
                                                hover:shadow-xl
                                                transition-all duration-300
                                                flex items-center justify-center gap-2
                                            "
                                >
                                    <ArrowRightLeft className="w-5 h-5" />
                                    <span className="hidden sm:inline">
                                        Trocar Tela
                                    </span>
                                </Button>
                            </TooltipTrigger>

                            <TooltipContent
                                side="bottom"
                                className="font-semibold text-white"
                            >
                                <p>Validar aulas dos mentores</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

               <div
                    className="
      order-2 md:order-1
      flex items-center gap-3
      justify-center text-center
      md:justify-start md:text-left
    "
                >
                    <div
                        className="
        w-10 h-10 sm:w-12 sm:h-12
        bg-[#f0e087]
        rounded-full
        flex items-center justify-center
        shrink-0
      "
                    >
                        <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-[#083d71]" />
                    </div>

                    <div>
                        <h1
                            className="
          text-xl sm:text-2xl md:text-3xl
          font-bold text-white leading-tight
        "
                        >
                            ADMINISTRADOR
                        </h1>
                        <p
                            className="
          text-xs sm:text-sm md:text-base
          text-gray-300
        "
                        >
                            Acompanhamento de Agenda
                        </p>
                    </div>
                </div>
            </div>

            
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            
                <div className="flex flex-col gap-1">
                    <div className="text-2xl md:text-3xl font-bold text-[#f0e087]">
                        {currentTime}
                    </div>
                    <div className="text-sm md:text-base text-gray-300">
                        {currentDate}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  
                    <div className="flex gap-2">
                        <button
                            onClick={() => onTabChange('alunos')}
                            className={`px-6 py-2.5 cursor-pointer rounded-full text-sm font-medium transition-all ${
                                activeTab === 'alunos'
                                    ? 'bg-[rgb(8,61,113)] text-[#f0e087] border-b-2'
                                    : 'bg-[#0a4d8f] text-gray-300 hover:bg-[#0a4d8f]/50'
                            }`}
                        >
                            Alunos
                        </button>
                        <button
                            onClick={() => onTabChange('mentores')}
                            className={`px-6 py-2.5 cursor-pointer rounded-full text-sm font-medium transition-all ${
                                activeTab === 'mentores'
                                    ? 'bg-[#083d71] text-[#f0e087] border-b-2'
                                    : 'bg-[#0a4d8f] text-gray-300 hover:bg-[#0a4d8f]/50'
                            }`}
                        >
                            Mentores
                        </button>
                    </div>

                    {activeTab === 'mentores' && (
                        <>
                            
                            <Select
                                value={selectedMentor}
                                onValueChange={onMentorChange}
                                disabled={loading}
                            >
                                <SelectTrigger className="w-full sm:w-[200px] bg-black/50 border-none text-white">
                                    <SelectValue
                                        placeholder={
                                            loading
                                                ? 'Carregando mentores...'
                                                : 'Filtrar por Mentor'
                                        }
                                    />
                                </SelectTrigger>

                                <SelectContent>
                                    {mentors.map((mentor) => (
                                        <SelectItem
                                            key={mentor.id}
                                            value={mentor.id.toString()}
                                        >
                                            {mentor.nome}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </>
                    )}

                    {activeTab === 'alunos' && (
                        <>
                            <Select
                                value={selectedStudent}
                                onValueChange={onStudentChange}
                                disabled={loading}
                            >
                                <SelectTrigger className="w-full sm:w-[200px] bg-black/50 border-none text-white">
                                    <SelectValue
                                        placeholder={
                                            loading
                                                ? 'Carregando alunos...'
                                                : 'Filtrar por Aluno'
                                        }
                                    />
                                </SelectTrigger>

                                <SelectContent>
                                    {student.map((student) => (
                                        <SelectItem
                                            key={student.id}
                                            value={student.id.toString()}
                                        >
                                            {student.nome}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
