'use client';

import React from 'react';
import clsx from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'outline';
  leading?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'default', className, children, leading, ...props }) => {
  const base = 'inline-flex items-center justify-center rounded-2xl font-semibold transition-transform disabled:opacity-50 h-12';
  const variants: Record<string,string> = {
    default: 'bg-black text-white px-5 shadow-sm hover:scale-[1.03] disabled:opacity-40',
    ghost: 'bg-transparent text-black px-4',
    outline: 'bg-white border border-[var(--border)] text-black px-4'
  };

  return (
    <button className={clsx(base, variants[variant], className)} {...props}>
      {leading && <span className="mr-3">{leading}</span>}
      <span>{children}</span>
    </button>
  );
};

export default Button;
