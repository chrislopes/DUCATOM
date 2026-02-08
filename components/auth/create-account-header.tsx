import { UserPlus, Music } from 'lucide-react';

interface CreateAccountHeaderProps {
    accountType: 'aluno' | 'mentor' | 'admin';
}
const accountConfig = {
    aluno: {
        title: 'Criar Conta Aluno',
        description: 'Preencha os dados para criar uma nova conta de aluno',
    },
    mentor: {
        title: 'Criar Conta Mentor',
        description: 'Preencha os dados para criar uma nova conta de mentor',
    },
    admin: {
        title: 'Criar Conta Administrador',
        description:
            'Preencha os dados para criar uma nova conta de administrador',
    },
} as const;

export function CreateAccountHeader({ accountType }: CreateAccountHeaderProps) {
    const { title, description } = accountConfig[accountType];

    return (
        <div className="text-center space-y-4 md:space-y-6">
            <div className="flex justify-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-[#f0e087] rounded-full flex items-center justify-center">
                    <UserPlus className="w-8 h-8 md:w-10 md:h-10 text-[#083d71]" />
                </div>
            </div>

            <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                    {title}
                </h1>
                <p className="text-sm md:text-base text-white/80">
                    {description}
                </p>
            </div>
        </div>
    );
}
