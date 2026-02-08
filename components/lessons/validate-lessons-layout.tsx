'use client';

import { useEffect, useRef, useState } from 'react';
import { ValidateLessonsHeader } from './validate-lessons-header';
import { ModulesList } from './modules-list';
import { ValidateLessonsBackButton } from './validate-lessons-back-button';
import { Module } from '@/model/lesson-mentor';
import { useModuleLessonMentor } from '@/hooks/useModulos_lesson';
import { LoadingScreen } from '../ui/loading-screen';
import { Mentor, MentorData, UserModel } from '@/model/user-model';
import { useDashboardAdmin } from '@/hooks/useDashboard_Admin';

export function ValidateLessonsLayout() {
    const { modules, loading, loadModulesAndLessons } = useModuleLessonMentor();
    const [adminPersona, setAdminPersona] = useState<UserModel | null>(null);
    const [mentorUser, setMentorUser] = useState<MentorData>();
    const isAdmin = adminPersona?.role === 'ADMIN';

    const { byMentorIdAdmin, mentorId } = useDashboardAdmin();

    const [selectedMentorId, setSelectedMentorId] = useState<number | null>(
        null,
    );

    const mentorNivelFinal = isAdmin
        ? (mentorId?.nivel ?? 0)
        : (mentorUser?.nivel ?? 0);

    const didRun = useRef(false);

    useEffect(() => {
        if (didRun.current) return;
        didRun.current = true;

        const auth_admin = localStorage.getItem('auth_user');
        if (auth_admin) {
            setAdminPersona(JSON.parse(auth_admin));
        }

        const saved = localStorage.getItem('mentor_id');
        if (saved) {
            setMentorUser(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        if (isAdmin) {
            if (!selectedMentorId) return;
            loadModulesAndLessons(selectedMentorId);
            byMentorIdAdmin(selectedMentorId);
        } else {
            if (!mentorUser?.id) return;
            loadModulesAndLessons(mentorUser.id);
        }
    }, [isAdmin, selectedMentorId, mentorUser?.id]);

    return (
        <div className="min-h-screen bg-[#083d71] flex flex-col">
            <div className="flex-1 flex flex-col p-4 md:p-8  mx-auto w-full">
                <ValidateLessonsHeader
                    isAdmin={isAdmin}
                    onMentorSelect={setSelectedMentorId}
                />

                {selectedMentorId === null && isAdmin && (
                    <div className="pt-5">
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
                                    Para acompanhar o histórico de aulas e
                                    validar as aulas realizadas, selecione um
                                    mentor no filtro de mentores.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex-1 mt-6 md:mt-8 ">
                    {loading ? (
                        <LoadingScreen />
                    ) : (
                        <ModulesList
                            modules={modules}
                            mentorNivel={mentorNivelFinal}
                            mentorID={selectedMentorId}
                        />
                    )}
                </div>

                <ValidateLessonsBackButton />
            </div>
        </div>
    );
}
export type { Module };
