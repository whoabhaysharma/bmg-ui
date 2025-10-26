'use client';

import React from 'react';
import clsx from 'clsx';

export const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => {
  return (
    <div className={clsx('mono-card p-5', className)}>
      {children}
    </div>
  );
};

export default Card;
