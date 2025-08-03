import { Session, User as SupabaseUser } from '@supabase/supabase-js';

export interface Sentence {
    id: string;
    en: string;
    ar: string;
    highlight: string;
    context: string;
    pronunciation_en?: string;
    pronunciation_ar?: string;
    tip_ar?: string;
}

export interface Lesson {
    title: string;
    sentences: Sentence[];
}

export interface Level {
    [lessonKey: string]: Lesson;
}

export interface LessonLibrary {
    [levelKey: string]: Level;
}

export interface SentenceProgress {
    [sentenceId: string]: number;
}

export interface LessonProgress {
    stage: number;
    lastCompletion: string | null;
    sentenceProgress: SentenceProgress;
}

export interface Progress {
    [lessonKey:string]: LessonProgress;
}

export interface Settings {
    speechRate: number;
}

// Represents the user's profile data stored in the 'profiles' table
export interface Profile {
    id: string;
    username: string;
    points: number;
    current_streak: number;
    max_streak: number;
    last_login: string | null;
    settings: Settings;
}

export interface SRSStage {
    name: string;
    intervalDays: number;
    reps: number;
}

export interface LessonStatus {
    status: 'learning' | 'active' | 'locked' | 'mastered';
    stage: number;
    dueTimestamp?: number;
}

export interface PracticeItem {
    sentence: Sentence;
    lessonKey: string;
}

export enum Screen {
    AUTH = 'AUTH',
    START = 'START',
    PROFILE = 'PROFILE',
    LEVEL_GROUP = 'LEVEL_GROUP',
    LEVEL_SUBGROUP = 'LEVEL_SUBGROUP',
    LEVEL_SELECTION = 'LEVEL_SELECTION',
    LESSON_SELECTION = 'LESSON_SELECTION',
    LESSON_VIEW = 'LESSON_VIEW',
    REVIEW_CENTER = 'REVIEW_CENTER',
    PRACTICE = 'PRACTICE',
    WRITING_EXERCISE = 'WRITING_EXERCISE',
    SESSION_COMPLETE = 'SESSION_COMPLETE',
}

export interface LibraryGroup {
    groupName: string;
    filePath: string;
}

export interface AppContextType {
    // Auth
    session: Session | null;
    profile: Profile | null;
    authLoading: boolean;
    signOut: () => void;
    
    // Navigation
    currentScreen: Screen;
    previousScreen: Screen;
    navigateTo: (screen: Screen, from?: Screen) => void;

    // Data
    progress: Progress;
    updateLessonProgress: (lessonKey: string, updatedProgress: LessonProgress) => Promise<void>;
    initializeLessonProgress: (lessonKey: string, library: LessonLibrary) => void;
    getLessonStatus: (lessonKey: string) => LessonStatus;
    
    // Stats & Settings
    addPoints: (amount: number) => Promise<void>;
    checkStreak: () => Promise<void>;
    settings: Settings;
    updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
    getCompletedLessonsCount: () => number;
    getMasteredLessonsCount: () => number;
    
    // Practice Session
    practiceList: PracticeItem[];
    setPracticeList: (list: PracticeItem[]) => void;
    currentPracticeItemIndex: number;
    setCurrentPracticeItemIndex: (index: number) => void;
    isGlobalSession: boolean;
    setIsGlobalSession: (isGlobal: boolean) => void;

    // Current selections
    currentLevelKey: string | null;
    setCurrentLevelKey: (key: string | null) => void;
    currentLessonKey: string | null;
    setCurrentLessonKey: (key: string | null) => void;
    currentGroup: LibraryGroup | null;
    setCurrentGroup: (group: LibraryGroup | null) => void;
    currentSubgroup: LibraryGroup | null;
    setCurrentSubgroup: (group: LibraryGroup | null) => void;
    
    // Misc
    destructionModeActive: boolean;
    setDestructionModeActive: (active: boolean) => void;

    // Library
    fullLessonLibrary: LessonLibrary;
    ensureFullLibraryLoaded: () => Promise<void>;
    getLessonSentences: (lessonKey: string, library: LessonLibrary) => Sentence[] | null;
}