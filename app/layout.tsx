import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { PageTransition } from '@/components/ui/page-transition';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/auth-context';
import { MentorWeekdayProvider } from '@/contexts/MentorWeekdayContext';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
});

export const metadata: Metadata = {
    title: 'Ducatom - Sua Jornada Musical',
    description: 'Plataforma de ensino musical',
    generator: 'v0.app',
    icons: {
        icon: [
            {
                url: '/icon-light-32x32.png',
                media: '(prefers-color-scheme: light)',
            },
            {
                url: '/icon-dark-32x32.png',
                media: '(prefers-color-scheme: dark)',
            },
            {
                url: '/icon.svg',
                type: 'image/svg+xml',
            },
        ],
        apple: '/apple-icon.png',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <body className={inter.className}>
                <AuthProvider>
                    <MentorWeekdayProvider>
                        <PageTransition>{children}</PageTransition>
                        <Toaster richColors />
                        <Analytics />
                    </MentorWeekdayProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
