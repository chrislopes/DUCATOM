'use client';

import { AuthContextModel } from '@/model/auth-context-model';
import { UserModel } from '@/model/user-model';
import { createContext, useContext, useState, useEffect } from 'react';


const AuthContext = createContext<AuthContextModel>({
    user: null,
    setUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserModel | null>(null);

    
    useEffect(() => {
        const saved = localStorage.getItem('auth_user');
        if (saved) setUser(JSON.parse(saved));
    }, []);

    useEffect(() => {
        if (user) localStorage.setItem('auth_user', JSON.stringify(user));
        else localStorage.removeItem('auth_user');
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
