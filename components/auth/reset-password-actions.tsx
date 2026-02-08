'use client';

import { Button } from '@/components/ui/button';
import { useResetPassword } from '@/feature/reset-password-context';
import { useRouter } from 'next/navigation';

export function ResetPasswordActions() {
    const router = useRouter();

    const { loading, password, confirmPassword, handleResetPassword } =
        useResetPassword();

    const isDisabled = !password || !confirmPassword || loading;

    const onSubmit = async () => {
        const ok = await handleResetPassword();

       
        if (ok) {
            router.push('/');
        }
    };

    return (
        <div className="space-y-4">
            <Button
                onClick={onSubmit}
                disabled={isDisabled}
                className="w-full bg-[#f0e087] hover:bg-[#f0e087]/90 text-[#083d71] font-semibold h-12 md:h-14 text-base md:text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#f0e087]/20 disabled:opacity-50"
            >
                {loading ? 'Processando...' : 'Redefinir Senha'}
            </Button>

            <Button
                onClick={() => router.push('/')}
                variant="ghost"
                className="w-full text-white/70 hover:text-white hover:bg-white/5 h-12 md:h-14 text-sm md:text-base"
            >
                Voltar para o Login
            </Button>
        </div>
    );
}
