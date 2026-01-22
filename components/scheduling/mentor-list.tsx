import { MentorCard } from './mentor-card';
import type { ListMentor, StudentData } from '@/model/user-model';

interface MentorListProps {
    todayMentors: ListMentor[];
    tomorrowMentors: ListMentor[];
    student: StudentData;
    loading: boolean;
    onToggleFavorite: (mentorId: string, period: 'today' | 'tomorrow') => void;
}

export function MentorList({
    todayMentors,
    tomorrowMentors,
    student,
    onToggleFavorite,
}: MentorListProps) {
    return (
        <div className="space-y-8 mb-8">
            {/* Hoje */}
            {todayMentors.length > 0 && (
                <section>
                    <div className="space-y-3">
                        {todayMentors.map((mentor) => (
                            <MentorCard
                                key={mentor.id}
                                mentor={mentor}
                                student={student}
                                onToggleFavorite={(id) =>
                                    onToggleFavorite(id, 'today')
                                }
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Amanhã */}
            {tomorrowMentors.length > 0 && (
                <section>
                    <h2 className="text-white text-lg md:text-xl font-semibold mb-4">
                        Amanhã
                    </h2>
                    <div className="space-y-3">
                        {tomorrowMentors.map((mentor) => (
                            <MentorCard
                                key={mentor.id}
                                mentor={mentor}
                                student={student}
                                onToggleFavorite={(id) =>
                                    onToggleFavorite(id, 'tomorrow')
                                }
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Nenhum mentor disponível */}
            {todayMentors.length === 0 && tomorrowMentors.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-white/60 text-base md:text-lg">
                        Nenhum mentor disponível com os filtros selecionados
                    </p>
                </div>
            )}
        </div>
    );
}
