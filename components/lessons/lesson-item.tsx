'use client';

import { FileText, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import type { Lesson } from './validate-lessons-layout';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useControlLessonMentor } from '@/hooks/useModulos_lesson';
import { MentorData, UserModel } from '@/model/user-model';

interface LessonItemProps {
    lesson: Lesson;
    moduleTitle: string;
    lessonNumber: number;
    moduleId: string;
    mentorID: number | null;
}

export function LessonItem({
    lesson,
    moduleTitle,
    lessonNumber,
    moduleId,
    mentorID,
}: LessonItemProps) {
    const router = useRouter();
    const [currentStatus, setCurrentStatus] = useState(lesson.status);
    const { ensureMentorLesson } = useControlLessonMentor();

    const [adminPersona, setAdminPersona] = useState<UserModel | null>(null);
    const isAdmin = adminPersona?.role === 'ADMIN';

    const [mentorUser, setMentorUser] = useState<MentorData>();

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

    useEffect(() => {
        const storedLessons = localStorage.getItem('lessons');
        if (storedLessons) {
            const lessons = JSON.parse(storedLessons);
            const lessonKey = `${moduleTitle}-Aula ${lessonNumber}`;
            if (lessons[lessonKey]) {
                setCurrentStatus(lessons[lessonKey]);
            }
        }
    }, [moduleTitle, lessonNumber]);

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'aprovado':
                return {
                    text: 'Aprovado',
                    bgColor: 'bg-green-100',
                    textColor: 'text-green-700',
                    icon: <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />,
                };
            case 'negado':
                return {
                    text: 'Negado',
                    bgColor: 'bg-red-100',
                    textColor: 'text-red-700',
                    icon: <XCircle className="w-4 h-4 md:w-5 md:h-5" />,
                };
            case 'em análise':
                return {
                    text: 'Em Análise',
                    bgColor: 'bg-blue-100',
                    textColor: 'text-blue-700',
                    icon: (
                        <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                    ),
                };
            case 'em aberto':
            default:
                return {
                    text: 'Em Aberto',
                    bgColor: 'bg-[#f0e087]/20',
                    textColor: 'text-[#c4a737]',
                    icon: <Clock className="w-4 h-4 md:w-5 md:h-5" />,
                };
        }
    };

    const statusConfig = getStatusConfig(currentStatus);

    const handleClick = async () => {
        const aulaId = parseInt(lesson.id);

        const params = new URLSearchParams({
            module: moduleTitle,
            lesson: `Aula ${lessonNumber}`,
            name: lesson.title,
            video:
                lesson.videoUrl ||
                'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            aula_id: lesson.id,
        });

        if (isAdmin) {
            if (currentStatus === 'em aberto') {
                router.push(`/submeter-aula?${params.toString()}`);
                return;
            }

            if (currentStatus === 'negado') {
                const searchParams = new URLSearchParams(params.toString());
                searchParams.set('mentorId', String(mentorID));
                searchParams.set('aulaId', String(aulaId));

                router.push(`/aula-negada?${searchParams.toString()}`);

                return;
            }

            if (currentStatus === 'em análise') {
                const searchParams = new URLSearchParams(params.toString());
                searchParams.set('mentorId', String(mentorID));
                searchParams.set('aulaId', String(aulaId));
                
                router.push(`/aula-analise?${searchParams.toString()}`);
                return;
            }

            if (currentStatus === 'aprovado') {
                const searchParams = new URLSearchParams(params.toString());
                searchParams.set('mentorId', String(mentorID));
                searchParams.set('aulaId', String(aulaId));

                router.push(`/aula-aprovada?${searchParams.toString()}`);

                return;
            }
        } else {
            if (!mentorUser?.id) return;
            const mentorId = mentorUser?.id;

            if (currentStatus === 'em aberto') {
                await ensureMentorLesson(aulaId, mentorId);
                router.push(`/submeter-aula?${params.toString()}`);
                return;
            }

            if (currentStatus === 'negado') {
                const searchParams = new URLSearchParams(params.toString());

                searchParams.set('mentorId', String(mentorId));
                searchParams.set('aulaId', String(aulaId));

                router.push(`/aula-negada?${searchParams.toString()}`);
                return;
            }

            if (currentStatus === 'em análise') {
                router.push(`/aula-analise?${params.toString()}`);
                return;
            }

            if (currentStatus === 'aprovado') {
                const searchParams = new URLSearchParams(params.toString());

                searchParams.set('mentorId', String(mentorId));
                searchParams.set('aulaId', String(aulaId));

                router.push(`/aula-aprovada?${searchParams.toString()}`);

                return;
            }
        }

    };

    return (
        <button
            onClick={handleClick}
            disabled={false}
            className="w-full bg-white rounded-lg p-3 md:p-4 flex items-center justify-between gap-3 hover:shadow-md transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="bg-[#083d71]/10 p-2 rounded-lg shrink-0">
                    <FileText className="w-4 h-4 md:w-5 md:h-5 text-[#083d71]" />
                </div>
                <span className="text-sm md:text-base text-gray-800 font-medium truncate">
                    {lesson.title}
                </span>
            </div>

            <div
                className={`${statusConfig.bgColor} ${statusConfig.textColor} px-3 md:px-4 py-1.5 md:py-2 rounded-full flex items-center gap-1.5 md:gap-2 shrink-0`}
            >
                {statusConfig.icon}
                <span className="text-xs md:text-sm font-semibold whitespace-nowrap">
                    {statusConfig.text}
                </span>
            </div>
        </button>
    );
}
