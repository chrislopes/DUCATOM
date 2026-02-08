'use client';

import { ForgotPasswordHeader } from './forgot-password-header';
import { ForgotPasswordInput } from './forgot-password-input';
import { ForgotPasswordActions } from './forgot-password-actions';
import { useState } from 'react';
import { useRecoverPassword } from '@/hooks/useRecoverPassword';

export function ForgotPasswordForm() {
    const [email, setEmail] = useState('');

    const { handleRecover, loading } = useRecoverPassword();

    const submit = async () => {
        if (!email) {
            
            return;
        }

        await handleRecover(email);
    };

    return (
        <div className="w-full max-w-md mx-auto space-y-8">
            <ForgotPasswordHeader />

            <ForgotPasswordInput email={email} setEmail={setEmail} />

            <ForgotPasswordActions
                loading={loading}
                onSubmit={submit}
                disabled={loading || email.trim() === ''}
            />
        </div>
    );
}
