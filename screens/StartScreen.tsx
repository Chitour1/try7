
import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Screen } from '../types';
import ScreenContainer from '../components/common/ScreenContainer';

const ProfileIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>);
const LessonsIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>);
const ReviewIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18M12 15.75h.008v.008H12v-.008Z" /></svg>);
const BoredIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25a8.964 8.964 0 012.938 17.519 8.964 8.964 0 01-5.876 0A8.964 8.964 0 0112 2.25z" /></svg>);

interface IconButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({ icon, label, onClick }) => (
    <button
        onClick={onClick}
        className="bg-tile-bg border border-tile-border text-text-main p-4 rounded-xl text-base cursor-pointer transition-all duration-200 flex flex-col items-center gap-2 w-32 h-32 justify-center hover:border-highlight hover:bg-primary/50 transform hover:-translate-y-1"
    >
        <div className="w-8 h-8 stroke-highlight">{icon}</div>
        <span>{label}</span>
    </button>
);

const StartScreen = () => {
    const { navigateTo, setDestructionModeActive } = useApp();

    return (
        <ScreenContainer>
            <h1 className="text-3xl sm:text-4xl font-bold text-highlight mb-4">تمرين الإنجليزية</h1>
            <p className="text-text-muted mb-8 text-center max-w-md">
                اختر "ابدأ الدروس" لتعلّم كلمات جديدة، أو اذهب إلى "مركز المراجعة" لتمرين الكلمات التي تعلمتها.
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-4">
                <IconButton icon={<ProfileIcon />} label="ملف المتعلم" onClick={() => navigateTo(Screen.PROFILE, Screen.START)} />
                <IconButton icon={<LessonsIcon />} label="ابدأ الدروس" onClick={() => navigateTo(Screen.LEVEL_GROUP, Screen.START)} />
                <IconButton icon={<ReviewIcon />} label="مركز المراجعة" onClick={() => navigateTo(Screen.REVIEW_CENTER, Screen.START)} />
                <IconButton icon={<BoredIcon />} label="وضع الملل" onClick={() => setDestructionModeActive(true)} />
            </div>
        </ScreenContainer>
    );
};

export default StartScreen;
