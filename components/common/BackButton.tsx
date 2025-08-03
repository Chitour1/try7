
import React from 'react';

interface BackButtonProps {
    onClick: () => void;
    className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick, className = '' }) => {
    return (
        <button
            onClick={onClick}
            className={`absolute top-5 left-5 bg-tile-bg border border-tile-border text-highlight w-10 h-10 rounded-full text-2xl cursor-pointer flex justify-center items-center z-20 hover:bg-bg-dark transition-colors ${className}`}
            aria-label="Go back"
        >
            →
        </button>
    );
};

export default BackButton;
