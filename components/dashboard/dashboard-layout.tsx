'use client';

import { DashboardHeader } from './dashboard-header';
import { DashboardGreeting } from './dashboard-greeting';
import { NextClassSection } from './next-class-section';
import { DashboardNavigation } from './dashboard-navigation';
import { HelpButton } from './help-button';
import { useAuth } from '@/contexts/auth-context';
import { useEffect, useRef, useState } from 'react';
import { useDashboardUser } from '@/hooks/useDashboard';
import { ModalValidateMentor } from './modal-mentor-validate';
import { useBookingsListSummary } from '@/hooks/use-ListBookings';


export function DashboardLayout() {
    const { user } = useAuth();
    const { byIdUser, studentData, mentorData } = useDashboardUser();

    const { byBookingsListSummary, listBookings, loading } =
        useBookingsListSummary();

    const [openValidateMentorModal, setOpenValidateMentorModal] =
        useState(false);

    const userData = {
        name: user?.nome.split(' ')[0] || 'Usuário',
        credits: studentData?.credito ?? 0,
        nivel: mentorData?.nivel ?? 0,
    };

    const didRun = useRef(false);

    useEffect(() => {
        if (didRun.current) return;
        didRun.current = true;

        byIdUser();
    }, []);

    /**
     * useEffect 2️⃣
     * Responsável APENAS por validar o nível do mentor
     * e abrir o modal se necessário
     */
    useEffect(() => {
        localStorage.setItem('mentor_id', JSON.stringify(mentorData));

        if (
            user?.role === 'MENTOR' &&
            mentorData?.nivel !== undefined &&
            mentorData.nivel >= 0 &&
            mentorData.nivel <= 3
        ) {
            setOpenValidateMentorModal(true);
        } else {
            setOpenValidateMentorModal(false);
        }

        if (user?.role === 'MENTOR') {
            if (!mentorData?.id) return;

            byBookingsListSummary(mentorData?.id);
        } else {
            if (!studentData?.id) return;
            byBookingsListSummary(studentData?.id);
        }
    }, [user?.role, mentorData?.nivel, studentData?.id]);

    
    const refreshBookings = async () => {
        if (user?.role === 'STUDENT') {
            if (!studentData?.id) return;
            await byBookingsListSummary(studentData.id);
        }

        if (user?.role === 'MENTOR') {
            if (!mentorData?.id) return;
            await byBookingsListSummary(mentorData.id);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header fixo no topo */}
            <DashboardHeader />

            {/* Conteúdo principal com scroll */}
            <main className="flex-1 px-4 py-6 md:px-8 md:py-8 lg:max-w-4xl lg:mx-auto lg:w-full">
                <div className="space-y-6 md:space-y-8">
                    {/* Saudação e créditos */}
                    {user?.role === 'STUDENT' && (
                        <DashboardGreeting
                            name={userData.name}
                            credits={userData.credits}
                        />
                    )}

                    {user?.role === 'MENTOR' && (
                        <DashboardGreeting
                            name={userData.name}
                            nivel={userData.nivel}
                        />
                    )}

                    {/* Seção da próxima aula */}

                    <NextClassSection
                        listBookings={listBookings}
                        loading={loading}
                        onRefreshBookings={refreshBookings}
                    />

                    {/* Navegação principal */}
                    <DashboardNavigation />

                    {/* Botão de ajuda */}
                    <HelpButton />
                </div>
            </main>

            <ModalValidateMentor
                open={openValidateMentorModal}
                mentorLevel={mentorData?.nivel}
                minimumLessons={4}
            />
        </div>
    );
}
