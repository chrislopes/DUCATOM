'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { useEffect, useRef } from 'react';
import { useControlLessonMentor } from '@/hooks/useModulos_lesson';

export function LessonApproved() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const moduleTitle = searchParams.get('module') || 'Módulo';
    const lessonName = searchParams.get('lesson') || 'Aula';
    const lessonTitle = searchParams.get('name') || '';

    const mentorIdString = searchParams.get('mentorId') || '';
    const aulaIdString = searchParams.get('aulaId') || '';

    const { loading, lessonProgress, fetchMentorLesson } =
        useControlLessonMentor();

    const didRun = useRef(false);

    useEffect(() => {
        if (didRun.current) return;
        didRun.current = true;
        const mentorId = parseInt(mentorIdString);
        const aulaId = parseInt(aulaIdString);

        fetchMentorLesson(aulaId, mentorId);
    }, []);

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

                   
                    <div className="border-2 border-green-500 rounded-lg p-4 mb-8 inline-block">
                        <h2 className="text-lg md:text-xl font-bold text-[#f0e087]">
                            {moduleTitle} | {lessonName}
                        </h2>
                        <p className="text-sm md:text-base text-white/90 mt-1">
                            {lessonTitle}
                        </p>
                    </div>

                   
                    <div className="flex flex-col items-center gap-4 mb-8">
                        <div className="bg-green-500 rounded-full p-8 animate-pulse">
                            <CheckCircle
                                className="w-16 h-16 md:w-20 md:h-20 text-white"
                                strokeWidth={3}
                            />
                        </div>
                        <h3 className="text-3xl md:text-4xl font-bold text-green-400">
                            Aprovado
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
