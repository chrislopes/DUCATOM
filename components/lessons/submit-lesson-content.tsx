'use client';

import type React from 'react';

import { Card } from '@/components/ui/card';
import { Upload, LinkIcon, FileVideo, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MentorData, UserModel } from '@/model/user-model';
import { useSendLessonWhatsAppMentor } from '@/hooks/useModulos_lesson';

interface SubmitLessonContentProps {
    videoUrl: string;
    uploadedFile: File | null;
    setUploadedFile: (file: File | null) => void;
}

export function SubmitLessonContent({
    videoUrl,
    uploadedFile,
    setUploadedFile,
}: SubmitLessonContentProps) {
    const router = useRouter();
    const searchParams = new URLSearchParams(window.location.search);
    const module = searchParams.get('module') || '';
    const lesson = searchParams.get('lesson') || '';
    const name = searchParams.get('name') || '';
    const aulaId = Number(searchParams.get('aula_id'));
    const { changeStatus, loading } = useSendLessonWhatsAppMentor();

    const [adminPersona, setAdminPersona] = useState<UserModel | null>(null);
    const isAdmin = adminPersona?.role === 'ADMIN';

    const [mentorUser, setMentorUser] = useState<MentorData>();

    const didRun = useRef(false);

    useEffect(() => {
        if (didRun.current) return;
        didRun.current = true;

        const auth_admin = localStorage.getItem('auth_user');
        if (auth_admin) {
            setAdminPersona(JSON.parse(auth_admin));
        }

        const saved = localStorage.getItem('mentor_id');
        if (saved) {
            setMentorUser(JSON.parse(saved));
        }
    }, []);

    const getYouTubeEmbedUrl = (url: string) => {
        if (!url) return '';
        const videoId =
            url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
        return `https://www.youtube.com/embed/${videoId}`;
    };

    const handleSendWhatsApp = async () => {
        if (!mentorUser?.id) return;

        if (!mentorUser.id || !aulaId) {
            console.warn('Dados inválidos para envio');
            return;
        }

        const success = await changeStatus(aulaId, mentorUser.id, 'em análise');

        

        if (!success) {
            alert('Erro ao reenviar a aula. Tente novamente.');
            return;
        }

        const whatsappMessage = encodeURIComponent(
            `Olá!\n*Mentor:* ${mentorUser.nome}\n*ID:* ${mentorUser.id}\n*Nivel:* ${mentorUser.nivel}\n*Especialidade:* ${mentorUser.especialidade} \n\nEstou enviando o vídeo da aula:\n\n*Módulo:* ${module}\n*Aula:* ${lesson}\n*Título:* ${name}\n\nSegue abaixo o video!`,
        );

        const whatsappNumber = '5511923746268'; 
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

        window.open(whatsappUrl, '_blank');

        router.push('/validacao-aulas');
    };

    return (
        <div className="flex-1 space-y-6 md:space-y-8 mb-6">
         
            <Card className="bg-[#0a4d8f] border-none p-4 md:p-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="bg-[#f0e087] p-2 rounded-lg">
                            <LinkIcon className="w-5 h-5 text-[#083d71]" />
                        </div>
                        <h3 className="text-lg md:text-xl font-bold text-white">
                            Vídeo Suporte
                        </h3>
                    </div>

                    {videoUrl ? (
                        <div className="aspect-video rounded-lg overflow-hidden bg-black">
                            <iframe
                                src={getYouTubeEmbedUrl(videoUrl)}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    ) : (
                        <div className="aspect-video rounded-lg bg-[#083d71]/50 flex items-center justify-center">
                            <p className="text-white/70">
                                Nenhum vídeo de referência disponível
                            </p>
                        </div>
                    )}

                    <div className="bg-[#083d71]/30 rounded-lg p-4">
                        <p className="text-sm md:text-base text-white/90 text-center">
                            Não esqueça de respeitar a metodologia apresentada.
                        </p>
                    </div>
                </div>
            </Card>

            {!isAdmin && (
                <>
                    <Card className="bg-[#0a4d8f] border-none p-4 md:p-6">
                        <div className="space-y-5">
                         
                            <div className="flex items-center gap-3">
                                <div className="bg-[#f0e087] p-2 rounded-lg">
                                    <FileVideo className="w-5 h-5 text-[#083d71]" />
                                </div>
                                <h3 className="text-lg md:text-xl font-bold text-white">
                                    Envio do Vídeo
                                </h3>
                            </div>

                        
                            <div className="bg-white/10 rounded-lg p-4 space-y-2">
                                <p className="text-lg text-white text-center">
                                    📌{' '}
                                    <strong className="text-2xl">
                                        Atenção:
                                    </strong>{' '}
                                    O envio do vídeo é feito via{' '}
                                    <span className="text-[#25D366] font-semibold">
                                        WhatsApp
                                    </span>
                                    .
                                </p>
                                <p className="text-sm md:text-sm text-white/80 text-center">
                                    Após o envio, o vídeo será analisado pelo
                                    administrador e o status da aula será
                                    atualizado aqui na plataforma.
                                </p>
                            </div>

                      
                            <button
                                type="button"
                                onClick={handleSendWhatsApp}
                                disabled={loading}
                                className="w-full flex items-center cursor-pointer justify-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold py-3 rounded-lg transition-all hover:scale-[1.01] active:scale-[0.99]"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 32 32"
                                    className="w-5 h-5 fill-white"
                                >
                                    <path d="M19.11 17.64c-.29-.14-1.69-.83-1.95-.92-.26-.1-.45-.14-.64.14-.19.29-.74.92-.9 1.11-.17.19-.33.21-.62.07-.29-.14-1.21-.45-2.31-1.43-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.59.13-.13.29-.33.43-.5.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.64-1.54-.88-2.11-.23-.55-.47-.48-.64-.49-.17-.01-.36-.01-.55-.01-.19 0-.5.07-.76.36-.26.29-1 1-1 2.43 0 1.43 1.02 2.82 1.17 3.01.14.19 2.01 3.07 4.88 4.3.68.29 1.21.46 1.63.59.68.22 1.29.19 1.78.12.54-.08 1.69-.69 1.93-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.33z" />
                                    <path d="M16.01 3C9.38 3 4 8.38 4 15.01c0 2.64.86 5.07 2.31 7.03L4 29l7.15-2.25c1.89 1.03 4.06 1.62 6.86 1.62 6.63 0 12.01-5.38 12.01-12.01C30.02 8.38 22.64 3 16.01 3zm0 21.83c-2.48 0-4.78-.73-6.71-1.99l-.48-.29-4.25 1.34 1.39-4.14-.31-.49c-1.38-2.01-2.12-4.37-2.12-6.85 0-6.83 5.56-12.39 12.39-12.39 6.83 0 12.39 5.56 12.39 12.39 0 6.83-5.56 12.39-12.39 12.39z" />
                                </svg>
                                {loading
                                    ? 'Enviando...'
                                    : 'Enviar vídeo pelo WhatsApp'}
                            </button>
                        </div>
                    </Card>
                </>
            )}
        </div>
    );
}
