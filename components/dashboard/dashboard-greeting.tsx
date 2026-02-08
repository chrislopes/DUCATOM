import { useAuth } from '@/contexts/auth-context';
import { DashboardGreetingProps } from '@/model/dashboard-model';

export function DashboardGreeting({
    name,
    credits,
    nivel,
}: DashboardGreetingProps) {

    const { user } = useAuth();

    return (
        <div className="text-center md:text-left">
            <h1 className="text-xl md:text-2xl lg:text-3xl text-white font-medium">
                Tudo bem,{' '}
                <span className="text-[#f0e087] font-semibold">{name}</span>?
            </h1>

            
            {user?.role === 'STUDENT' && (
                <p className="text-sm md:text-base text-white/80 mt-1">
                    Você tem <span className="font-semibold">{credits}</span>{' '}
                    crédito(s) disponíveis
                </p>
            )}

            {user?.role === 'MENTOR' && (
                <p className="text-sm md:text-base text-white/80 mt-1">
                    Mentor Nível:  <span className="font-semibold">{nivel}</span>
                </p>
            )}
        </div>
    );
}
