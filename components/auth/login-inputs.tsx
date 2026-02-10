'use client';

import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { LoginInputsProps } from '@/model/login-model';
import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LoginInputs({
    email,
    password,
    setEmail,
    setPassword,
}: LoginInputsProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email" className="sr-only">
                    Email
                </Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-[#0a4d8f] border-[#0a4d8f] text-white placeholder:text-gray-400 focus-visible:ring-[#f0e087] h-12 md:h-14"
                />
            </div>

            <div className="space-y-2">
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
                        <Lock className="w-5 h-5" />
                    </div>
                    <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Digite sua senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-11 pr-11 bg-[#0a4d8f] border-[#0a4d8f] text-white placeholder:text-white/40 h-12 md:h-14 text-base focus-visible:ring-[#f0e087] focus-visible:border-[#f0e087] transition-all duration-300"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white hover:bg-transparent"
                    >
                        {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                        ) : (
                            <Eye className="w-5 h-5" />
                        )}
                    </Button>
                </div>
            </div>

            <div className="flex justify-end pt-1">
                <Link
                    href="/esqueceu-senha"
                    className="text-xs md:text-sm text-gray-300 hover:text-[#f0e087] transition-colors"
                >
                    Esqueceu sua senha?
                </Link>
            </div>
        </div>
    );
}
