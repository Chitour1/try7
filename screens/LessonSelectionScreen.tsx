import React, { useEffect, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Screen, LessonLibrary, Lesson, Progress, LessonStatus } from '../types';
import { SRS_STAGES } from '../constants';
import ScreenContainer from '../components/common/ScreenContainer';
import BackButton from '../components/common/BackButton';

const calculateLessonProgress = (lessonKey: string, lesson: Lesson, progress: Progress, getLessonStatus: (key: string) => LessonStatus) => {
    const p = progress[lessonKey];
    if (!p) return 0;

    const status = getLessonStatus(lessonKey);
    if (status.status === 'mastered' || (p.stage > 0 && status.status === 'locked')) {
        return 100;
    }
    
    if (p.stage === 0) {
        const repsNeeded = SRS_STAGES[0].reps;
        const totalRepsDone = Object.values(p.sentenceProgress).reduce((sum, reps) => sum + reps, 0);
        const totalRepsNeeded = lesson.sentences.length * repsNeeded;
        return totalRepsNeeded > 0 ? (totalRepsDone / totalRepsNeeded) * 100 : 0;
    }

    return 0; // In review stages, show 0 progress until complete
};

const LessonCard: React.FC<{ lessonKey: string; progressPercent: number; onClick: () => void }> = ({ lessonKey, progressPercent, onClick }) => {
    const isCompleted = progressPercent >= 100;
    return (
        <div
            onClick={onClick}
            className={`relative border border-tile-border rounded-xl p-4 text-base font-sans-en font-bold cursor-pointer text-center flex-grow basis-40 max-w-xs transition-all duration-200 transform hover:-translate-y-1.5 hover:border-highlight overflow-hidden ${isCompleted ? 'bg-success border-success' : 'bg-tile-bg'}`}
        >
             {!isCompleted && (
                 <div
                    className="absolute top-0 right-0 bottom-0 bg-gradient-to-l from-accent/50 to-accent"
                    style={{ left: `${100 - progressPercent}%`, transition: 'left 0.5s ease-out' }}
                />
            )}
            <span className={`relative z-10 ${isCompleted ? 'text-white' : 'text-text-main mix-blend-screen'}`}>
                {lessonKey}
            </span>
        </div>
    );
};

const LessonSelectionScreen = () => {
    const { navigateTo, currentSubgroup, currentLevelKey, setCurrentLessonKey, progress, initializeLessonProgress, getLessonStatus } = useAppContext();
    const [lessonLibrary, setLessonLibrary] = useState<LessonLibrary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadLibrary = async () => {
            if (!currentSubgroup || !currentLevelKey) {
                navigateTo(Screen.LEVEL_SELECTION);
                return;
            }
            setLoading(true);
            try {
                const module = await import(currentSubgroup.filePath);
                const library = module[Object.keys(module)[0]] as LessonLibrary;
                setLessonLibrary(library);
                // Initialize progress for lessons in this level
                if (library[currentLevelKey]) {
                    Object.keys(library[currentLevelKey]).forEach(lessonKey => {
                        initializeLessonProgress(lessonKey, library);
                    });
                }
            } catch (error) {
                console.error("Failed to load lesson library:", error);
            } finally {
                setLoading(false);
            }
        };
        loadLibrary();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentSubgroup, currentLevelKey]);

    const handleLessonSelect = (lessonKey: string) => {
        setCurrentLessonKey(lessonKey);
        navigateTo(Screen.LESSON_VIEW, Screen.LESSON_SELECTION);
    };

    if (loading || !lessonLibrary || !currentLevelKey || !lessonLibrary[currentLevelKey]) {
        return (
            <ScreenContainer>
                <BackButton onClick={() => navigateTo(Screen.LEVEL_SELECTION)} />
                <h2 className="text-3xl font-bold text-highlight mb-8">اختر الدرس</h2>
                <p>جار تحميل الدروس...</p>
            </ScreenContainer>
        );
    }
    
    const level = lessonLibrary[currentLevelKey];

    return (
        <ScreenContainer>
            <BackButton onClick={() => navigateTo(Screen.LEVEL_SELECTION)} />
            <h2 className="text-3xl font-bold text-highlight mb-8">اختر الدرس</h2>
            <div className="flex gap-4 flex-wrap justify-center p-2 w-full max-w-3xl">
                {Object.entries(level).map(([lessonKey, lessonData]) => (
                    <LessonCard
                        key={lessonKey}
                        lessonKey={lessonKey}
                        progressPercent={calculateLessonProgress(lessonKey, lessonData as Lesson, progress, getLessonStatus)}
                        onClick={() => handleLessonSelect(lessonKey)}
                    />
                ))}
            </div>
        </ScreenContainer>
    );
};

export default LessonSelectionScreen;
