'use client';

import { useState } from 'react';
import { adminLoginService } from '@/service/admin-auth.service';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useAdminLogin() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleAdminLogin(
        email: string,
        password: string,
        accountType: string | null,
    ) {
        setLoading(true);

        const result = await adminLoginService(email, password);

        if (result.success) {
            const userData = result.data.user;
            document.cookie = `sb_access_token=${result.data.access_token}; path=/; max-age=86400`;
            document.cookie = `sb_role=${userData.user_metadata.role}; path=/; max-age=86400`;
        }

        setLoading(false);

        if (!result.success) {
            toast.error(result.message || 'Erro ao realizar o login ADMIN');
            return;
        }

     
        if (accountType === 'aluno') {
            toast.success('Login realizado!');
            router.push('/criar-aluno');
        } else if (accountType === 'mentor') {
            toast.success('Login realizado!');
            router.push('/criar-mentor');
        } else if (accountType === 'admin') {
            toast.success('Login realizado!');
            router.push('/criar-admin');
        } else {
            router.push('/');
        }
    }

    return { handleAdminLogin, loading };
}
