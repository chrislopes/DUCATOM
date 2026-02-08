'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type MentorWeekdayContextType = {
    mentorWeekdayId: number | null;
    setMentorWeekdayId: (id: number | null) => void;

    mentorId: number | null;
    setMentorId: (id: number | null) => void;
};

const MentorWeekdayContext = createContext<
    MentorWeekdayContextType | undefined
>(undefined);

export function MentorWeekdayProvider({ children }: { children: ReactNode }) {
    const [mentorWeekdayId, setMentorWeekdayId] = useState<number | null>(null);
    const [mentorId, setMentorId] = useState<number | null>(null);

    return (
        <MentorWeekdayContext.Provider
            value={{
                mentorWeekdayId,
                setMentorWeekdayId,
                mentorId,
                setMentorId,
            }}
        >
            {children}
        </MentorWeekdayContext.Provider>
    );
}


export function useMentorWeekday() {
    const ctx = useContext(MentorWeekdayContext);
    if (!ctx) {
        throw new Error(
            'useMentorWeekday deve ser usado dentro de MentorWeekdayProvider'
        );
    }
    return ctx;
}
