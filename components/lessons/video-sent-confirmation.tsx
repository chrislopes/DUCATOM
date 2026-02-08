'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function VideoSentConfirmation() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const module = searchParams.get('module') || 'Módulo';
    const lesson = searchParams.get('lesson') || 'Aula';
    const name = searchParams.get('name') || '';

    return (
        <div className="min-h-screen bg-linear-to-b from-[#083d71] to-[#0a4d8f] flex flex-col">
           
            <div className="bg-[#083d71] py-6 px-4 md:px-6 border-b border-white/10">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white text-center">
                    Validação Aulas
                </h1>
            </div>

            
            <div className="flex-1 flex items-center justify-center p-4 md:p-6">
                <div className="w-full max-w-2xl space-y-8 md:space-y-12">
                   
                    <div className="text-center space-y-2">
                        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-[#f0e087]">
                            {module} | {lesson}
                        </h2>
                        <p className="text-base md:text-lg lg:text-xl text-white font-medium">
                            {name}
                        </p>
                    </div>

                   
                    <div className="flex justify-center">
                        <div className="relative">
                         
                            <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                            <div className="relative bg-green-500 rounded-full p-8 md:p-12">
                                <CheckCircle
                                    className="w-16 h-16 md:w-24 md:h-24 text-white"
                                    strokeWidth={2.5}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="text-center space-y-4">
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#f0e087]">
                            Recebemos o seu vídeo!
                        </h3>
                        <p className="text-sm md:text-base lg:text-lg text-white/90 max-w-md mx-auto leading-relaxed">
                            Seu vídeo está em análise pelo nosso time de
                            curadoria. Aguarde, pois nas próximas horas daremos
                            a devolutiva.
                        </p>
                    </div>

                    <div className="mt-6 md:mt-8">
                        <Button
                            onClick={() => router.push('/validacao-aulas')}
                            variant="ghost"
                            className="text-white hover:text-[#f0e087] hover:bg-white/10 transition-colors gap-2"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="text-sm md:text-base">Validação das aulas</span>
                        </Button>
                    </div>
                </div>
            </div>

           
        </div>
    );
}
