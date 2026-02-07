'use client';

import { useState, useEffect, useRef } from 'react';
import { ScheduleControlHeader } from './schedule-control-header';
import { AvailableTimesSection } from './available-times-section';
import { ScheduleWarning } from './schedule-warning';
import { ScheduleActions } from './schedule-actions';
import { ScheduleBackButton } from './schedule-back-button';

import {
    useDeleteTimeSlotMentor,
    useGetWeekDay_timeSlotMentor,
} from '@/hooks/useAvailabilityMentor';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { usePublishAgendaMentor } from '@/hooks/usePublishAgendaMentor';
import { MentorData } from '@/model/user-model';

export function ScheduleControlLayout() {
    const { searchWeekDay_timeSlot_Mentor, timeSlots, loading } =
        useGetWeekDay_timeSlotMentor();
    const { publishAgendaMentor, loading: loadingPublish } =
        usePublishAgendaMentor();
    const { deleteTimeSlot, loadingDelete } = useDeleteTimeSlotMentor();
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
    const [mentorUser, setMentorUser] = useState<MentorData>();

    const [agendaPublicada, setAgendaPublicada] = useState(false);

    const didRun = useRef(false);

    useEffect(() => {
        if (didRun.current) return;
        didRun.current = true;

        const saved = localStorage.getItem('mentor_id');
        if (saved) {
            const mentor = JSON.parse(saved);
            setMentorUser(mentor);

            setAgendaPublicada(mentor.agenda_publicada === true);
            searchWeekDay_timeSlot_Mentor(mentor?.id);
        }
    }, []);

    const handleRemoveTimeSlot = (id: number) => {
        setSelectedSlotId(id);
        setOpenDialog(true);
    };

    const confirmDelete = async () => {
        if (!selectedSlotId) return;

        await deleteTimeSlot(selectedSlotId);

        if (!mentorUser?.id) {
            throw new Error('ID do mentor não encontrado');
        }
        await searchWeekDay_timeSlot_Mentor(mentorUser?.id);

        console.log(timeSlots.length);

        if (timeSlots.length <= 6) {
            setAgendaPublicada(false);

            localStorage.setItem(
                'mentor_id',
                JSON.stringify({
                    ...mentorUser,
                    agenda_publicada: false,
                }),
            );
        }

        setOpenDialog(false);
        setSelectedSlotId(null);
    };

    const handleConfirmAgenda = async () => {
        if (!mentorUser?.id) {
            console.error('Mentor ID não encontrado no localStorage');
            return;
        }

        if (timeSlots.length < 6) return;

        const success = await publishAgendaMentor(mentorUser?.id);
        console.log(success);

        setAgendaPublicada(true);

        localStorage.setItem(
            'mentor_id',
            JSON.stringify({
                ...mentorUser,
                agenda_publicada: true,
            }),
        );
    };

    const hasMinimumSlots = timeSlots.length >= 6;

    return (
        <div className="min-h-screen bg-[#083d71] flex items-center justify-center p-4">
            <div className="w-full max-w-2xl space-y-6 py-8">
                <ScheduleControlHeader />

                {loading ? (
                    <p className="text-center text-white">Carregando...</p>
                ) : (
                    <AvailableTimesSection
                        timeSlots={timeSlots}
                        onRemoveSlot={handleRemoveTimeSlot}
                    />
                )}

                {!hasMinimumSlots && (
                    <ScheduleWarning slotsCount={timeSlots.length} />
                )}

                <div className="flex flex-col justify-center items-center py-2">
                    <div className="w-full border rounded p-4">
                        <span className="text-sm text-white py-3">
                            <p className="w-full text-lg font-bold text-center text-red-500">
                                Atenção
                            </p>
                            <p className="text-center text-base">
                                Sempre que adicionar uma nova data com horário,
                                clique em
                            </p>
                            <h5 className="mx-1 text-center text-lg font-bold text-[#f0e087]">
                                “Confirmar agenda”
                            </h5>
                            <p className="text-center text-base">
                                Para que o horário fique visível para os alunos.
                                Horários não confirmados não serão exibidos.
                            </p>
                        </span>
                    </div>

                    <h2 className="text-white text-2xl font-bold p-2">
                        Sua agenda está:
                    </h2>
                    <span
                        className={`text-xl font-semibold ${
                            agendaPublicada ? 'text-green-400' : 'text-red-400'
                        }`}
                    >
                        {agendaPublicada ? 'Ativa' : 'Desativada'}
                    </span>
                </div>

                <ScheduleActions
                    onCancelClick={() => {}}
                    onConfirmClick={handleConfirmAgenda}
                    confirmDisabled={!hasMinimumSlots || loadingPublish}
                />

                <ScheduleBackButton />
            </div>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="bg-white">
                    <DialogHeader>
                        <DialogTitle>Confirmar exclusão</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja remover este horário?
                            <br /> Lembrando, caso sua agenda tenha menos de 6
                            horários disponíveis, ela deixará de ser divulgada.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setOpenDialog(false)}
                            disabled={loadingDelete}
                        >
                            Cancelar
                        </Button>

                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            disabled={loadingDelete}
                        >
                            {loadingDelete ? 'Removendo...' : 'Confirmar'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
