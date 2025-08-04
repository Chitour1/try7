import React from 'react';
import { useAppContext } from '../contexts/AppContext';

const LogoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-accent w-7 h-7">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>
);

const ScoreIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.321h5.362c.512 0 .733.664.348 1.002l-4.33 3.14a.563.563 0 00-.176.573l1.581 4.83c.215.66-.525 1.2-1.125.822L12 15.321a.563.563 0 00-.56 0L7.172 18.18c-.6.378-1.34.038-1.125-.822l1.58-4.83a.563.563 0 00-.176-.573l-4.33-3.14a.563.563 0 01.348-1.002h5.362a.563.563 0 00.475-.321L11.48 3.5z" />
    </svg>
);

const StreakIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 00-4.242 0c.233.383.44 1.12.44 1.12l3.879 3.879a1.5 1.5 0 002.121-2.121l-3.879-3.879c-.345-.345-1.12-.44-1.12-.44z" />
    </svg>
);

const StatDisplay: React.FC<{ value: number; type: 'score' | 'streak' }> = ({ value, type }) => {
    const colorClass = type === 'score' ? 'text-accent' : 'text-streak';
    return (
        <div className={`flex items-center gap-2 font-sans-en font-bold text-lg ${colorClass}`}>
            {type === 'score' ? <ScoreIcon /> : <StreakIcon />}
            <span>{value}</span>
        </div>
    );
};

const Header = () => {
    const { profile, signOut } = useAppContext();
    
    return (
        <header className="bg-primary/80 backdrop-blur-sm py-3 px-4 sm:px-6 border-b border-tile-border fixed top-0 left-0 right-0 z-50 shadow-lg">
            <nav className="max-w-4xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <LogoIcon />
                    <h1 className="text-xl sm:text-2xl font-bold text-text-main font-sans-ar">تمرين الإنجليزية</h1>
                </div>
                <div className="flex items-center gap-4 sm:gap-6">
                    {profile && (
                        <>
                            <StatDisplay value={profile.points} type="score" />
                            <StatDisplay value={profile.current_streak} type="streak" />
                            <button onClick={signOut} className="text-sm text-text-muted hover:text-highlight transition-colors">
                                الخروج
                            </button>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;
