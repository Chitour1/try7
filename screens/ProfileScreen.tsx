import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Screen } from '../types';
import ScreenContainer from '../components/common/ScreenContainer';
import BackButton from '../components/common/BackButton';

interface StatCardProps {
    value: number | string;
    label: string;
}

const StatCard: React.FC<StatCardProps> = ({ value, label }) => (
    <div className="bg-bg-dark p-5 rounded-2xl border border-tile-border text-center transform transition-transform hover:scale-105">
        <div className="text-4xl font-bold font-sans-en text-highlight">{value}</div>
        <div className="text-base text-text-muted mt-1">{label}</div>
    </div>
);

const ProfileScreen = () => {
    const { navigateTo, profile, getCompletedLessonsCount, getMasteredLessonsCount } = useApp();
    
    if (!profile) {
        return (
            <ScreenContainer>
                <BackButton onClick={() => navigateTo(Screen.START)} />
                <p>لا يمكن تحميل الملف الشخصي.</p>
            </ScreenContainer>
        );
    }
    
    const completedCount = getCompletedLessonsCount();
    const masteredCount = getMasteredLessonsCount();

    return (
        <ScreenContainer>
            <BackButton onClick={() => navigateTo(Screen.START)} />
            <h2 className="text-3xl font-bold text-highlight mb-2">ملف {profile.username}</h2>
            <p className="text-text-muted mb-8">{profile.id}</p>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full max-w-lg">
                <StatCard value={profile.points} label="إجمالي النقاط" />
                <StatCard value={profile.max_streak} label="أفضل سلسلة يومية" />
                <StatCard value={completedCount} label="الدروس المكتملة" />
                <StatCard value={masteredCount} label="الدروس المتقنة" />
            </div>
        </ScreenContainer>
    );
};

export default ProfileScreen;