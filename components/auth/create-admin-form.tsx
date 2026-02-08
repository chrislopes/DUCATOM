'use client';

import type React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreateAccountHeader } from './create-account-header';
import { CreateAdminInputs } from './create-admin-inputs';
import { CreateAccountActions } from './create-account-actions';
import { useCreateAdmin } from '@/hooks/useCreateAdmin';

export function CreateAdminForm() {
    const router = useRouter();
    const { createAdmin, loading } = useCreateAdmin();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = await createAdmin(
            formData.name,
            formData.email,
            formData.password
        );

        if (result) {
            router.push('/admin/dashboard-admin');
        }
    };

    const handleCancel = () => {
        router.push('/admin/dashboard-admin');
    };

    return (
        <div className="min-h-screen bg-[#083d71] flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 md:space-y-10">
                <CreateAccountHeader accountType="admin" />

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 md:space-y-8"
                >
                    <CreateAdminInputs
                        formData={formData}
                        setFormData={setFormData}
                    />

                    <CreateAccountActions
                        loading={loading}
                        onCancel={handleCancel}
                    />
                </form>
            </div>
        </div>
    );
}
