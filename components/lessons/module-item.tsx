'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, BookOpen, Lock } from 'lucide-react';
import type { Module } from './validate-lessons-layout';
import { LessonItem } from './lesson-item';
import { Button } from '@/components/ui/button';

interface ModuleItemProps {
    module: Module;
    mentorNivel: number;
    mentorID: number | null;
}

export function ModuleItem({ module, mentorNivel, mentorID }: ModuleItemProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const nivelNecessario = (module.nivel - 1) * 4;
    const isLocked = mentorNivel < nivelNecessario;

    const toggleExpand = () => {
        if (isLocked) return;
        setIsExpanded(!isExpanded);
    };

    

    return (
        <div
            className={`rounded-xl overflow-hidden shadow-lg transition-all
            ${
                isLocked
                    ? 'bg-white/70 opacity-80'
                    : 'bg-white/95 hover:shadow-xl'
            }`}
        >
            <Button
                onClick={toggleExpand}
                disabled={isLocked}
                className="w-full p-4 md:p-5 flex items-center justify-between bg-transparent text-[#083d71] h-auto"
                variant="ghost"
            >
                <div className="flex items-center gap-3 md:gap-4">
                    <div
                        className={`p-2 md:p-3 rounded-lg
                        ${isLocked ? 'bg-gray-400' : 'bg-[#083d71]'}`}
                    >
                        {isLocked ? (
                            <Lock className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        ) : (
                            <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-[#f0e087]" />
                        )}
                    </div>

                    <div className="flex flex-col text-left">
                        <span className="font-semibold text-base md:text-lg">
                            {module.title}
                        </span>

                        {isLocked && (
                            <span className="text-xs text-gray-500">
                                Disponível no nível {nivelNecessario}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs md:text-sm text-gray-600 hidden sm:block">
                        {module.lessons.length} aulas
                    </span>

                    {!isLocked &&
                        (isExpanded ? (
                            <ChevronDown className="w-5 h-5 md:w-6 md:h-6" />
                        ) : (
                            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                        ))}
                </div>
            </Button>

            {!isLocked && isExpanded && (
                <div className="border-t border-gray-200 bg-gray-50/50">
                    <div className="p-3 md:p-4 space-y-2">
                        {module.lessons.map((lesson, index) => (
                            <LessonItem
                                key={lesson.id}
                                lesson={lesson}
                                moduleTitle={module.title}
                                lessonNumber={index + 1}
                                moduleId={module.id}
                                mentorID={mentorID}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
