'use client';

import { useState } from 'react';
import { loginService } from '@/service/auth.service';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth-context';

export function useLogin() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { setUser } = useAuth(); 

    async function handleLogin(email: string, password: string) {
        setLoading(true);
        const result = await loginService(email, password);

        if (result.success) {
            const userData = result.data.user;

            
            const parsedUser = {
                id: userData.id,
                email: userData.email,
                nome: userData.user_metadata.nome,
                role: userData.user_metadata.role,
                token: result.data.access_token,
            };

            
            document.cookie = `sb_access_token=${result.data.access_token}; path=/; max-age=86400`;
            document.cookie = `sb_role=${userData.user_metadata.role}; path=/; max-age=86400`;

            setUser(parsedUser);

            setTimeout(() => {
                toast.success('Login realizado!');
                setLoading(false);

                if (parsedUser.role === 'ADMIN') {
                    router.push('/admin/dashboard-admin');
                } else {
                    router.push('/dashboard');
                }
            }, 3000);
        } else {
            toast.error(result.message || 'Erro ao realizar o login');
            setLoading(false);
        }
    }

    return { handleLogin, loading };
}
