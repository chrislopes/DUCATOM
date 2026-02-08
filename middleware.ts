import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ROLE_ROUTES: Record<string, string[]> = {
    STUDENT: ['/dashboard', '/selecionar-mentor', '/materiais-didaticos'],
    MENTOR: [
        '/dashboard',
        '/validacao-aulas',
        '/materiais-didaticos',
        '/controle-agenda',
        '/aula-negada',
        '/aula-aprovada',
        '/submeter-aula',
        '/aula-analise',
    ],
    ADMIN: [
        '/admin/dashboard-admin',
        '/validacao-aulas',
        '/criar-aluno',
        '/aula-negada',
        '/aula-aprovada',
        '/aula-analise',
        '/criar-mentor',
        '/criar-admin',
    ],
};

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/favicon') ||
        pathname.startsWith('/public') ||
        pathname.match(
            /\.(png|jpg|jpeg|svg|css|js|pdf|webp|mp4|mp3|docx|xlsx)$/i,
        )
    ) {
        return NextResponse.next();
    }

    const token = request.cookies.get('sb_access_token')?.value;
    const role = request.cookies.get('sb_role')?.value;

    const PUBLIC_ROUTES = [
        '/',
        '/admin-login',
        '/esqueceu-senha',
        '/email-enviado',
    ];

    const isPublicRoute = PUBLIC_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`),
    );

    if (isPublicRoute) {
        if (token && role && pathname === '/') {
            const fallback =
                role === 'ADMIN' ? '/admin/dashboard-admin' : '/dashboard';

            return NextResponse.redirect(new URL(fallback, request.url));
        }

        return NextResponse.next();
    }

    if (!token || !role) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    const allowedRoutes = ROLE_ROUTES[role];
    if (!allowedRoutes) {
        return NextResponse.redirect(new URL('/', request.url));
    }
    const hasPermission = allowedRoutes.some((route) =>
        pathname.startsWith(route),
    );

    if (!hasPermission) {
        const fallback =
            role === 'ADMIN' ? '/admin/dashboard-admin' : '/dashboard';

        return NextResponse.redirect(new URL(fallback, request.url));
    }

    return NextResponse.next();
}


export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|css|js)).*)',
    ],
};
