
import React, { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseClasses = "px-9 py-3.5 rounded-full text-lg font-sans-ar font-bold cursor-pointer transition-all duration-200 transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none";
    
    const variantClasses = {
        primary: "bg-gradient-to-br from-accent to-highlight text-white shadow-lg shadow-highlight/20 hover:shadow-xl hover:shadow-highlight/30 disabled:bg-tile-border",
        secondary: "bg-tile-bg border border-highlight text-highlight hover:bg-primary disabled:bg-tile-border disabled:border-tile-border disabled:text-text-muted"
    };

    return (
        <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};

export default Button;
