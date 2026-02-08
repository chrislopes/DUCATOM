import { AgendaMentor } from './agenda-mentor';

export interface UserModel {
    id: string;
    email: string;
    nome: string;
    role: string;
}

export interface StudentData {
    id: number;
    credito: number;
    free_assinatura: boolean;
    nome: string;
}

export interface MentorData {
    id: number;
    nivel: number;
    especialidade: string;
    nome: string;
}

export interface WeekDayData {
    id: number;
    mentor_id: number;
    weekday: number;
}

export interface ListMentor {
    id: string;
    nome: string;
    especialidade: string;
    nivel: number;
    avatar?: string;
    isFavorite?: boolean;
    agenda_publicada: boolean;
    agenda_mentor: AgendaMentor[];
}

export interface MentorScheduleStats {
    mentor_id: number;
    mentor_nome: string;
    total_horarios: number;
    total_reservados: number;
}

export interface Mentor {
    id: number;
    nome: string;
    especialidade: string;
    nivel: number;
    agenda_publicada: boolean;
}

export interface StudentBooking {
    booking_id: number;
    status: string;
    booking_date: string;
    created_at: string;
    aluno_id: number;
    aluno_nome: string;
    mentor_id: number;
    mentor_nome: string;
    start_time: string;
}
