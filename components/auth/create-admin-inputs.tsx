'use client';

import type React from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Lock } from 'lucide-react';

interface CreateAdminInputsProps {
    formData: {
        name: string;
        email: string;
        password: string;
    };
    setFormData: React.Dispatch<
        React.SetStateAction<{
            name: string;
            email: string;
            password: string;
        }>
    >;
}

export function CreateAdminInputs({
    formData,
    setFormData,
}: CreateAdminInputsProps) {
    return (
        <div className="space-y-5 md:space-y-6">
            <div className="space-y-2">
                <Label
                    htmlFor="name"
                    className="text-white text-sm md:text-base"
                >
                    Nome Completo
                </Label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                    <Input
                        id="name"
                        type="text"
                        placeholder="Digite o nome completo"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
                        className="pl-11 h-12 md:h-14 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#f0e087] focus:ring-[#f0e087]/20 rounded-lg text-sm md:text-base"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label
                    htmlFor="email"
                    className="text-white text-sm md:text-base"
                >
                    Email
                </Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                    <Input
                        id="email"
                        type="email"
                        placeholder="Digite o email"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                        className="pl-11 h-12 md:h-14 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#f0e087] focus:ring-[#f0e087]/20 rounded-lg text-sm md:text-base"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label
                    htmlFor="password"
                    className="text-white text-sm md:text-base"
                >
                    Senha
                </Label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                    <Input
                        id="password"
                        type="password"
                        placeholder="Digite a senha"
                        value={formData.password}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                password: e.target.value,
                            })
                        }
                        className="pl-11 h-12 md:h-14 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#f0e087] focus:ring-[#f0e087]/20 rounded-lg text-sm md:text-base"
                        required
                    />
                </div>
            </div>
        </div>
    );
}
