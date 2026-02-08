'use client';

import { useState } from 'react';
import { createAdminService } from '@/service/create-user.service';
import { toast } from 'sonner';

export function useCreateAdmin() {
    const [loading, setLoading] = useState(false);

    async function createAdmin(
        name: string,
        email: string,
        password: string
    ) {
        try {
            setLoading(true);

            const result = await createAdminService(name, email, password);

            if (!result.success) {
                toast.error(result.message || 'Erro no cadastro do Administrador.');
                return null;
            }

            toast.success('Administrador criado com sucesso!');

            return result.data;
        } catch (error: any) {
            toast.error(error?.message || 'Tente novamente mais tarde.');
            return null;
        } finally {
            setLoading(false);
        }
    }

    return {
        createAdmin,
        loading,
    };
}
