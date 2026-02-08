'use client';

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from 'react';
import { supabase } from '@/service/endpoints/supabaseAuth.api';
import { toast } from 'sonner';

interface ResetPasswordContextProps {
    password: string;
    confirmPassword: string;
    loading: boolean;
    setPassword: (value: string) => void;
    setConfirmPassword: (value: string) => void;
    handleResetPassword: () => Promise<void>;
}

const ResetPasswordContext = createContext<ResetPasswordContextProps | null>(
    null
);

export function ResetPasswordProvider({ children }: { children: ReactNode }) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const hash = window.location.hash;

       
        if (hash.includes('type=recovery')) {
            const doExchange = async () => {
                const { data, error } =
                    await supabase.auth.exchangeCodeForSession(hash);

                if (error) {
                    console.error('Erro ao trocar token:', error);
                    return;
                }

                console.log('Sessão restaurada via recovery:', data);
            };

            doExchange();
        }
    }, []);

    const handleResetPassword = async () => {
        if (!password || !confirmPassword) {
            toast.error('Preencha todos os campos.');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('As senhas não coincidem.');

            return;
        }

        if (password.length < 6) {
            toast.error('A senha deve conter no mínimo 6 caracteres.');

            return;
        }

        setLoading(true);

        const { error } = await supabase.auth.updateUser({
            password,
        });

        setLoading(false);

        if (error) {
            console.error('Erro ao atualizar senha:', error);
            toast.error('Erro ao redefinir senha.');

            return;
        }

        toast.success('Senha redefinida com sucesso!!');
        window.location.href = '/';
    };

    return (
        <ResetPasswordContext.Provider
            value={{
                password,
                confirmPassword,
                loading,
                setPassword,
                setConfirmPassword,
                handleResetPassword,
            }}
        >
            {children}
        </ResetPasswordContext.Provider>
    );
}

export function useResetPassword() {
    const context = useContext(ResetPasswordContext);
    if (!context) {
        throw new Error(
            'useResetPassword deve ser usado dentro de ResetPasswordProvider'
        );
    }
    return context;
}
