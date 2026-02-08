'use client';

import { useEffect, useRef, useState } from 'react';
import { ScheduleTrackingHeader } from './schedule-tracking-header';
import { ScheduleStats } from './schedule-stats';
import { ScheduleGrid } from './schedule-grid';
import { ScheduleStatsSkeleton } from './scheduleStatsSkeleton';

import { useDashboardAdmin } from '@/hooks/useDashboard_Admin';
import { useMentorAgendaGrid } from '@/hooks/useMentorAgendaGrid';
import { StudentsBookingsList } from './students-bookings-list';

import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export function ScheduleTrackingLayout() {
    const [activeTab, setActiveTab] = useState<'alunos' | 'mentores'>(
        'mentores',
    );
    const [selectedMentor, setSelectedMentor] = useState<string>();
    const [selectedStudent, setSelectedStudent] = useState<string>();
    const [mentorId, setMentorId] = useState<number | null>(null);
    const [studentId, setStudentId] = useState<number | null>(null);

    const {
        loading: dashboardLoading,
        mentorData,
        studentData,
        byListStudenteAdmin,
        scheduleStats,
        byListMentorAdmin,
        getMentorScheduleStats,
    } = useDashboardAdmin();

    const {
        loading: gridLoading,
        agendaGrid,
        getMentorAgendaGrid,
    } = useMentorAgendaGrid();

    const didRun = useRef(false);

    useEffect(() => {
        if (didRun.current) return;
        didRun.current = true;

        byListMentorAdmin();
    }, [activeTab, byListMentorAdmin]);

    const didLoadStudents = useRef(false);

    useEffect(() => {
        if (activeTab === 'alunos' && !didLoadStudents.current) {
            didLoadStudents.current = true;
            byListStudenteAdmin();
        }
    }, [activeTab, byListStudenteAdmin]);

    function handleMentorChange(value: string) {
        const id = Number(value);

        setSelectedMentor(value);
        setMentorId(id);

        getMentorScheduleStats(id);
        getMentorAgendaGrid(id);
    }

    function handleStudentChange(value: string) {
        const id = Number(value);

        setSelectedStudent(value);
        setStudentId(id);
    }

    const hasMentorSelected = mentorId !== null;

    return (
        <div className="min-h-screen bg-[#083d71] text-white p-4 md:p-6 lg:p-8">
            <div className="max-w-[1400px] mx-auto space-y-6">
               
                <ScheduleTrackingHeader
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    mentors={mentorData ?? []}
                    selectedMentor={selectedMentor}
                    onMentorChange={handleMentorChange}
                    student={studentData ?? []}
                    selectedStudent={selectedStudent}
                    onStudentChange={handleStudentChange}
                    loading={dashboardLoading}
                />

                {activeTab === 'mentores' && (
                    <>
                      
                        {dashboardLoading && hasMentorSelected && (
                            <ScheduleStatsSkeleton />
                        )}

                        {!dashboardLoading &&
                            scheduleStats &&
                            hasMentorSelected && (
                                <ScheduleStats
                                    availableSlots={
                                        scheduleStats.total_horarios
                                    }
                                    reservedSlots={
                                        scheduleStats.total_reservados
                                    }
                                    selectedMentor={selectedMentor}
                                />
                            )}

                      
                        {gridLoading && hasMentorSelected && (
                            <div className="h-80 bg-[#0a4d8f]/30 rounded-xl animate-pulse" />
                        )}

                        <div className="w-full flex justify-center sm:justify-end">
                            <Card className="w-full max-w-xs border-none sm:max-w-sm bg-[#083d71] p-1">
                                
                                <CardContent className="p-0">
                                    <ScrollArea className="h-24 px-4 pb-4">
                                        <div className="space-y-3 text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="w-4 h-4 rounded-sm bg-green-600" />
                                                <span className="text-white">
                                                    Disponível
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className="w-4 h-4 rounded-sm bg-yellow-500" />
                                                <span className="text-white">
                                                    Pendente de aprovação
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className="w-4 h-4 rounded-sm bg-purple-600" />
                                                <span className="text-white">
                                                    Reservado
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className="w-4 h-4 rounded-sm bg-orange-600" />
                                                <span className="text-white">
                                                    Negado pelo aluno
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className="w-4 h-4 rounded-sm bg-pink-600" />
                                                <span className="text-white">
                                                    Cancelado pelo aluno
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className="w-4 h-4 rounded-sm bg-stone-500" />
                                                <span className="text-white">
                                                    Negado pelo mentor
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className="w-4 h-4 rounded-sm bg-red-800" />
                                                <span className="text-white">
                                                    Cancelado pelo mentor
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className="w-4 h-4 rounded-sm bg-linear-to-br from-emerald-700 via-emerald-800 to-gray-300" />
                                                <span className="text-white">
                                                    Concluído
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className="w-4 h-4 rounded-sm bg-linear-to-r from-[#8B2F4E] to-[#4B1F3A]" />
                                                <span className="text-white">
                                                    No-show (conflito)
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className="w-4 h-4 rounded-sm bg-black" />
                                                <span className="text-white">
                                                    Negado por inatividade
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className="w-4 h-4 rounded-sm bg-blue-600" />
                                                <span className="text-white">
                                                    Indisponível
                                                </span>
                                            </div>
                                        </div>
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        </div>

                      
                        {!gridLoading &&
                            agendaGrid &&
                            agendaGrid.agenda_publicada &&
                            agendaGrid.days && (
                                <ScheduleGrid
                                    agenda={agendaGrid.days}
                                    mentor={mentorData ?? []}
                                />
                            )}

                      
                        {!gridLoading &&
                            agendaGrid &&
                            !agendaGrid.agenda_publicada && (
                                <div className="flex flex-col items-center justify-center min-h-[300px] bg-[#0a4d8f]/30 rounded-xl border-2 border-dashed border-[#0a4d8f] p-8">
                                    <p className="text-yellow-400 font-semibold text-lg">
                                        Este mentor não possui agenda publicada
                                    </p>
                                    <p className="text-gray-300 text-sm mt-2">
                                        O mentor precisa ter no mínimo 6
                                        horários disponíveis.
                                    </p>
                                </div>
                            )}

                      
                        {!hasMentorSelected && (
                            <div className="flex flex-col items-center justify-center min-h-[400px] bg-[#0a4d8f]/30 rounded-xl border-2 border-dashed border-[#0a4d8f] p-8">
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
                                        Selecione um Mentor
                                    </h3>

                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        Para visualizar os horários disponíveis,
                                        reservados ou cancelados, selecione um
                                        mentor no filtro acima.
                                    </p>
                                </div>
                            </div>
                        )}
                    </>
                )}

             
                {activeTab === 'alunos' && (
                    <>
                        <StudentsBookingsList studentId={studentId} />
                    </>
                )}
            </div>
        </div>
    );
}
