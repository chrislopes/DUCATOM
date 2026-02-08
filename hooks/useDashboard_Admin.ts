import {
    Mentor,
    MentorData,
    MentorScheduleStats,
    StudentBooking,
    StudentData,
} from '@/model/user-model';
import {
    byMentorByIDService,
    byMentorListService,
    byStudentListService,
    getHistoryStudentByIdService,
    searchTotalTimeWeekdayService,
} from '@/service/dashboard-user.service';
import { useState } from 'react';
import { toast } from 'sonner';

export function useDashboardAdmin() {
    const [loading, setLoading] = useState(false);
    const [studentData, setStudentData] = useState<StudentData[]>([]);
    const [mentorData, setMentorData] = useState<MentorData[]>([]);

    const [mentorId, setMentorId] = useState<Mentor | null>(null);
    const [studentBookingId, setStudentBookingId] = useState<StudentBooking[]>(
        [],
    );

    const [studentId, setStudentId] = useState([]);

    const [scheduleStats, setScheduleStats] =
        useState<MentorScheduleStats | null>(null);

    async function byListMentorAdmin() {
        setLoading(true);
        try {
            const response = await byMentorListService();

            if (!response.success) {
                toast.error(
                    response.message || 'Erro ao carregar lista de mentores.',
                );
                return;
            }
            const data = response.data || [];
            setMentorData(data);
        } catch (error: any) {
            toast.error(
                error?.message || 'Erro ao carregar lista de mentores.',
            );
        } finally {
            setLoading(false);
        }
    }

    async function byListStudenteAdmin() {
        setLoading(true);
        try {
            const response = await byStudentListService();

            if (!response.success) {
                toast.error(
                    response.message || 'Erro ao carregar lista de alunos.',
                );
                return;
            }
            const data = response.data || [];
            setStudentData(data);
        } catch (error: any) {
            toast.error(error?.message || 'Erro ao carregar lista de alunos.');
        } finally {
            setLoading(false);
        }
    }

    //    GET BUSCAR MENTOR POR VIA ID NA TABELA MENTOR
    async function byMentorIdAdmin(id: number) {
        setLoading(true);
        try {
            if (!id) {
                throw new Error('ID do mentor não encontrado');
            }

            const result = await byMentorByIDService(id);

            if (!result.success) {
                toast.error(result.message || 'Erro ao buscar mentor.');

                setLoading(false);
                return null;
            }

            setMentorId(result.data[0]);

            setLoading(false);
        } catch (error: any) {
            toast.error(error?.message || 'Tente novamente mais tarde.');
            return null;
        } finally {
            setLoading(false);
        }
    }

    // GET BUSCAR HISTORICO DO ALUNO POR VIA ID FUNCTION RPC
    async function getHistoryStudentByIdHook(aluno_id_param: number) {
        setLoading(true);
        try {
            if (!aluno_id_param) {
                throw new Error('ID do Aluno não encontrado');
            }

            const response = await getHistoryStudentByIdService(aluno_id_param);

            if (!response.success) {
                toast.error(
                    response.message || 'Erro ao buscar dados de Aluno',
                );
                return;
            }

            setStudentBookingId(response.data);
           
        } catch (error: any) {
            toast.error(error?.message || 'Erro ao buscar dados do Aluno');
        } finally {
            setLoading(false);
        }
    }

    async function getMentorScheduleStats(mentorId: number) {
        setLoading(true);
        try {
            const response = await searchTotalTimeWeekdayService(mentorId);

            if (!response.success) {
                toast.error(
                    response.message ||
                        'Erro ao buscar dados de horários disponiveis e reservados do mentor.',
                );
                return;
            }

            const [data] = response.data || [];
            setScheduleStats(data ?? null);
        } catch (error: any) {
            toast.error(
                error?.message ||
                    'Erro ao buscar dados de horários disponiveis e reservados do mentor.',
            );
        } finally {
            setLoading(false);
        }
    }

    return {
        loading,
        mentorData,
        studentData,
        scheduleStats,
        byListMentorAdmin,
        byListStudenteAdmin,
        getMentorScheduleStats,
        byMentorIdAdmin,
        mentorId,
        getHistoryStudentByIdHook,
        studentBookingId,
    };
}
