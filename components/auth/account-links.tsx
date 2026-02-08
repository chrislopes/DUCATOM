import Link from 'next/link';

export function AccountLinks() {
    return (
        <div className="flex flex-col items-center space-y-3 text-white">
            <Link
                href="/admin-login?type=aluno"
                className="hover:text-[#f0e087] transition-colors text-sm md:text-base"
            >
                Criar conta Aluno
            </Link>
            <Link
                href="/admin-login?type=mentor"
                className="hover:text-[#f0e087] transition-colors text-sm md:text-base"
            >
                Criar conta Mentor
            </Link>
            <Link
                href="/admin-login?type=admin"
                className="hover:text-[#f0e087] transition-colors text-sm md:text-base"
            >
                Administrador
            </Link>
        </div>
    );
}
