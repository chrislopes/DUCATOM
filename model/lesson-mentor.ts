export type LessonStatus = 'em aberto' | 'em análise' | 'negado' | 'aprovado';

export interface Lesson {
    id: string;
    title: string;
    status: LessonStatus;
    videoUrl?: string;
}

export interface Module {
    id: string;
    title: string;
    nivel: number;
    lessons: Lesson[];
}

export interface MentorAula {
    id: number;
    aula_id: number;
    mentor_id: number;
    status: LessonStatus;
    video_submetido: string | null;
    feedback_admin: string | null;
    created_at: string; 
    updated_at: string; 
}
