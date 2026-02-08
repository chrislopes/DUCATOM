import Image from 'next/image';
import { Shield } from 'lucide-react';

interface AdminLoginHeaderProps {
    accountType: string | null;
}

export function AdminLoginHeader({ accountType }: AdminLoginHeaderProps) {
    const getTitle = () => {
        if (accountType === 'aluno') return 'Criar Conta de Aluno';
        if (accountType === 'mentor') return 'Criar Conta de Mentor';
        if (accountType === 'admin') return 'Criar conta do Administrador';
        return 'Acesso Administrativo';
    };

    return (
        <div className="flex flex-col items-center space-y-6">
            <div className="relative w-20 h-20 md:w-24 md:h-24">
                <Image
                    src="/ducatom_logo.png"
                    alt="Logo"
                    fill
                    className="object-contain"
                    priority
                />
            </div>

            <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-2">
                    <Shield className="w-6 h-6 md:w-7 md:h-7 text-[#f0e087]" />
                    <h1 className="text-[#f0e087] text-xl md:text-2xl font-bold">
                        Acesso Administrativo
                    </h1>
                </div>
                <p className="text-white text-sm md:text-base">{getTitle()}</p>
                <p className="text-white/70 text-xs md:text-sm max-w-sm text-balance">
                    Somente administradores podem criar contas de alunos,
                    mentores e administradores.
                </p>
            </div>
        </div>
    );
}
