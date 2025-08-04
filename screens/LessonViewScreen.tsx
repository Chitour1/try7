
import React, { useEffect, useState, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Screen, LessonLibrary, Lesson, PracticeItem } from '../types';
import { SRS_STAGES } from '../constants';
import ScreenContainer from '../components/common/ScreenContainer';
import BackButton from '../components/common/BackButton';
import Button from '../components/common/Button';

const TipIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 stroke-accent shrink-0">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <path d="m9 12 2 2 4-4"></path>
    </svg>
);

const SentenceCard: React.FC<{ sentence: any; repsDone: number; repsNeeded: number }> = ({ sentence, repsDone, repsNeeded }) => {
    const isCompleted = repsDone >= repsNeeded;
    const highlightedHtml = { __html: sentence.en.replace(new RegExp(sentence.highlight.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), `<span class="font-bold text-highlight">${sentence.highlight}</span>`) };

    return (
        <div className="bg-tile-bg border-l-4 border-accent rounded-lg p-4 mb-3 text-right">
            <div className="flex justify-between items-center mb-2">
                <div className={`text-sm py-1 px-3 rounded-full font-bold ${isCompleted ? 'bg-success/20 text-success' : 'bg-tile-border/50 text-text-muted'}`}>
                    {repsDone} / {repsNeeded}
                </div>
                <div className="text-sm text-text-muted">{sentence.context}</div>
            </div>
            {sentence.tip_ar && (
                <div className="flex items-start gap-2 text-sm text-accent bg-accent/10 p-2 rounded-md my-2 text-right border-r-2 border-accent">
                    <TipIcon />
                    <span>{sentence.tip_ar}</span>
                </div>
            )}
            <div className="font-sans-en text-xl font-medium direction-ltr my-2 text-left" dangerouslySetInnerHTML={highlightedHtml} />
            <div className="text-base text-text-muted my-2">{sentence.ar}</div>
            <div className="border-t border-tile-border pt-2 text-sm text-text-muted font-sans-en direction-ltr text-left">
                {sentence.pronunciation_en && <div>{sentence.pronunciation_en}</div>}
                {sentence.pronunciation_ar && <div className="font-sans-ar direction-rtl mt-1">{sentence.pronunciation_ar}</div>}
            </div>
        </div>
    );
};

const LessonViewScreen = () => {
    const { navigateTo, currentSubgroup, currentLevelKey, currentLessonKey, progress, setPracticeList, setIsGlobalSession, setCurrentPracticeItemIndex } = useApp();
    const [lessonData, setLessonData] = useState<Lesson | null>(null);

    useEffect(() => {
        const loadLesson = async () => {
            if (!currentSubgroup || !currentLevelKey || !currentLessonKey) {
                navigateTo(Screen.LESSON_SELECTION);
                return;
            }
            try {
                const module = await import(currentSubgroup.filePath);
                const library = module[Object.keys(module)[0]] as LessonLibrary;
                setLessonData(library[currentLevelKey][currentLessonKey]);
            } catch (error) {
                console.error("Failed to load lesson data:", error);
            }
        };
        loadLesson();
    }, [currentSubgroup, currentLevelKey, currentLessonKey, navigateTo]);

    const lessonProgress = useMemo(() => {
        return currentLessonKey ? progress[currentLessonKey] : null;
    }, [progress, currentLessonKey]);

    const { repsNeeded, incompleteReps, isLessonComplete } = useMemo(() => {
        if (!lessonProgress || !lessonData) return { repsNeeded: 0, incompleteReps: 0, isLessonComplete: true };

        const repsNeeded = SRS_STAGES[lessonProgress.stage].reps;
        let incompleteReps = 0;
        lessonData.sentences.forEach(sentence => {
            const repsDone = lessonProgress.sentenceProgress[sentence.id] || 0;
            if (repsDone < repsNeeded) {
                incompleteReps += (repsNeeded - repsDone);
            }
        });
        return { repsNeeded, incompleteReps, isLessonComplete: incompleteReps === 0 };
    }, [lessonProgress, lessonData]);

    const startPractice = () => {
        if (!lessonData || !lessonProgress || !currentLessonKey) return;
        
        const practiceItems: PracticeItem[] = [];
        const repsNeeded = SRS_STAGES[lessonProgress.stage].reps;

        lessonData.sentences.forEach(sentence => {
            const repsDone = lessonProgress.sentenceProgress[sentence.id] || 0;
            if (repsDone < repsNeeded) {
                for (let i = 0; i < (repsNeeded - repsDone); i++) {
                    practiceItems.push({ sentence, lessonKey: currentLessonKey! });
                }
            }
        });

        setPracticeList(practiceItems.sort(() => Math.random() - 0.5));
        setIsGlobalSession(false);
        setCurrentPracticeItemIndex(0);
        navigateTo(Screen.PRACTICE, Screen.LESSON_VIEW);
    };

    if (!lessonData || !lessonProgress) {
        return (
            <ScreenContainer>
                <p>جار تحميل الدرس...</p>
            </ScreenContainer>
        );
    }

    return (
        <ScreenContainer isScrollable>
            <BackButton onClick={() => navigateTo(Screen.LESSON_SELECTION)} />
            <div className="w-full flex flex-col h-full">
                <h2 className="text-3xl font-bold text-highlight mb-4 text-center sticky top-0 bg-primary py-2 z-10">{lessonData.title}</h2>
                <div className="bg-bg-dark p-3 sm:p-4 rounded-xl border border-tile-border flex-grow overflow-y-auto mb-4">
                    {lessonData.sentences.map(sentence => (
                        <SentenceCard 
                            key={sentence.id} 
                            sentence={sentence} 
                            repsDone={lessonProgress.sentenceProgress[sentence.id] || 0}
                            repsNeeded={repsNeeded}
                        />
                    ))}
                </div>
                <div className="mt-auto pt-4 border-t border-tile-border">
                    <Button onClick={startPractice} disabled={isLessonComplete} className="w-full">
                        {isLessonComplete ? 'الدرس مكتمل!' : `ابدأ التمرين (${incompleteReps} تكرار متبقي)`}
                    </Button>
                </div>
            </div>
        </ScreenContainer>
    );
};

export default LessonViewScreen;
