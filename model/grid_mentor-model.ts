export type BackendSlotStatus =
    | 'empty'
    | 'available'
    | 'pendente_aprovacao'
    | 'reservado'
    | 'negado_mentor'
    | 'negado_aluno'
    | 'cancelado_mentor'
    | 'cancelado_aluno'
    | 'negado_inatividade'
    | 'no_show'
    | 'concluido';

/**
 * Representa um evento histórico de um slot
 */
export interface MentorAgendaSlotHistory {
    time: string;
    status: BackendSlotStatus;
    disponivel: boolean;
    description: string | null;
    id_aluno: number | null;
    nome_aluno: string | null;
    created_at: string; // timestamp do backend
}

/**
 * Representa um horário específico dentro de um dia
 */

export interface MentorAgendaSlot {
    time: string;

    /** status bruto vindo do backend */
    status: BackendSlotStatus;

    /** estado atual do slot */
    disponivel: boolean;

    /** histórico / contexto */
    description: string | null;
    id_aluno: number | null;
    nome_aluno: string | null;
    created_at: string;
    /** Histórico de alterações desse slot */
    history?: MentorAgendaSlotHistory[];
}

export interface MentorAgendaDay {
    date: string;
    weekday: number;
    slots: MentorAgendaSlot[];
}

/**
 * (Opcional) Resumo da agenda
 * Pode ser usado para dashboards/estatísticas
 */
export interface MentorAgendaSummary {
    total_slots: number;
    reserved: number;
    available: number;
}

/**
 * Resposta do RPC get_mentor_agenda_grid
 */
export interface MentorAgendaGridResponse {
    /**
     * Indica se o mentor publicou a agenda
     */
    agenda_publicada: boolean;

    /**
     * Resumo opcional
     */
    summary?: MentorAgendaSummary;

    /**
     * Dias do grid (hoje + 5 dias)
     */
    days?: MentorAgendaDay[];
}
