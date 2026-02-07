'use client';

import { Button } from '@/components/ui/button';
import { AccountLinks } from './account-links';
import { LoginActionsProps } from '@/model/login-model';

export function LoginActions({ onSubmit, loading }: LoginActionsProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <Button
                    onClick={onSubmit}
                    disabled={loading}
                    className="w-full bg-[#f0e087] hover:bg-[#e5d677] text-[#083d71] font-semibold h-12 cursor-pointer md:h-14 text-base md:text-lg rounded-full"
                >
                    {loading ? 'Entrando...' : 'Fazer Login na Conta'}
                </Button>
            </div>
            <AccountLinks />
        </div>
    );
}
