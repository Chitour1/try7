
import React, { useEffect, useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Screen, LessonLibrary, Lesson, Progress, Level } from '../types';
import ScreenContainer from '../components/common/ScreenContainer';
import BackButton from '../components/common/BackButton';
import { SRS_STAGES } from '../constants';

const calculateLevelProgress = (levelKey: string, level: { [lessonKey: string]: Lesson }, progress: Progress) => {
    const lessonKeys = Object.keys(level);
    if (lessonKeys.length === 0) return 0;
    
    let lessonsInitiallyCompleted = 0;
    let lessonsMastered = 0;

    lessonKeys.forEach(lessonKey => {
        const p = progress[lessonKey];
        if (p) {
            if (p.stage > 0) lessonsInitiallyCompleted++;
            if (p.stage >= SRS_STAGES.length - 1) lessonsMastered++;
        }
    });

    const initialCompletionRatio = lessonsInitiallyCompleted / lessonKeys.length;
    const masteryRatio = lessonsMastered / lessonKeys.length;
    return (initialCompletionRatio * 50) + (masteryRatio * 50);
};

const LevelCard: React.FC<{ levelKey: string; progressPercent: number; onClick: () => void }> = ({ levelKey, progressPercent, onClick }) => {
    const isCompleted = progressPercent >= 100;

    return (
        <div
            onClick={onClick}
            className={`relative border border-tile-border rounded-xl p-5 text-lg font-sans-ar font-bold cursor-pointer text-center flex-grow basis-48 max-w-xs transition-all duration-200 transform hover:-translate-y-1.5 hover:border-highlight overflow-hidden ${isCompleted ? 'bg-success border-success' : 'bg-tile-bg'}`}
        >
            {!isCompleted && (
                 <div
                    className="absolute top-0 right-0 bottom-0 bg-gradient-to-l from-accent/50 to-accent"
                    style={{ left: `${100 - progressPercent}%`, transition: 'left 0.5s ease-out' }}
                />
            )}
            <span className={`relative z-10 ${isCompleted ? 'text-white' : 'text-text-main mix-blend-screen'}`}>
                {levelKey}
            </span>
        </div>
    );
};

const LevelSelectionScreen = () => {
    const { navigateTo, currentSubgroup, setCurrentLevelKey, progress, initializeLessonProgress } = useApp();
    const [lessonLibrary, setLessonLibrary] = useState<LessonLibrary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadLibrary = async () => {
            if (!currentSubgroup) {
                navigateTo(Screen.LEVEL_SUBGROUP);
                return;
            }
            setLoading(true);
            try {
                const module = await import(currentSubgroup.filePath);
                const library = module[Object.keys(module)[0]] as LessonLibrary;
                setLessonLibrary(library);

                // Initialize progress for all lessons in this library
                Object.values(library).forEach(level => {
                    Object.keys(level).forEach(lessonKey => {
                        initializeLessonProgress(lessonKey, library);
                    });
                });

            } catch (error) {
                console.error("Failed to load lesson library:", error);
            } finally {
                setLoading(false);
            }
        };
        loadLibrary();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentSubgroup]);

    const handleLevelSelect = (levelKey: string) => {
        setCurrentLevelKey(levelKey);
        navigateTo(Screen.LESSON_SELECTION, Screen.LEVEL_SELECTION);
    };

    if (loading || !lessonLibrary) {
        return (
            <ScreenContainer>
                <BackButton onClick={() => navigateTo(Screen.LEVEL_SUBGROUP)} />
                <h2 className="text-3xl font-bold text-highlight mb-8">اختر المستوى</h2>
                <p>جار تحميل المستويات...</p>
            </ScreenContainer>
        );
    }
    
    return (
        <ScreenContainer isScrollable>
            <BackButton onClick={() => navigateTo(Screen.LEVEL_SUBGROUP)} />
            <div className="w-full">
                <h2 className="text-3xl font-bold text-highlight mb-8 sticky top-0 bg-primary py-2 z-10 text-center">اختر المستوى</h2>
                <div className="bg-bg-dark border border-tile-border rounded-2xl p-6 w-full mb-6">
                    <h3 className="text-2xl font-bold text-text-main text-right mb-5 pb-3 border-b-2 border-tile-border">
                        {currentSubgroup?.groupName}
                    </h3>
                    <div className="flex gap-4 flex-wrap justify-center p-2 w-full">
                        {Object.entries(lessonLibrary).map(([levelKey, level]) => (
                            <LevelCard
                                key={levelKey}
                                levelKey={levelKey}
                                progressPercent={calculateLevelProgress(levelKey, level as Level, progress)}
                                onClick={() => handleLevelSelect(levelKey)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </ScreenContainer>
    );
};

export default LevelSelectionScreen;
