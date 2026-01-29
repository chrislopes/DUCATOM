'use client';

import { Menu, Calendar, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { useAuth } from '@/contexts/auth-context';

export function DashboardHeader() {
    const { user } = useAuth();

    return (
        <header className="sticky top-0 z-50 bg-[#083d71] border-b border-[#0a5491] px-4 py-4 md:px-8">
            <div className="flex items-center justify-between lg:max-w-4xl lg:mx-auto">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-[#0a5491] gap-2 md:hidden"
                        >
                            <Menu className="h-5 w-5" />
                            <span className="font-medium">Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent
                        side="left"
                        className="bg-[#083d71] border-[#0a5491] text-white w-[280px] sm:w-[320px]"
                    >
                        <SheetHeader className="text-left">
                            <div className="flex items-center justify-between">
                                <SheetTitle className="text-[#f0e087] text-xl font-bold">
                                    Menu
                                </SheetTitle>
                            </div>
                        </SheetHeader>

                        <nav className="flex flex-col gap-2 mt-8">
                            {user?.role === 'STUDENT' && (
                                <>
                                    <a
                                        href="/selecionar-mentor"
                                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#0a5491] transition-all group"
                                    >
                                        <Calendar className="h-5 w-5 text-[#f0e087]" />
                                        <span className="text-base font-medium group-hover:text-[#f0e087] transition-colors">
                                            Agendar Aula
                                        </span>
                                    </a>

                                    <a
                                        href="/materiais-didaticos"
                                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#0a5491] transition-all group"
                                    >
                                        <BookOpen className="h-5 w-5 text-[#f0e087]" />
                                        <span className="text-base font-medium group-hover:text-[#f0e087] transition-colors">
                                            Materiais Didáticos
                                        </span>
                                    </a>
                                </>
                            )}

                            {user?.role === 'MENTOR' && (
                                <>
                                    <a
                                        href="/controle-agenda"
                                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#0a5491] transition-all group"
                                    >
                                        <Calendar className="h-5 w-5 text-[#f0e087]" />
                                        <span className="text-base font-medium group-hover:text-[#f0e087] transition-colors">
                                            Controle da agenda
                                        </span>
                                    </a>

                                    <a
                                        href="/materiais-didaticos"
                                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#0a5491] transition-all group"
                                    >
                                        <BookOpen className="h-5 w-5 text-[#f0e087]" />
                                        <span className="text-base font-medium group-hover:text-[#f0e087] transition-colors">
                                            Materiais Didáticos
                                        </span>
                                    </a>
                                </>
                            )}

                            <div className="border-t border-[#0a5491] my-4"></div>
                        </nav>
                    </SheetContent>
                </Sheet>

                <div className="hidden md:flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full border-2 border-[#f0e087] flex items-center justify-center">
                        <span className="text-[#f0e087] text-xl font-bold">
                            ♪
                        </span>
                    </div>
                    <span className="text-white font-semibold text-lg">
                        Jornada Musical
                    </span>
                </div>
            </div>
        </header>
    );
}
