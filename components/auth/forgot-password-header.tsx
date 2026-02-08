import { KeyRound } from 'lucide-react';

export function ForgotPasswordHeader() {
    return (
        <div className="text-center space-y-4">
          
            <div className="flex justify-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#0a4d8f] flex items-center justify-center">
                    <KeyRound className="w-8 h-8 md:w-10 md:h-10 text-[#f0e087]" />
                </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-white">
                Esqueceu sua Senha?
            </h1>

           
            <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-sm mx-auto">
                Não se preocupe! Digite seu e-mail abaixo e enviaremos um link
                para redefinir sua senha.
            </p>
        </div>
    );
}
