
import React, { ReactNode } from 'react';

interface ScreenContainerProps {
    children: ReactNode;
    className?: string;
    isScrollable?: boolean;
}

const ScreenContainer: React.FC<ScreenContainerProps> = ({ children, className = '', isScrollable = false }) => {
    const scrollableClass = isScrollable ? 'justify-start h-[75vh] overflow-y-auto' : 'justify-center';
    
    return (
        <div className={`w-full flex flex-col items-center bg-primary border border-tile-border rounded-2xl shadow-2xl p-6 sm:p-10 box-border relative ${scrollableClass} ${className}`}>
            {children}
        </div>
    );
};

export default ScreenContainer;
