'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StudentCancelAction } from '@/model/list-bookings-model';
import { X } from 'lucide-react';
import { useState } from 'react';

interface StudentCancelBookingModalProps {
    open: boolean;
    action: StudentCancelAction;
    loading?: boolean;
    onClose: () => void;
    onConfirm: (description: string) => void;
}

export function StudentCancelBookingModal({
    open,
    action,
    loading,
    onClose,
    onConfirm,
}: StudentCancelBookingModalProps) {
    const [description, setDescription] = useState('');

    if (!open) return null;

    const isConfirmDisabled = description.trim().length < 5;

    const contentMap = {
        desistir: {
            title: 'Desistir da aula',
            description:
                'Ao desistir da aula, sua solicitação será removida e o mentor será notificado.',
        },
        cancelar: {
            title: 'Cancelar aula',
            description:
                'Ao cancelar a aula, ela será removida da agenda e o mentor será avisado.',
        },
    };

    const content = contentMap[action];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-[#0b1220] border border-white/10 p-6 relative">
                {/* Fechar */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-white/40 hover:text-white"
                >
                    <X size={18} />
                </button>

                {/* Título */}
                <h2 className="text-lg font-semibold text-white mb-2">
                    {content.title}
                </h2>

                <p className="text-sm text-white/60 mb-4">
                    {content.description}
                </p>

                {/* Descrição */}
                <div className="space-y-2">
                    <label className="text-xs text-white/60">
                        Descreva o motivo
                    </label>

                    <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        placeholder="Explique o motivo..."
                        className="bg-black/40 border-white/10 text-white resize-none"
                    />
                </div>

                {/* Ações */}
                <div className="mt-6 flex justify-end gap-3">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={loading}
                        className="text-white cursor-pointer"
                    >
                        Voltar
                    </Button>

                    <Button
                        variant="destructive"
                        disabled={isConfirmDisabled || loading}
                        onClick={() => onConfirm(description)}
                        className="cursor-pointer"
                    >
                        {loading ? 'Processando...' : 'Confirmar'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
