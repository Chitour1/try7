import React, { useEffect, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Screen, LibraryGroup } from '../types';
import { LIBRARY_INDEX_URL } from '../constants';
import ScreenContainer from '../components/common/ScreenContainer';
import BackButton from '../components/common/BackButton';

const LevelGroupCard: React.FC<{ group: LibraryGroup, onClick: () => void }> = ({ group, onClick }) => (
    <div
        onClick={onClick}
        className="border border-tile-border rounded-xl p-5 text-lg font-sans-ar font-bold cursor-pointer text-center flex-grow basis-48 max-w-xs bg-tile-bg transition-all duration-200 transform hover:-translate-y-1.5 hover:border-highlight"
    >
        {group.groupName}
    </div>
);

const LevelGroupScreen = () => {
    const { navigateTo, setCurrentGroup, setCurrentSubgroup } = useAppContext();
    const [levelGroups, setLevelGroups] = useState<LibraryGroup[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIndex = async () => {
            try {
                const module = await import(/* @vite-ignore */ LIBRARY_INDEX_URL);
                
                // ✅ السطر التالي تمت إضافته لفحص البيانات
                console.log("البيانات التي تم جلبها من الرابط:", module);
                
                setLevelGroups(module.LIBRARY_INDEX);
            } catch (error) {
                console.error("Failed to load library index:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchIndex();
    }, []);

    const handleGroupSelect = (group: LibraryGroup) => {
        setCurrentGroup(group);
        setCurrentSubgroup(null);
        navigateTo(Screen.LEVEL_SUBGROUP, Screen.LEVEL_GROUP);
    };

    return (
        <ScreenContainer>
            <BackButton onClick={() => navigateTo(Screen.START)} />
            <h2 className="text-3xl font-bold text-highlight mb-8">اختر مجموعة المستويات</h2>
            {loading ? (
                <p>جار التحميل...</p>
            ) : (
                <div className="flex gap-4 flex-wrap justify-center p-2 w-full">
                    {levelGroups && levelGroups.map(group => (
                        <LevelGroupCard key={group.groupName} group={group} onClick={() => handleGroupSelect(group)} />
                    ))}
                </div>
            )}
        </ScreenContainer>
    );
};

export default LevelGroupScreen;
