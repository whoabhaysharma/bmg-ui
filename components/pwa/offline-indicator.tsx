'use client';

import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { onOnlineStatusChange } from '@/lib/pwa';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    // Check initial status
    setIsOnline(navigator.onLine);

    // Listen for online/offline changes
    const unsubscribe = onOnlineStatusChange(
      () => {
        setIsOnline(true);
        setShowIndicator(false);
      },
      () => {
        setIsOnline(false);
        setShowIndicator(true);
      }
    );

    return unsubscribe;
  }, []);

  if (!showIndicator || isOnline) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-500 text-white px-4 py-3 flex items-center gap-2 shadow-lg z-50 animate-in fade-in slide-in-from-top-2">
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      <p className="text-sm font-medium">You're offline. Some features may be unavailable.</p>
    </div>
  );
}
