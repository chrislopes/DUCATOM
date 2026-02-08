'use client';

import { Check } from 'lucide-react';
import Link from 'next/link';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface ValidateLessonsModalProps {
    open: boolean;
    mentorLevel?: number;
    minimumLessons?: number;
}

export function ModalValidateMentor({
    open,
    mentorLevel = 4,
    minimumLessons = 4,
}: ValidateLessonsModalProps) {
    return (
        <Dialog open={open}>
            <DialogContent
                onInteractOutside={(event) => event.preventDefault()}
                onEscapeKeyDown={(event) => event.preventDefault()}
                showCloseButton={false}
                className="max-w-md bg-[#083d71] border-[#0a4d8f] sm:max-w-lg"
            >
                <DialogHeader className="space-y-4 text-center">
                    <DialogTitle className="text-2xl text-center font-bold text-white sm:text-3xl">
                        Valide suas primeiras aulas!
                    </DialogTitle>

                    
                    <DialogDescription className="text-base text-white/90 sm:text-lg">
                        Não é possível compartilhar sua agenda sem antes validar
                        no{' '}
                        <span className="font-semibold text-[#f0e087]">
                            mínimo {minimumLessons} aulas
                        </span>{' '}
                        com o nosso time de validação.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center gap-6 py-4">
                    <div className="inline-flex items-center gap-2 rounded-full bg-[#0a4d8f] px-6 py-2">
                        <span className="text-sm font-semibold text-[#f0e087] sm:text-base">
                            Mentor Nível {mentorLevel}
                        </span>
                    </div>

                    <Link
                        href="/validacao-aulas"
                        className="relative flex items-center justify-center focus:outline-none"
                    >
                        <div className="absolute h-20 w-20 animate-pulse rounded-full bg-green-500/20 sm:h-24 sm:w-24" />
                        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-green-500/30 ring-4 ring-green-500/50 sm:h-20 sm:w-20 hover:scale-105 transition-transform">
                            <Check
                                className="h-10 w-10 text-green-500 sm:h-12 sm:w-12"
                                strokeWidth={3}
                            />
                        </div>
                    </Link>
                </div>
            </DialogContent>
        </Dialog>
    );
}
