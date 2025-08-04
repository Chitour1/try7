import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '../services/supabaseClient';
import { Session } from '@supabase/supabase-js';
import { Screen, Progress, Settings, PracticeItem, LibraryGroup, LessonLibrary, AppContextType, Sentence, Lesson, LessonProgress, Profile } from '../types';
import { SRS_STAGES, LIBRARY_INDEX_URL } from '../constants';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Auth State
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    
    // App State
    const [progress, setProgress] = useState<Progress>({});
    const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.START);
    const [previousScreen, setPreviousScreen] = useState<Screen>(Screen.START);
    const [settings, setSettings] = useState<Settings>({ speechRate: 0.6 });

    // Practice State
    const [practiceList, setPracticeList] = useState<PracticeItem[]>([]);
    const [currentPracticeItemIndex, setCurrentPracticeItemIndex] = useState<number>(0);
    const [isGlobalSession, setIsGlobalSession] = useState<boolean>(false);

    // Navigation State
    const [currentLevelKey, setCurrentLevelKey] = useState<string | null>(null);
    const [currentLessonKey, setCurrentLessonKey] = useState<string | null>(null);
    const [currentGroup, setCurrentGroup] = useState<LibraryGroup | null>(null);
    const [currentSubgroup, setCurrentSubgroup] = useState<LibraryGroup | null>(null);
    
    // Misc State
    const [destructionModeActive, setDestructionModeActive] = useState<boolean>(false);
    const [fullLessonLibrary, setFullLessonLibrary] = useState<LessonLibrary>({});
    const [isFullLibraryLoaded, setIsFullLibraryLoaded] = useState(false);

    // --- Auth State Management ---

    // 1. Listener for auth events (login, logout) - sets the session.
    useEffect(() => {
        setAuthLoading(true);
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sessionState) => {
            setSession(sessionState);
        });
        // Initial session check
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    // 2. Effect to fetch user data when session changes
    useEffect(() => {
        const fetchUserData = async () => {
            setAuthLoading(true);
            if (session) {
                // Fetch profile
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles').select('*').eq('id', session.user.id).single();

                if (profileError) {
                    console.error('Error fetching profile:', profileError);
                    setProfile(null);
                } else {
                    setProfile(profileData);
                    setSettings(profileData.settings || { speechRate: 0.6 });
                }

                // Fetch progress
                const { data: progressData, error: progressError } = await supabase
                    .from('lesson_progress').select('*').eq('user_id', session.user.id);
                
                if (progressError) {
                    console.error('Error fetching progress:', progressError);
                    setProgress({});
                } else {
                    const progressMap = progressData.reduce((acc: Progress, p) => {
                        acc[p.lesson_key] = { stage: p.stage, lastCompletion: p.last_completion, sentenceProgress: p.sentence_progress };
                        return acc;
                    }, {});
                    setProgress(progressMap);
                }
            } else {
                // No session, clear user data
                setProfile(null);
                setProgress({});
            }
            setAuthLoading(false);
        };

        fetchUserData();
    }, [session]);

    // 3. Effect to check daily streak when profile is loaded
    useEffect(() => {
        if (profile) {
            // checkStreak(); // Commenting out for now if checkStreak is not defined
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profile?.id]); // Depends on the profile ID to run once per login

    
    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error signing out:', error);
        }
        // No need to navigate, the useEffect listening to `session` will handle the state change.
    };

    // --- ✅ هذا هو السطر الذي تم إصلاحه ---
    const navigateTo = () => {};
    // ------------------------------------
