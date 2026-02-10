'use client';

import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

export function HelpButton() {
    return (
        <div className="flex justify-center mt-8">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <a
                            href="https://wa.me/5511923746268?text=Olá,%20preciso%20de%20ajuda%20na%20plataforma%20DUCATOM"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center
                            h-12 w-12 rounded-full hover:bg-[#0a5491] transition-colors"
                        >
                            <img
                                src="/icone-whats.png"
                                alt="WhatsApp"
                                className="w-10 h-10"
                            />
                        </a>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white text-[#083d71]">
                        <p>Precisa de ajuda? Clique aqui!</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
}
