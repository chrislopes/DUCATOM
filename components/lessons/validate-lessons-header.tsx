import { Mentor, MentorData, UserModel } from '@/model/user-model';
import { GraduationCap, LogOut } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useDashboardAdmin } from '@/hooks/useDashboard_Admin';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { ArrowRightLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';

interface ValidateLessonsHeaderProps {
    isAdmin: boolean;
    onMentorSelect: (mentorId: number) => void;
}

export function ValidateLessonsHeader({
    isAdmin,
    onMentorSelect,
}: ValidateLessonsHeaderProps) {
    const { loading, mentorData, byListMentorAdmin } = useDashboardAdmin();
    const { user } = useAuth();
    const router = useRouter();

    const [selectedMentor, setSelectedMentor] = useState<string>();
    const [mentorUser, setMentorUser] = useState<MentorData>();
    const [adminPersona, setAdminPersona] = useState<UserModel | null>(null);

    const didRun = useRef(false);
    useEffect(() => {
        if (didRun.current) return;
        didRun.current = true;

        const auth_admin = localStorage.getItem('auth_user');
        if (auth_admin) {
            setAdminPersona(JSON.parse(auth_admin));
        }

        const saved = localStorage.getItem('mentor_id');
        if (saved) {
            setMentorUser(JSON.parse(saved));
        }
    }, []);

    const didRunMentor = useRef(false);

    useEffect(() => {
        if (didRunMentor.current) return;
        didRunMentor.current = true;

        byListMentorAdmin();
    }, [byListMentorAdmin]);

    function handleMentorChange(value: string) {
        const id = Number(value);
        setSelectedMentor(value);
        onMentorSelect(id);
    }

    const handleSwitchScreen = () => {
        router.push('/admin/dashboard-admin');
    };

    function logout() {
        document.cookie =
            'sb_access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie =
            'sb_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

        router.replace('/');
    }

    return (
        <div className="text-center space-y-3">
            {user?.role === 'MENTOR' && (
                <div className="w-full flex justify-end">
                    <Button
                        onClick={logout}
                        variant="ghost"
                        className="w-full md:w-auto flex items-center justify-center gap-2 border border-red-400/40 text-red-300 hover:text-red-200 hover:bg-red-500/20 rounded-xl cursor-pointer px-4 py-2.5 transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="hidden sm:inline">Sair</span>
                    </Button>
                </div>
            )}

            <div className="w-full flex items-center justify-end">
                {user?.role === 'ADMIN' && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={handleSwitchScreen}
                                    className=" cursor-pointer
                                            w-full md:w-auto
                                            bg-linear-to-r
                                            from-[#f0e087]
                                            to-[#d4c474]
                                            hover:from-[#d4c474]
                                            hover:to-[#f0e087]
                                            text-[#083d71]
                                            font-semibold
                                            px-4 py-2.5
                                            rounded-xl
                                            shadow-lg
                                            hover:shadow-xl
                                            transition-all duration-300
                                            flex items-center justify-center gap-2
                                            "
                                >
                                    <ArrowRightLeft className="w-5 h-5" />
                                    <span className="hidden sm:inline">
                                        Trocar Tela
                                    </span>
                                </Button>
                            </TooltipTrigger>

                            <TooltipContent
                                side="bottom"
                                className="font-semibold text-white"
                            >
                                <p>Voltar para o dashboard</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>
            <div className="flex items-center justify-center gap-3">
                <GraduationCap className="w-8 h-8 md:w-10 md:h-10 text-[#f0e087]" />
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                    Validação de Aulas
                </h1>
            </div>
            <div className="inline-block bg-[#0a4d8f] px-6 py-2 rounded-full">
                <p className="text-[#f0e087] font-semibold text-lg md:text-xl">
                    {adminPersona?.role === 'ADMIN'
                        ? 'Administrador'
                        : `Nível ${mentorUser?.nivel}`}
                </p>
            </div>
            {isAdmin && (
                <>
                    <div className="flex items-center justify-end">
                        <Select
                            value={selectedMentor}
                            onValueChange={handleMentorChange}
                            disabled={loading}
                        >
                            <SelectTrigger className="w-full sm:w-[200px] bg-black/50 border-none text-white">
                                <SelectValue
                                    placeholder={
                                        loading
                                            ? 'Carregando mentores...'
                                            : 'Filtrar por Mentor'
                                    }
                                />
                            </SelectTrigger>

                            <SelectContent>
                                {mentorData.map((mentor) => (
                                    <SelectItem
                                        key={mentor.id}
                                        value={mentor.id.toString()}
                                    >
                                        {mentor.nome}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </>
            )}
        </div>
    );
}
