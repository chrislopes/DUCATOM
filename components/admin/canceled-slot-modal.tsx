'use client';

import { X, AlertCircle, User, GraduationCap } from 'lucide-react';
import { useEffect } from 'react';

interface CanceledSlotModalProps {
    isOpen: boolean;
    onClose: () => void;
    mentorName: string;
    studentName: string;
    colorBg: string;
    cancelReason: string;
}

export function CanceledSlotModal({
    isOpen,
    onClose,
    mentorName,
    studentName,
    colorBg,
    cancelReason,
}: CanceledSlotModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };

        
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

           
            <div className="relative w-full max-w-md bg-[#0a1929] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
               
                <div
                    className={`relative bg-linear-to-br p-6 text-center ${colorBg}`}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>

                    <div className="flex items-center justify-center mb-3">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <AlertCircle className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-white">
                        Aula Cancelada
                    </h2>
                </div>

              
                <div className="p-6 space-y-5">
                    <div className="space-y-4">
                        <div className="flex items-start gap-3 p-4 bg-[#083d71]/40 rounded-lg border border-[#0a4d8f]/30">
                            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                                <GraduationCap className="w-5 h-5 text-red-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-400 mb-1">
                                    Mentor
                                </p>
                                <p className="text-white font-medium">
                                    {mentorName}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-[#083d71]/40 rounded-lg border border-[#0a4d8f]/30">
                            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                                <User className="w-5 h-5 text-red-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-400 mb-1">
                                    Aluno
                                </p>
                                <p className="text-white font-medium">
                                    {studentName}
                                </p>
                            </div>
                        </div>

                        <div className="p-4 bg-red-950/30 rounded-lg border border-red-500/20">
                            <p className="text-xs text-red-300 mb-2 font-medium">
                                Motivo do Cancelamento:
                            </p>
                            <p className="text-sm text-gray-300 leading-relaxed">
                                {cancelReason}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-[#f0e087] hover:bg-[#e5d577] text-[#083d71] font-semibold rounded-lg transition-colors"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}
