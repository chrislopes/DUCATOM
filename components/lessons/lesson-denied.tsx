'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { XCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useControlLessonMentor } from '@/hooks/useModulos_lesson';
import { useEffect, useRef, useState } from 'react';
import { UserModel } from '@/model/user-model';

export function LessonDenied() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [adminPersona, setAdminPersona] = useState<UserModel | null>(null);
    const isAdmin = adminPersona?.role === 'ADMIN';

    const moduleTitle = searchParams.get('module') || 'Módulo';
    const lessonName = searchParams.get('lesson') || 'Aula';
    const lessonTitle = searchParams.get('name') || '';
    const aulaId = searchParams.get('aula_id') ?? '';

    const mentorIdString = searchParams.get('mentorId') || '';

    const { loading, lessonProgress, fetchMentorLesson } =
        useControlLessonMentor();

    const didRun = useRef(false);

    useEffect(() => {
        if (didRun.current) return;
        didRun.current = true;

        const auth_admin = localStorage.getItem('auth_user');
        if (auth_admin) {
            setAdminPersona(JSON.parse(auth_admin));
        }

        const mentorId = parseInt(mentorIdString);
        const aulaIdId = parseInt(aulaId);

        fetchMentorLesson(aulaIdId, mentorId);
    }, []);

    const handleResubmit = () => {
        const params = new URLSearchParams({
            module: moduleTitle,
            lesson: lessonName,
            name: lessonTitle,
            video: searchParams.get('video') || '',
            aula_id: aulaId,
        });
        router.push(`/submeter-aula?${params.toString()}`);
    };

    const handleBack = () => {
        router.push('/validacao-aulas');
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-[#083d71] to-[#0a4d8f] flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                
                <div className="text-center mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
                        Validação Aulas
                    </h1>

                 
                    <div className="mb-8">
                        <h2 className="text-lg md:text-xl font-bold text-[#f0e087]">
                            {moduleTitle} | {lessonName}
                        </h2>
                        <p className="text-sm md:text-base text-white/90 mt-1">
                            {lessonTitle}
                        </p>
                    </div>

                    
                    <div className="flex flex-col items-center gap-4 mb-8">
                        <div className="bg-red-500 rounded-full p-8 animate-pulse">
                            <XCircle
                                className="w-16 h-16 md:w-20 md:h-20 text-white"
                                strokeWidth={3}
                            />
                        </div>
                        <h3 className="text-3xl md:text-4xl font-bold text-red-400">
                            Negado
                        </h3>
                    </div>

                   
                    <div className="mb-8">
                        <h4 className="text-lg md:text-xl font-semibold text-[#f0e087] mb-4">
                            Feedback do time
                        </h4>
                        <div className="bg-[#0a4d8f]/50 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                            <p className="text-white/90 text-sm md:text-base leading-relaxed">
                                {lessonProgress?.feedback_admin}
                            </p>
                        </div>
                    </div>

                  
                    {!isAdmin && (
                        <>
                            <Button
                                onClick={handleResubmit}
                                className="w-full max-w-md bg-[#f0e087] hover:bg-[#f0e087]/90 text-[#083d71] font-bold text-lg py-6 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg"
                            >
                                Realizar Reenvio
                            </Button>
                        </>
                    )}
                </div>

                <div className="mt-6 md:mt-8">
                    <Button
                        onClick={handleBack}
                        variant="ghost"
                        className="text-white hover:text-[#f0e087] hover:bg-white/10 transition-colors gap-2"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm md:text-base">Voltar</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
