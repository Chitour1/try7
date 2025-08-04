
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Screen } from '../types';
import ScreenContainer from '../components/common/ScreenContainer';
import Button from '../components/common/Button';

const WritingExerciseScreen = () => {
    const { navigateTo, currentLessonKey, addPoints } = useAppContext();
    const [inputValue, setInputValue] = useState('');
    const [feedback, setFeedback] = useState<{ message: string; type: 'correct' | 'incorrect' | '' }>({ message: '', type: '' });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const checkAnswer = () => {
        if (!currentLessonKey) return;
        
        const isCorrect = inputValue.trim().toLowerCase() === currentLessonKey.toLowerCase();
        if (isCorrect) {
            setFeedback({ message: 'صحيح! أحسنت.', type: 'correct' });
            addPoints(10);
            setIsSubmitted(true);
            setTimeout(() => navigateTo(Screen.SESSION_COMPLETE, Screen.WRITING_EXERCISE), 1500);
        } else {
            setFeedback({ message: `حاول مرة أخرى. الإجابة الصحيحة هي: ${currentLessonKey}`, type: 'incorrect' });
        }
    };
    
    const handleSkip = () => {
        navigateTo(Screen.SESSION_COMPLETE, Screen.WRITING_EXERCISE);
    };

    const feedbackClass = {
        correct: 'text-success',
        incorrect: 'text-danger',
        '': ''
    };

    return (
        <ScreenContainer>
            <h2 className="text-3xl font-bold text-highlight mb-4">تمرين كتابي</h2>
            <p className="text-text-muted mb-6 text-center">لترسيخ الكلمة، حاول كتابتها من ذاكرتك.</p>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isSubmitted}
                className="bg-bg-dark border-2 border-tile-border text-text-main p-4 rounded-lg text-2xl text-center w-full max-w-sm my-4 font-sans-en focus:outline-none focus:border-highlight transition-colors"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
            />
            <div className={`min-h-[28px] my-4 font-bold ${feedbackClass[feedback.type]}`}>
                {feedback.message}
            </div>
            <div className="flex gap-4 mt-4">
                <Button onClick={checkAnswer} disabled={isSubmitted || !inputValue}>
                    تحقق
                </Button>
                <Button onClick={handleSkip} variant="secondary" disabled={isSubmitted}>
                    تخطي
                </Button>
            </div>
        </ScreenContainer>
    );
};

export default WritingExerciseScreen;
