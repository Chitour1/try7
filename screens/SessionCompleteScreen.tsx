
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Screen } from '../types';
import ScreenContainer from '../components/common/ScreenContainer';
import Button from '../components/common/Button';

const SessionCompleteScreen = () => {
    const { navigateTo } = useApp();

    return (
        <ScreenContainer>
            <h2 className="text-4xl font-bold text-highlight mb-4">ممتاز!</h2>
            <p className="text-text-muted text-lg mb-8">لقد أتممت الجلسة. عمل رائع!</p>
            <Button onClick={() => navigateTo(Screen.START)}>
                العودة للقائمة الرئيسية
            </Button>
        </ScreenContainer>
    );
};

export default SessionCompleteScreen;
