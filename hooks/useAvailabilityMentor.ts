import {
    deleteTimeSlotMentorService,
    searchAvailabilityWeekDayMentorService,
    searchWeekDay_timeSlotMentorService,
    sendAvailabilityMentorService,
    sendAvailabilityTimeSlotMentorService,
} from '@/service/availability-mentor.service';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useDashboardUser } from './useDashboard';
import { WeekDayData } from '@/model/user-model';
import { TimeSlot } from '@/model/time-availiability-mentor';
import { mapNumberToDay } from '@/utils/mapWeekday';

//POST CADASTRA OS DIAS DISPONIVEL DO MENTOR
export function useAvailabilityMentor() {
    const [loading, setLoading] = useState(false);

    async function createAvailabilityMentor(
        p_mentor_id: number,
        p_weekday: number
    ) {
        setLoading(true);

        const result = await sendAvailabilityMentorService(
            p_mentor_id,
            p_weekday
        );

        if (!result.success) {
            toast.error(result.message || 'Erro no cadastro do dia.');

            setLoading(false);
            return null;
        }

        toast.success('Dia da semana cadastrado com sucesso!');

        setLoading(false);
        return result.data;
    }

    return {
        createAvailabilityMentor,
        loading,
    };
}
//GET BUSCA OS DIAS DISPONIVEL QUE O MENTOR CADASTROU
export function useGetWeekDayAvailabilityMentor() {
    const [loading, setLoading] = useState(false);
    const [weekdayData, setWeekdayData] = useState<WeekDayData | null>(null);
    const { mentorData } = useDashboardUser();

    async function searchWeekDayAvailabilityMentor() {
        try {
            setLoading(true);

           const idMentor = mentorData?.id;

            if (!idMentor) {
                throw new Error('ID do mentor não encontrado');
            }

            const result = await searchAvailabilityWeekDayMentorService(
                idMentor
            );

            if (!result.success) {
                toast.error(
                    result.message ||
                        'Erro ao buscar dias disponiveis do mentor.'
                );

                setLoading(false);
                return null;
            }

            toast.success('Sucesso na busca dos dias disponiveis do Mentor!');

            setLoading(false);
            setWeekdayData(result.data);
        } catch (error: any) {
            toast.error(error?.message || 'Tente novamente mais tarde.');
            return null;
        } finally {
            setLoading(false);
        }
    }

    return {
        searchWeekDayAvailabilityMentor,
        weekdayData,
        loading,
    };
}

//POST CADASTRA OS HORARIOS DISPONIVEL DO MENTOR
export function useAvailabilityTimeSlotMentor() {
    const [loading, setLoading] = useState(false);

    async function createTimeSlot(
        mentor_weekday_id: number,
        start_time: string
    ) {
        setLoading(true);

        const result = await sendAvailabilityTimeSlotMentorService(
            mentor_weekday_id,
            start_time
        );

        if (!result.success) {
            toast.error(result.message || 'Erro ao cadastrar horário.');
            setLoading(false);
            return null;
        }

        toast.success('Horário cadastrado com sucesso!');
        setLoading(false);
        return result.data;
    }

    return {
        createTimeSlot,
        loading,
    };
}

//GET BUSCAR OS HORARIOS E DIA DISPONIVEIS QUE O MENTOR CADASTROU PARA ELE
export function useGetWeekDay_timeSlotMentor() {
    const [loading, setLoading] = useState(false);
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
   

    async function searchWeekDay_timeSlot_Mentor(mentor_id: number) {
        try {
            setLoading(true);

            if (!mentor_id) {
                throw new Error('ID do mentor não encontrado');
            }

            const result = await searchWeekDay_timeSlotMentorService(mentor_id);

            if (!result.success) {
                toast.error(
                    result.message ||
                        'Erro ao buscar dias e horarios disponiveis do mentor.'
                );

                setLoading(false);
                return null;
            }

          
            const mapped = result.data.map((item: any) => ({
                id: item.id.toString(),
                day: mapNumberToDay(item.dia_semana),
                startTime: item.start_time.substring(0, 5), 
            }));

            setTimeSlots(mapped);

            return mapped;
        } catch (error: any) {
            toast.error(error?.message || 'Tente novamente mais tarde.');
            return null;
        } finally {
            setLoading(false);
        }
    }

    return {
        searchWeekDay_timeSlot_Mentor,
        timeSlots,
        loading,
    };
}

//DELETE DELETAR O HORARIO DO MENTOR QUE ELE CADASTROU

export function useDeleteTimeSlotMentor() {
    const [loadingDelete, setLoadingDelete] = useState(false);

    async function deleteTimeSlot(slotId: number) {
        setLoadingDelete(true);

        const result = await deleteTimeSlotMentorService(slotId);

        if (!result.success) {
            toast.error(result.message || 'Erro ao remover horário.');
            setLoadingDelete(false);
            return false;
        }

        toast.success('Horário removido com sucesso!');
        setLoadingDelete(false);
        return true;
    }

    return {
        deleteTimeSlot,
        loadingDelete,
    };
}
