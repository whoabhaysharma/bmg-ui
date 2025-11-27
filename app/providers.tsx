'use client';

import React, { useEffect } from 'react';
import { AuthGuard } from '@/components/auth/auth-guard';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((error) => {
        console.log('ServiceWorker registration failed: ', error);
      });
    }
  }, []);

  return (
    <AuthGuard>
      {children}
    </AuthGuard>
  );
}