export interface ListBooking {
    booking_id: number;
    booking_date: string;
    weekday: number;
    weekday_label: string;
    start_time: string;
    status: string;
    video_link: string;
    aluno_id: number;
    aluno_nome: string;
    mentor_id: number;
    mentor_nome: string;
    description: null;
}

export type CancelAction = 'desistir' | 'cancelar';
