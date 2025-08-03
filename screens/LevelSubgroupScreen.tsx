
import React, { useEffect, useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Screen, LibraryGroup, LessonLibrary } from '../types';
import ScreenContainer from '../components/common/ScreenContainer';
import BackButton from '../components/common/BackButton';

const LevelSubgroupCard: React.FC<{ group: LibraryGroup, onClick: () => void }> = ({ group, onClick }) => (
    <div
        onClick={onClick}
        className="border border-tile-border rounded-xl p-5 text-lg font-sans-ar font-bold cursor-pointer text-center flex-grow basis-48 max-w-xs bg-tile-bg transition-all duration-200 transform hover:-translate-y-1.5 hover:border-highlight"
    >
        {group.groupName}
    </div>
);

const LevelSubgroupScreen = () => {
    const { navigateTo, currentGroup, setCurrentSubgroup } = useApp();
    const [subgroups, setSubgroups] = useState<LibraryGroup[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubgroups = async () => {
            if (!currentGroup) {
                navigateTo(Screen.LEVEL_GROUP);
                return;
            }
            setLoading(true);
            try {
                const module = await import(currentGroup.filePath);
                const exportedKey = Object.keys(module)[0];
                const content = module[exportedKey];
                
                if (exportedKey.includes('SUB_GROUPS')) {
                    setSubgroups(content);
                } else {
                    // This is not a subgroup index, it's the actual lesson library.
                    // So we treat the current group as a "subgroup" and navigate to levels.
                    setCurrentSubgroup(currentGroup);
                    navigateTo(Screen.LEVEL_SELECTION, Screen.LEVEL_SUBGROUP);
                }

            } catch (error) {
                console.error("Failed to load subgroup content:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSubgroups();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentGroup]);

    const handleSubgroupSelect = (subgroup: LibraryGroup) => {
        setCurrentSubgroup(subgroup);
        navigateTo(Screen.LEVEL_SELECTION, Screen.LEVEL_SUBGROUP);
    };

    return (
        <ScreenContainer>
            <BackButton onClick={() => navigateTo(Screen.LEVEL_GROUP)} />
            <h2 className="text-3xl font-bold text-highlight mb-2">{currentGroup?.groupName}</h2>
            <h3 className="text-xl text-text-muted mb-8">اختر مجموعة فرعية</h3>
            {loading ? (
                <p>جار التحميل...</p>
            ) : (
                <div className="flex gap-4 flex-wrap justify-center p-2 w-full">
                    {subgroups.map(group => (
                        <LevelSubgroupCard key={group.groupName} group={group} onClick={() => handleSubgroupSelect(group)} />
                    ))}
                </div>
            )}
        </ScreenContainer>
    );
};

export default LevelSubgroupScreen;
