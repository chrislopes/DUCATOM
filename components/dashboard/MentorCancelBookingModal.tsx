'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

interface MentorCancelBookingModalProps {
    open: boolean;
    loading: boolean;
    onClose: () => void;
    onConfirm: (description: string) => void;
}

export function MentorCancelBookingModal({
    open,
    loading,
    onClose,
    onConfirm,
}: MentorCancelBookingModalProps) {
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (!open) {
            setDescription('');
        }
    }, [open]);

    const isValid = description.trim().length > 5;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-[#041c3a] border border-white/10 rounded-2xl max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-white">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        Negar solicitação de aula
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  
                    <p className="text-sm text-white/70">
                        Ao negar esta solicitação, o aluno será notificado.
                        Informe o motivo para manter uma comunicação clara e
                        profissional.
                    </p>

                
                    <div className="space-y-2">
                        <label className="text-sm text-white/80 font-medium">
                            Motivo da negação{' '}
                            <span className="text-red-400">*</span>
                        </label>

                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Explique o motivo da negação da aula..."
                            className="bg-black/40 border-white/10 text-white placeholder:text-white/30 resize-none min-h-[120px]"
                        />

                        <p className="text-xs text-white/40">
                            Mínimo de 6 caracteres
                        </p>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            variant="default"
                            className=" cursor-pointer text-white hover:bg-white/10"
                            onClick={onClose}
                        >
                            Cancelar
                        </Button>

                        <Button
                            variant="destructive"
                            disabled={!isValid || loading}
                            onClick={() => onConfirm(description)}
                            className="disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                        >
                            {loading
                                ? 'Confirmando negação...'
                                : 'Confirmar negação'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
