import React, { useEffect, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { Screen, Progress, LessonProgress } from '../types';
import { SRS_STAGES } from '../constants';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import ScreenContainer from '../components/common/ScreenContainer';
import BackButton from '../components/common/BackButton';

const SpeakerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
    </svg>
);
const TipIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
);


const PracticeScreen = () => {
    const { navigateTo, previousScreen, practiceList, currentPracticeItemIndex, setCurrentPracticeItemIndex, progress, updateLessonProgress, addPoints, isGlobalSession, checkStreak, getLessonSentences, fullLessonLibrary, profile, updateSettings, setCurrentLessonKey } = useApp();
    const { speak } = useSpeechSynthesis();

    const currentItem = practiceList[currentPracticeItemIndex];
    
    useEffect(() => {
        if (currentItem) {
            speak(currentItem.sentence.en);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentItem]);

    const handleNext = async () => {
        if (!currentItem) return;

        const { sentence, lessonKey } = currentItem;
        const lessonP = progress[lessonKey];

        if (!lessonP) {
            console.error(`Progress for lesson key "${lessonKey}" not found.`);
            if (currentPracticeItemIndex >= practiceList.length - 1) {
                 navigateTo(Screen.SESSION_COMPLETE, Screen.PRACTICE);
            } else {
                setCurrentPracticeItemIndex(currentPracticeItemIndex + 1);
            }
            return;
        }
        
        const newLessonProgress: LessonProgress = JSON.parse(JSON.stringify(lessonP));
        newLessonProgress.sentenceProgress[sentence.id]++;
        await addPoints(1);

        const lessonSentences = getLessonSentences(lessonKey, fullLessonLibrary);

        if (lessonSentences) {
            const lessonStage = newLessonProgress.stage;
            const repsNeeded = SRS_STAGES[lessonStage].reps;
            const isLessonComplete = lessonSentences.every(s => (newLessonProgress.sentenceProgress[s.id] || 0) >= repsNeeded);

            if (isLessonComplete) {
                if (newLessonProgress.stage === 0) {
                    await addPoints(50);
                }
                newLessonProgress.stage++;
                newLessonProgress.lastCompletion = new Date().toISOString();
                lessonSentences.forEach(s => {
                    newLessonProgress.sentenceProgress[s.id] = 0;
                });
                await checkStreak();
            }
        }
        
        await updateLessonProgress(lessonKey, newLessonProgress);

        if (currentPracticeItemIndex >= practiceList.length - 1) {
            if (!isGlobalSession) {
                setCurrentLessonKey(lessonKey); // For writing exercise
                navigateTo(Screen.WRITING_EXERCISE, Screen.PRACTICE);
            } else {
                navigateTo(Screen.SESSION_COMPLETE, Screen.PRACTICE);
            }
        } else {
            setCurrentPracticeItemIndex(currentPracticeItemIndex + 1);
        }
    };

    const currentProgress = useMemo(() => {
        if (!currentItem) return { repsDone: 0, repsNeeded: 0 };
        const { sentence, lessonKey } = currentItem;
        const p = progress[lessonKey];
        if (!p) return { repsDone: 0, repsNeeded: 0 };
        return {
            repsDone: p.sentenceProgress[sentence.id] || 0,
            repsNeeded: SRS_STAGES[p.stage].reps
        };
    }, [currentItem, progress]);

    if (!currentItem || !profile) {
        return (
            <ScreenContainer>
                <p>لا توجد عناصر للتمرين.</p>
                <BackButton onClick={() => navigateTo(previousScreen)} />
            </ScreenContainer>
        );
    }
    
    const { sentence } = currentItem;
    const highlightedHtml = { __html: sentence.en.replace(new RegExp(sentence.highlight.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), `<span class="font-bold text-highlight">${sentence.highlight}</span>`) };

    return (
        <ScreenContainer>
            <BackButton onClick={() => navigateTo(previousScreen)} />
            <h2 className="text-3xl font-bold text-highlight mb-6">التمرين</h2>
            
            <div 
                className="w-full max-w-2xl min-h-[320px] border-2 border-highlight rounded-2xl flex flex-col justify-center items-center p-5 relative cursor-pointer transition-transform active:scale-[0.98] active:border-accent"
                onClick={handleNext}
            >
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        speak(sentence.en);
                    }}
                    className="absolute top-4 right-4 text-text-muted hover:text-highlight transition-colors"
                    aria-label="Read sentence aloud"
                >
                    <SpeakerIcon />
                </button>

                {sentence.context && <div className="font-sans-ar text-lg font-medium text-accent bg-accent/10 py-1 px-4 rounded-full mb-4">{sentence.context}</div>}
                <div className="text-lg text-text-muted text-center mb-4">{sentence.ar}</div>
                <div className="font-sans-en text-3xl text-text-main direction-ltr text-center mb-4" dangerouslySetInnerHTML={highlightedHtml} />

                <div className="w-[90%] border-t border-tile-border pt-3 text-center">
                    {sentence.pronunciation_en && <div className="font-sans-en text-base text-text-muted direction-ltr">{sentence.pronunciation_en}</div>}
                    {sentence.pronunciation_ar && <div className="font-sans-ar text-base text-text-muted direction-rtl mt-1">{sentence.pronunciation_ar}</div>}
                </div>
                
                {sentence.tip_ar &&
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] flex items-start gap-2 text-sm text-accent bg-accent/10 p-2 rounded-md text-right border-r-2 border-accent">
                        <TipIcon />
                        <span>{sentence.tip_ar}</span>
                    </div>
                }
            </div>

            <div className="flex items-center justify-between w-full max-w-2xl mt-5">
                <div className="text-2xl font-bold text-highlight font-sans-en">{`${currentProgress.repsDone} / ${currentProgress.repsNeeded}`}</div>
                <div className="flex items-center gap-3 text-sm">
                    <label htmlFor="speed-slider">السرعة</label>
                    <input 
                        type="range" 
                        id="speed-slider" 
                        min="0.4" max="1.2" step="0.1" 
                        value={profile.settings.speechRate}
                        onChange={(e) => updateSettings({ speechRate: parseFloat(e.target.value) })}
                        className="w-32 accent-highlight"
                    />
                    <span className="font-sans-en font-bold text-accent min-w-[40px]">{profile.settings.speechRate.toFixed(1)}x</span>
                </div>
            </div>
        </ScreenContainer>
    );
};

export default PracticeScreen;