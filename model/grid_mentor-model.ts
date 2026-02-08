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


export interface MentorAgendaSlotHistory {
    time: string;
    status: BackendSlotStatus;
    disponivel: boolean;
    description: string | null;
    id_aluno: number | null;
    nome_aluno: string | null;
    created_at: string; 
}

export interface MentorAgendaSlot {
    time: string;

   
    status: BackendSlotStatus;

    disponivel: boolean;

 
    description: string | null;
    id_aluno: number | null;
    nome_aluno: string | null;
    created_at: string;
    
    history?: MentorAgendaSlotHistory[];
}

export interface MentorAgendaDay {
    date: string;
    weekday: number;
    slots: MentorAgendaSlot[];
}


export interface MentorAgendaSummary {
    total_slots: number;
    reserved: number;
    available: number;
}


export interface MentorAgendaGridResponse {
   
    agenda_publicada: boolean;

    
    summary?: MentorAgendaSummary;

   
    days?: MentorAgendaDay[];
}
