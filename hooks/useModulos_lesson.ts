import {  useState } from 'react';
import { toast } from 'sonner';

import { Module, Lesson, MentorAula } from '@/model/lesson-mentor';
import {
    getMentorLessonService,
    searchLessonService,
    searchModulosService,
    sendMentorLessonService,
    updateMentorLessonStatusFeedbackService,
    updateMentorLessonStatusService,
} from '@/service/modulos_lessons_mentor.service';

export function useModuleLessonMentor() {
    const [loading, setLoading] = useState(false);
    const [modules, setModules] = useState<Module[]>([]);

    async function loadModulesAndLessons(mentorId: number) {
        if (!mentorId) {
            toast.error('Id do mentor não informado');
            return;
        }

        setLoading(true);
        try {
            
            const moduleResponse = await searchModulosService();

            if (!moduleResponse.success) {
                toast.error(
                    moduleResponse.message || 'Erro ao carregar os módulos.',
                );
                return;
            }

           
            const modulesWithLessons: Module[] = await Promise.all(
                moduleResponse.data.map(async (modulo: any) => {
                    const lessonResponse = await searchLessonService(
                        mentorId,
                        modulo.id,
                    );

                    if (!lessonResponse.success) {
                        toast.error(
                            lessonResponse.message ||
                                `Erro ao carregar aulas do módulo ${modulo.title}`,
                        );

                        return {
                            id: String(modulo.id),
                            title: modulo.title,
                            nivel: modulo.nivel,
                            lessons: [],
                        };
                    }

                    const lessonsMapped: Lesson[] = lessonResponse.data.map(
                        (lesson: any) => ({
                            id: String(lesson.aula_id),
                            title: `${lesson.aula_titulo} - ${lesson.aula_descricao}`,
                            status: lesson.status,
                            videoUrl: lesson.video,
                        }),
                    );

                    return {
                        id: String(modulo.id),
                        title: modulo.title,
                        nivel: modulo.nivel,
                        lessons: lessonsMapped,
                    };
                }),
            );

            setModules(modulesWithLessons);
        } catch (error: any) {
            toast.error(
                error?.message ||
                    'Erro inesperado ao carregar módulos e aulas.',
            );
        } finally {
            setLoading(false);
        }
    }

    return {
        modules,
        loading,
        loadModulesAndLessons,
    };
}

export function useControlLessonMentor() {
    const [loading, setLoading] = useState(false);
    const [lessonProgress, setLessonProgress] = useState<MentorAula | null>(
        null,
    );

    
    async function fetchMentorLesson(aula_id: number, mentor_id: number) {
        if (!aula_id || !mentor_id) {
            toast.error('Aula ou mentor não informado');
            return null;
        }

        setLoading(true);

        try {
            const response = await getMentorLessonService(aula_id, mentor_id);

            if (!response.success) {
                toast.error(response.message);
                return null;
            }

            setLessonProgress(response.data);
            return response.data;
        } catch (error: any) {
            toast.error(error?.message || 'Erro ao buscar progresso da aula');
            return null;
        } finally {
            setLoading(false);
        }
    }

  
    async function createMentorLesson(aula_id: number, mentor_id: number) {
        if (!aula_id || !mentor_id) {
            toast.error('Aula ou mentor não informado');
            return null;
        }

        setLoading(true);

        try {
            const response = await sendMentorLessonService(aula_id, mentor_id);

            if (!response.success) {
                toast.error(response.message);
                return null;
            }

            setLessonProgress(response.data);
            return response.data;
        } catch (error: any) {
            toast.error(error?.message || 'Erro ao registrar aula do mentor');
            return null;
        } finally {
            setLoading(false);
        }
    }

   
    async function ensureMentorLesson(aula_id: number, mentor_id: number) {
        const existing = await fetchMentorLesson(aula_id, mentor_id);

        if (existing) return existing;

        return await createMentorLesson(aula_id, mentor_id);
    }

    return {
        lessonProgress,
        loading,
        fetchMentorLesson,
        createMentorLesson,
        ensureMentorLesson,
    };
}

export function useSendLessonWhatsAppMentor() {
    const [loading, setLoading] = useState(false);

    async function changeStatus(
        aulaId: number,
        mentorId: number,
        status: string,
    ) {
        setLoading(true);
        try {
            const resp = await updateMentorLessonStatusService(
                aulaId,
                mentorId,
                status,
            );

            if (!resp.success) {
                toast.error(resp.message);
                return false;
            }

            toast.success('Aula enviada para análise');
            return true;
        } catch {
            toast.error('Erro inesperado ao atualizar status');
            return false;
        } finally {
            setLoading(false);
        }
    }

    return {
        loading,
        changeStatus,
    };
}

// MENTOR ENVIA O VIDEO DA AULA PARA O ADMIN
export function useUpdateMentorLessonStatusFeedback() {
    const [loading, setLoading] = useState(false);

    async function sendAdminFeedbackStatus(
        aulaId: number,
        mentorId: number,
        status: 'aprovado' | 'negado',
        feedback_admin?: string,
    ) {
        setLoading(true);
        try {
            const resp = await updateMentorLessonStatusFeedbackService(
                aulaId,
                mentorId,
                status,
                feedback_admin
            );

            if (!resp.success) {
                toast.error(resp.message);
                return false;
            }
            toast.success('Status atualizado com sucesso!');
            return true;
        } catch {
            toast.error('Erro inesperado ao atualizar status');
            return false;
        } finally {
            setLoading(false);
        }
    }

    return {
        loading,
        sendAdminFeedbackStatus,
    };
}
