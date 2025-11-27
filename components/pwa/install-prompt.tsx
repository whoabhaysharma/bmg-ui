'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import {
  canInstallPWA,
  initPWAPrompt,
  isPWAInstalled,
  onInstallPrompt,
  triggerInstallPrompt,
  type InstallPrompt,
} from '@/lib/pwa';

export function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<InstallPrompt | null>(null);

  useEffect(() => {
    // Initialize PWA prompt
    initPWAPrompt();
    setIsInstalled(isPWAInstalled());

    // Listen for install prompt
    onInstallPrompt((prompt) => {
      setDeferredPrompt(prompt);
      setShowPrompt(true);
    });

    // Check if can install
    if (canInstallPWA()) {
      setShowPrompt(true);
    }
  }, []);

  const handleInstall = async () => {
    if (await triggerInstallPrompt()) {
      setShowPrompt(false);
      setIsInstalled(true);
    }
  };

  // Don't show if already installed
  if (isInstalled || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 bg-primary text-primary-foreground rounded-lg shadow-lg p-4 animate-in fade-in slide-in-from-bottom-4 z-40">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <Download className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-sm">Install FitGym</h3>
            <p className="text-xs opacity-90 mt-1">
              Get instant access to your gym bookings on your home screen
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowPrompt(false)}
          className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="mt-3 flex gap-2">
        <Button
          onClick={handleInstall}
          size="sm"
          className="flex-1 bg-white text-primary hover:bg-gray-100"
        >
          Install
        </Button>
        <Button
          onClick={() => setShowPrompt(false)}
          size="sm"
          variant="outline"
          className="flex-1 border-white/30 hover:bg-white/10"
        >
          Maybe Later
        </Button>
      </div>
    </div>
  );
}
