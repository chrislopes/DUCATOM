import { useAuth } from '@/contexts/auth-context';
import { useMentorWeekday } from '@/contexts/MentorWeekdayContext';
import { MentorData, StudentData } from '@/model/user-model';
import {
    byIdStudentService,
    byIdMentorService,
} from '@/service/dashboard-user.service';
import { useState } from 'react';
import { toast } from 'sonner';

export function useDashboardUser() {
    const [loading, setLoading] = useState(false);
    const [studentData, setStudentData] = useState<StudentData | null>(null);
    const [mentorData, setMentorData] = useState<MentorData | null>(null);
    const { user } = useAuth();
    const { setMentorId } = useMentorWeekday();

    async function byIdUser() {
        setLoading(true);
        try {
            if (!user?.id) {
                toast.error('Id do usuário não recebido ou undefined');
                throw new Error('Usuário não autenticado');
            }

            if (user?.role == 'STUDENT') {
                const response = await byIdStudentService(user?.id);

                if (!response.success) {
                    toast.error(
                        response.message || 'Erro ao carregar dados do aluno.'
                    );
                    return null;
                }
                
                localStorage.setItem(
                    'aluno_id',
                    JSON.stringify(response.data[0])
                );

                setStudentData(response.data[0]);
            } else if (user?.role == 'MENTOR') {

                const response = await byIdMentorService(user?.id);

                if (!response.success) {
                    toast.error(
                        response.message || 'Erro ao carregar dados do aluno.'
                    );
                    return null;
                }

                setMentorData(response.data[0]);

                setMentorId(response.data[0].id);
            } else {
               
            }
        } catch (error: any) {
            toast.error(error?.message || 'Erro ao carregar dados do usuario.');
            return null;
        } finally {
            setLoading(false);
        }
    }

    return {
        byIdUser,
        studentData,
        mentorData,
        loading,
    };
}
