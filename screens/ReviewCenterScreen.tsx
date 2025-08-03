
import React, { useEffect, useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { Screen, LessonStatus, PracticeItem, Sentence } from '../types';
import { SRS_STAGES } from '../constants';
import ScreenContainer from '../components/common/ScreenContainer';
import BackButton from '../components/common/BackButton';
import Button from '../components/common/Button';

const LockedIcon = () => (
    <svg className="w-6 h-6 stroke-text-muted" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 0 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
);
const UnlockedIcon = () => (
    <svg className="w-6 h-6 stroke-success" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
);

const Countdown: React.FC<{ dueTimestamp: number }> = ({ dueTimestamp }) => {
    const [timeLeft, setTimeLeft] = useState(dueTimestamp - Date.now());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(dueTimestamp - Date.now());
        }, 1000);
        return () => clearInterval(timer);
    }, [dueTimestamp]);

    if (timeLeft <= 0) {
        return <div className="text-sm text-accent font-sans-en text-right mt-2">جاهز للمراجعة!</div>;
    }

    const d = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const h = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return (
        <div className="text-sm text-text-muted font-sans-en text-right mt-2">
            {`يفتح بعد: ${d > 0 ? `${d}ي ` : ''}${h}س ${m}د ${s}ث`}
        </div>
    );
};

const ReviewLessonCard: React.FC<{ lessonKey: string; status: LessonStatus }> = ({ lessonKey, status }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { getLessonSentences, fullLessonLibrary } = useApp();
    const sentences = getLessonSentences(lessonKey, fullLessonLibrary);
    
    const borderColorClass = `border-srs-${status.stage}`;
    const isLocked = status.status === 'locked';

    return (
        <div className={`bg-tile-bg rounded-lg p-4 mb-3 border-l-4 ${borderColorClass} ${isLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}>
            <div className="flex justify-between items-center" onClick={() => !isLocked && setIsOpen(!isOpen)}>
                <div className="text-xl font-bold font-sans-en">{lessonKey}</div>
                {isLocked ? <LockedIcon /> : <UnlockedIcon />}
            </div>
            {isLocked && status.dueTimestamp && <Countdown dueTimestamp={status.dueTimestamp} />}
            {isOpen && !isLocked && sentences && (
                <div className="mt-4 border-t border-tile-border pt-4">
                    {sentences.map((s: Sentence) => (
                        <div key={s.id} className="text-sm text-right text-text-muted p-2 bg-bg-dark rounded mb-1">{s.en} - {s.ar}</div>
                    ))}
                </div>
            )}
        </div>
    );
};

const ReviewCenterScreen = () => {
    const { navigateTo, progress, getLessonStatus, ensureFullLibraryLoaded, fullLessonLibrary, setPracticeList, setIsGlobalSession, setCurrentPracticeItemIndex, getLessonSentences } = useApp();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        ensureFullLibraryLoaded().then(() => setLoading(false));
    }, [ensureFullLibraryLoaded]);

    const reviewItems = useMemo(() => {
        if (loading) return { sections: {}, activeLessonsForReview: [] };
        const sections: { [stage: number]: { lessonKey: string; status: LessonStatus }[] } = {};
        const activeLessonsForReview: string[] = [];

        Object.keys(progress).forEach(lessonKey => {
            // Check if lesson exists in the loaded library
            if (!getLessonSentences(lessonKey, fullLessonLibrary)) {
                return;
            }
            const status = getLessonStatus(lessonKey);
            if (status.status === 'learning') return;

            if (!sections[status.stage]) {
                sections[status.stage] = [];
            }
            sections[status.stage].push({ lessonKey, status });
            if (status.status === 'active') {
                activeLessonsForReview.push(lessonKey);
            }
        });
        return { sections, activeLessonsForReview };
    }, [progress, getLessonStatus, loading, fullLessonLibrary, getLessonSentences]);

    const startGlobalReview = () => {
        const practiceItems: PracticeItem[] = [];
        reviewItems.activeLessonsForReview.forEach(lessonKey => {
            const lessonProgress = progress[lessonKey];
            if (!lessonProgress) return;
            
            const repsNeeded = SRS_STAGES[lessonProgress.stage].reps;
            const sentences = getLessonSentences(lessonKey, fullLessonLibrary);

            if (sentences) {
                sentences.forEach(sentence => {
                    const repsDone = lessonProgress.sentenceProgress[sentence.id] || 0;
                    if (repsDone < repsNeeded) {
                        for (let i = 0; i < (repsNeeded - repsDone); i++) {
                            practiceItems.push({ sentence, lessonKey });
                        }
                    }
                });
            }
        });

        if (practiceItems.length > 0) {
            setPracticeList(practiceItems.sort(() => Math.random() - 0.5));
            setIsGlobalSession(true);
            setCurrentPracticeItemIndex(0);
            navigateTo(Screen.PRACTICE, Screen.REVIEW_CENTER);
        }
    };

    return (
        <ScreenContainer isScrollable>
            <BackButton onClick={() => navigateTo(Screen.START)} />
            <div className="w-full flex flex-col h-full">
                <h2 className="text-3xl font-bold text-highlight mb-4 text-center sticky top-0 bg-primary py-2 z-10">مركز المراجعة</h2>
                <div className="bg-bg-dark p-3 sm:p-4 rounded-xl border border-tile-border flex-grow overflow-y-auto mb-4">
                    {loading ? <p>جار تحميل المراجعات...</p> : (
                        Object.keys(reviewItems.sections).length > 0 ? (
                            Object.keys(reviewItems.sections).sort((a,b) => Number(a)-Number(b)).map(stageKey => (
                                <div key={stageKey} className="mb-6">
                                    <h3 className="text-xl font-bold text-text-main text-right mb-3 pb-2 border-b-2 border-tile-border">{SRS_STAGES[Number(stageKey)].name}</h3>
                                    {reviewItems.sections[Number(stageKey)].map(item => <ReviewLessonCard key={item.lessonKey} {...item} />)}
                                </div>
                            ))
                        ) : <p className="text-center text-text-muted pt-10">لا توجد عناصر للمراجعة بعد. أكمل بعض الدروس أولاً!</p>
                    )}
                </div>
                <div className="mt-auto pt-4 border-t border-tile-border">
                    <Button onClick={startGlobalReview} disabled={reviewItems.activeLessonsForReview.length === 0} className="w-full">
                        {reviewItems.activeLessonsForReview.length > 0 ? `ابدأ المراجعة (${reviewItems.activeLessonsForReview.length} دروس)` : 'لا يوجد مراجعات متاحة'}
                    </Button>
                </div>
            </div>
        </ScreenContainer>
    );
};

export default ReviewCenterScreen;
