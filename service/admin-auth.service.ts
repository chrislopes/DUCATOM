import { supabaseLoginRequest } from '@/service/endpoints/supabaseAuth.endpoint';

export async function adminLoginService(email: string, password: string) {
    try {
        const data = await supabaseLoginRequest(email, password);

        const user = data.user;
        if (!user) {
            return {
                success: false,
                message: 'Usuário não retornado pelo Supabase',
            };
        }

        const role = (user.user_metadata && user.user_metadata.role) || null;

        if (role !== 'ADMIN') {
            return {
                success: false,
                message: 'Acesso negado. Esta conta não é de administrador.',
                data: { user, role },
            };
        }

        return { success: true, data };
    } catch (error: any) {
        return {
            success: false,
            message:
                error.response?.data?.message ||
                error.message ||
                'Erro ao realizar login de admin',
        };
    }
}
