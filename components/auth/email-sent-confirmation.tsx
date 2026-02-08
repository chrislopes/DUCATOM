'use client';

import { CheckCircle2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function EmailSentConfirmation() {
    return (
        <div className="w-full max-w-md mx-auto space-y-8 text-center">
         
            <div className="flex justify-center">
                <div className="relative">
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-[#0a4d8f] flex items-center justify-center">
                        <Mail className="w-12 h-12 md:w-14 md:h-14 text-[#f0e087]" />
                    </div>
                    <div className="absolute -bottom-2 -right-2">
                        <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12 text-green-500 bg-[#083d71] rounded-full" />
                    </div>
                </div>
            </div>

         
            <h1 className="text-2xl md:text-3xl font-bold text-white">
                E-mail Enviado!
            </h1>

            <div className="space-y-3">
                <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                    Enviamos um link de redefinição de senha para o seu e-mail.
                </p>
                <p className="text-gray-400 text-xs md:text-sm">
                    Verifique sua caixa de entrada e também a pasta de spam.
                </p>
            </div>

            <div className="bg-[#0a4d8f] p-4 md:p-6 rounded-lg space-y-2">
                <p className="text-[#f0e087] font-medium text-sm md:text-base">
                    Não recebeu o e-mail?
                </p>
                <p className="text-gray-300 text-xs md:text-sm">
                    Aguarde alguns minutos ou tente novamente.
                </p>
            </div>
            
            <Link href="/">
                <Button className="w-full bg-[#f0e087] hover:bg-[#e0d077] text-[#083d71] font-semibold h-12 md:h-14 text-base md:text-lg rounded-full transition-all duration-300 hover:scale-105">
                    Voltar para o Login
                </Button>
            </Link>
        </div>
    );
}
