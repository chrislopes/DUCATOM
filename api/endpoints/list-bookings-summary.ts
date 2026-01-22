import { supabaseAuth } from '../supabaseAuth.api';

// MENTOR/ALUNO BUSCAR BOOKINGS/RESERVAS PERSONALIZADO VIA RPC rpc_get_agenda_dashboard
export async function byBookingsListSummaryRequest(p_user_id: number) {
    const url = '/rest/v1/rpc/rpc_get_agenda_dashboard';
    const body = { p_user_id };
    const resp = await supabaseAuth.post<any>(url, body);
    return resp.data;
}
