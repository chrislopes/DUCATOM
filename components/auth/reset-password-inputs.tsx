'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useResetPassword } from '@/feature/reset-password-context';

export function ResetPasswordInputs() {
    const { password, confirmPassword, setPassword, setConfirmPassword } =
        useResetPassword();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="space-y-6">
          
            <div className="space-y-2">
                <Label
                    htmlFor="password"
                    className="text-white text-sm md:text-base"
                >
                    Nova Senha
                </Label>
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
                        <Lock className="w-5 h-5" />
                    </div>
                    <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Digite sua nova senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-11 pr-11 bg-[#062c52] border-[#0a4275] text-white placeholder:text-white/40 h-12 md:h-14 text-base focus-visible:ring-[#f0e087] focus-visible:border-[#f0e087] transition-all duration-300"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white hover:bg-transparent"
                    >
                        {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                        ) : (
                            <Eye className="w-5 h-5" />
                        )}
                    </Button>
                </div>
            </div>

            <div className="space-y-2">
                <Label
                    htmlFor="confirmPassword"
                    className="text-white text-sm md:text-base"
                >
                    Confirmar Nova Senha
                </Label>
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
                        <Lock className="w-5 h-5" />
                    </div>
                    <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirme sua nova senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-11 pr-11 bg-[#062c52] border-[#0a4275] text-white placeholder:text-white/40 h-12 md:h-14 text-base focus-visible:ring-[#f0e087] focus-visible:border-[#f0e087] transition-all duration-300"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white hover:bg-transparent"
                    >
                        {showConfirmPassword ? (
                            <EyeOff className="w-5 h-5" />
                        ) : (
                            <Eye className="w-5 h-5" />
                        )}
                    </Button>
                </div>
            </div>
            
            <div className="bg-[#062c52] border border-[#0a4275] rounded-lg p-4">
                <p className="text-xs md:text-sm text-white/70">
                    A senha deve conter no mínimo 6 caracteres
                </p>
            </div>
        </div>
    );
}
