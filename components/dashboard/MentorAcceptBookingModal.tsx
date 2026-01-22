// components/dashboard/MentorAcceptBookingModal.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { useState } from 'react';

interface MentorAcceptBookingModalProps {
    open: boolean;
    loading: boolean;
    onClose: () => void;
    onConfirm: (observation?: string) => void;
}

export function MentorAcceptBookingModal({
    open,
    loading,
    onClose,
    onConfirm,
}: MentorAcceptBookingModalProps) {
    const [observation, setObservation] = useState('');

    function handleClose() {
        setObservation('');
        onClose();
    }

    function handleConfirm() {
        onConfirm(observation.trim() || undefined);
        setObservation('');
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="bg-[#041c3a] border border-white/10 text-white max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">
                        Confirmar aula
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <p className="text-sm text-white/70">
                        Ao aceitar a aula, o aluno será notificado e a aula
                        ficará <strong>confirmada</strong>.
                    </p>
                </div>

                <DialogFooter className="mt-6 flex gap-2 justify-end">
                    <Button
                        variant="default"
                        className="text-white/70 cursor-pointer hover:text-white"
                        onClick={handleClose}
                    >
                        Cancelar
                    </Button>

                    <Button
                        className="bg-green-500/80 cursor-pointer hover:bg-green-500 text-white"
                        disabled={loading}
                        onClick={handleConfirm}
                    >
                        {loading ? 'Confirmando aula...' : 'Confirmar aula'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
