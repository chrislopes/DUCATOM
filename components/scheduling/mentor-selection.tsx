'use client';

import { MentorSelectionLayout } from './mentor-selection-layout';
import { MentorSelectionHeader } from './mentor-selection-header';
import { MentorFilters } from './mentor-filters';
import { MentorList } from './mentor-list';
import { MentorNavigationButtons } from './mentor-navigation-buttons';
import { useState, useEffect, useRef } from 'react';
import { useListMentorUser } from '@/hooks/useListMentor';
import { ListMentor, StudentData } from '@/model/user-model';
import { AgendaMentor } from '@/model/agenda-mentor';
import {
    useFavoriteMentor,
    useGetMentorFavorite,
} from '@/hooks/useFavoriteMentor';

export function MentorSelection() {
    const { loading, mentores, listMentor } = useListMentorUser();

    const { createFavoriteMentor, loading: favoriteLoading } =
        useFavoriteMentor();

    const {
        searchMentorFavorite,
        loading: searchFavorite,
        mentorFavoriteData,
    } = useGetMentorFavorite();

    const [selectedTime, setSelectedTime] = useState('all');
    const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
    const [mentors, setMentors] = useState<ListMentor[]>([]);

    const [studentData, setStudentData] = useState<StudentData>();

    const didRun = useRef(false);

   
    useEffect(() => {
        if (didRun.current) return;
        didRun.current = true;

        const saved = localStorage.getItem('aluno_id');
        if (saved) {
            setStudentData(JSON.parse(saved));
        }

        

        listMentor();
    }, []);


    useEffect(() => {
        if (!studentData?.id) return;
        searchMentorFavorite(studentData.id);
    }, [studentData]);

   
    useEffect(() => {
        if (!mentores || mentores.length === 0) return;

        const favoriteMap = new Map<string, boolean>(
            mentorFavoriteData.map((f) => [String(f.mentor_id), f.favoritado]),
        );

        const mapped: ListMentor[] = mentores.map((m: any) => ({
            id: String(m.id),
            nome: m.nome,
            especialidade: m.especialidade,
            nivel: m.nivel,
            avatar: undefined,
            isFavorite: favoriteMap.get(String(m.id)) ?? false,
            agenda_publicada: m.agenda_publicada,
            agenda_mentor: Array.isArray(m.agenda_mentor)
                ? m.agenda_mentor.map((a: AgendaMentor) => ({
                      weekday: a.weekday,
                      start_time: a.start_time,
                      mentor_weekday_id: a.mentor_weekday_id,
                      mentor_time_slot_id: a.mentor_time_slot_id,
                  }))
                : [],
        }));

        setMentors(mapped);
    }, [mentores, mentorFavoriteData]);

    const toggleFavorite = async (mentorId: string) => {
        if (!studentData?.id) return;

        const mentor = mentors.find((m) => m.id === mentorId);
        if (!mentor) return;

        const novoFavorito = !mentor.isFavorite;

        
        setMentors((prev) =>
            prev.map((m) =>
                m.id === mentorId ? { ...m, isFavorite: novoFavorito } : m,
            ),
        );

        const result = await createFavoriteMentor(
            studentData.id,
            Number(mentorId),
            novoFavorito,
        );

        if (!result) {
           
            setMentors((prev) =>
                prev.map((m) =>
                    m.id === mentorId ? { ...m, isFavorite: !novoFavorito } : m,
                ),
            );
        }
    };

    const filteredMentors = mentors.filter((mentor) => {
        const matchesTime =
            selectedTime === 'all' ||
            mentor.agenda_mentor.some((slot: any) =>
                slot.start_time.startsWith(selectedTime),
            );

        const matchesFavorite = !showOnlyFavorites || mentor.isFavorite;

        return matchesTime && matchesFavorite;
    });

    return (
        <MentorSelectionLayout>
            <MentorSelectionHeader />

            <MentorFilters
                showOnlyFavorites={showOnlyFavorites}
                onFavoritesChange={setShowOnlyFavorites}
            />

            <MentorList
                todayMentors={filteredMentors}
                tomorrowMentors={[]}
                student={studentData!}
                onToggleFavorite={(id) => toggleFavorite(id)}
                loading={loading}
            />

            <MentorNavigationButtons />
        </MentorSelectionLayout>
    );
}
