import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "font-mono font-bold border-2 border-ph-black transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none";
  
  const variants = {
    primary: "bg-ph-orange text-ph-black shadow-retro hover:bg-[#FFB033]",
    secondary: "bg-white text-ph-black shadow-retro hover:bg-gray-50",
    danger: "bg-ph-red text-white shadow-retro hover:bg-red-600",
  };

  const sizes = {
    sm: "px-2 py-1 text-xs shadow-retro-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base shadow-retro-lg",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};