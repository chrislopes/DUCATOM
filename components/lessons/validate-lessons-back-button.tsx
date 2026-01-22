'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';

export function ValidateLessonsBackButton() {
    const router = useRouter();
    const { user } = useAuth();

    return (
        <div className="mt-6 md:mt-8">
            {user?.role != 'ADMIN' && (
                <Button
                    onClick={() => router.push('/dashboard')}
                    variant="ghost"
                    className="text-white hover:text-[#f0e087] hover:bg-white/10 transition-colors gap-2"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="text-sm md:text-base">
                        Voltar ao Dashboard
                    </span>
                </Button>
            )}
        </div>
    );
}
