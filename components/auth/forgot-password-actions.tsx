'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';

interface ForgotPasswordActionsProps {
    loading: boolean;
    onSubmit: () => void;
    disabled: boolean;
}

export function ForgotPasswordActions({
    loading,
    onSubmit,
    disabled
}: ForgotPasswordActionsProps) {
    return (
        <div className="space-y-4">
            {/* Submit Button */}
            <Button
                onClick={onSubmit}
                disabled={disabled}
                className="w-full bg-[#f0e087] hover:bg-[#e0d077] text-[#083d71] font-semibold h-12 md:h-14 text-base md:text-lg rounded-full transition-all duration-300 cursor-pointer hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <>
                        <span className="animate-spin mr-2">⏳</span>
                        Enviando...
                    </>
                ) : (
                    <>
                        <Send className="w-5 h-5 mr-2" />
                        Enviar Link de Redefinição
                    </>
                )}
            </Button>

            {/* Back to Login Link */}
            <Link href="/">
                <Button
                    variant="ghost"
                    className="w-full text-white hover:text-[#f0e087] hover:bg-[#0a4d8f] h-12 md:h-14 text-sm md:text-base transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar para o Login
                </Button>
            </Link>
        </div>
    );
}
