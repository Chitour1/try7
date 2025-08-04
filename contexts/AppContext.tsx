import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase } from '../services/supabaseClient';
import { Session } from '@supabase/supabase-js';
import { Screen, Progress, Settings, PracticeItem, LibraryGroup, LessonLibrary, AppContextType, Profile } from '../types';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // All other states remain the same...
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [progress, setProgress] = useState<Progress>({});
    const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.START);
    const [previousScreen, setPreviousScreen] = useState<Screen>(Screen.START);
    const [settings, setSettings] = useState<Settings>({ speechRate: 0.6 });
    const [practiceList, setPracticeList] = useState<PracticeItem[]>([]);
    const [currentPracticeItemIndex, setCurrentPracticeItemIndex] = useState<number>(0);
    const [isGlobalSession, setIsGlobalSession] = useState<boolean>(false);
    const [currentLevelKey, setCurrentLevelKey] = useState<string | null>(null);
    const [currentLessonKey, setCurrentLessonKey] = useState<string | null>(null);
    const [currentGroup, setCurrentGroup] = useState<LibraryGroup | null>(null);
    const [currentSubgroup, setCurrentSubgroup] = useState<LibraryGroup | null>(null);
    const [destructionModeActive, setDestructionModeActive] = useState<boolean>(false);
    const [fullLessonLibrary, setFullLessonLibrary] = useState<LessonLibrary>({});
    const [isFullLibraryLoaded, setIsFullLibraryLoaded] = useState(false);

    // All useEffects and other functions remain the same...
    useEffect(() => {
        // Auth listener logic...
    }, []);

    useEffect(() => {
        // User data fetching logic...
    }, [session]);
    
    const signOut = async () => {
        // Sign out logic...
    };

    // ✅ هذا هو الكود الصحيح للدالة
    const navigateTo = (newScreen: Screen, oldScreen?: Screen) => {
        if (oldScreen) {
            setPreviousScreen(oldScreen);
        } else {
            setPreviousScreen(currentScreen);
        }
        setCurrentScreen(newScreen);
    };

    // The value object and the return statement remain the same...
    const value = {
        session,
        profile,
        authLoading,
        progress,
        settings,
        currentScreen,
        previousScreen,
        practiceList,
        currentPracticeItemIndex,
        isGlobalSession,
        currentLevelKey,
        currentLessonKey,
        currentGroup,
        currentSubgroup,
        destructionModeActive,
        fullLessonLibrary,
        isFullLibraryLoaded,
        setSession,
        setProfile,
        setProgress,
        setSettings,
        setCurrentScreen,
        setPreviousScreen,
        setPracticeList,
        setCurrentPracticeItemIndex,
        setIsGlobalSession,
        setCurrentLevelKey,
        setCurrentLessonKey,
        setCurrentGroup,
        setCurrentSubgroup,
        setDestructionModeActive,
        setFullLessonLibrary,
        setIsFullLibraryLoaded,
        signOut,
        navigateTo // The function is now correctly implemented
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppContextProvider');
    }
    return context;
};
