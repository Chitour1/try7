import React from 'react';
import { AppContextProvider, useAppContext } from './contexts/AppContext'; // ✅ تم التعديل
import AuthScreen from './screens/AuthScreen';
import StartScreen from './screens/StartScreen';
import ProfileScreen from './screens/ProfileScreen';
import LevelGroupScreen from './screens/LevelGroupScreen';
import LevelSubgroupScreen from './screens/LevelSubgroupScreen';
import LevelSelectionScreen from './screens/LevelSelectionScreen';
import LessonSelectionScreen from './screens/LessonSelectionScreen';
import LessonViewScreen from './screens/LessonViewScreen';
import ReviewCenterScreen from './screens/ReviewCenterScreen';
import PracticeScreen from './screens/PracticeScreen';
import WritingExerciseScreen from './screens/WritingExerciseScreen';
import SessionCompleteScreen from './screens/SessionCompleteScreen';
import Header from './components/Header';
import DestructionMode from './components/DestructionMode';
import { Screen } from './types';

const AppContent = () => {
    const { currentScreen, destructionModeActive, session, authLoading } = useAppContext(); // ✅ تم التعديل

    if (authLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-bg-dark text-text-main">
                <p>جار التحقق من المستخدم...</p>
            </div>
        );
    }
    
    if (!session) {
        return <AuthScreen />;
    }

    const renderScreen = () => {
        switch (currentScreen) {
            case Screen.START:
                return <StartScreen />;
            case Screen.PROFILE:
                return <ProfileScreen />;
            case Screen.LEVEL_GROUP:
                return <LevelGroupScreen />;
            case Screen.LEVEL_SUBGROUP:
                return <LevelSubgroupScreen />;
            case Screen.LEVEL_SELECTION:
                return <LevelSelectionScreen />;
            case Screen.LESSON_SELECTION:
                return <LessonSelectionScreen />;
            case Screen.LESSON_VIEW:
                return <LessonViewScreen />;
            case Screen.REVIEW_CENTER:
                return <ReviewCenterScreen />;
            case Screen.PRACTICE:
                return <PracticeScreen />;
            case Screen.WRITING_EXERCISE:
                return <WritingExerciseScreen />;
            case Screen.SESSION_COMPLETE:
                return <SessionCompleteScreen />;
            default:
                return <StartScreen />;
        }
    };
    
    return (
        <div className={`bg-bg-dark text-text-main min-h-screen antialiased ${destructionModeActive ? 'cursor-none' : ''}`}>
            <div id="content-to-destroy" className={destructionModeActive ? 'absolute inset-0 w-screen h-screen overflow-y-auto z-[1]' : ''}>
                <Header />
                <main className="pt-24 sm:pt-28 px-5 pb-5 flex justify-center w-full box-border">
                    <div className="w-full max-w-4xl flex flex-col justify-center items-center box-border">
                        {renderScreen()}
                    </div>
                </main>
            </div>
            {destructionModeActive && <DestructionMode />}
        </div>
    );
};

const App = () => {
    return (
        <AppContextProvider>
            <AppContent />
        </AppContextProvider>
    );
};

export default App;
