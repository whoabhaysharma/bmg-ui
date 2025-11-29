/**
 * PWA Utilities for Progressive Web App functionality
 */

export interface InstallPrompt extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferredPrompt: InstallPrompt | null = null;
let installPromptListener: ((prompt: InstallPrompt) => void) | null = null;

/**
 * Initialize PWA installation prompt listener
 */
export function initPWAPrompt(): void {
  if (typeof window === 'undefined') return;

  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    deferredPrompt = e as InstallPrompt;
    
    if (installPromptListener) {
      installPromptListener(deferredPrompt);
    }
  });

  window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    deferredPrompt = null;
  });
}

/**
 * Set listener for install prompt
 */
export function onInstallPrompt(callback: (prompt: InstallPrompt) => void): void {
  installPromptListener = callback;
}

/**
 * Trigger the install prompt
 */
export async function triggerInstallPrompt(): Promise<boolean> {
  if (!deferredPrompt) {
    return false;
  }

  try {
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      deferredPrompt = null;
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error triggering install prompt:', error);
    return false;
  }
}

/**
 * Check if PWA is already installed
 */
export function isPWAInstalled(): boolean {
  if (typeof window === 'undefined') return false;

  // Check if running as standalone (iOS)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((window.navigator as any).standalone === true) {
    return true;
  }

  // Check if running as standalone (Android/Desktop)
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }

  return false;
}

/**
 * Check if PWA can be installed
 */
export function canInstallPWA(): boolean {
  if (typeof window === 'undefined') return false;
  return deferredPrompt !== null;
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  return false;
}

/**
 * Send a notification
 */
export async function sendNotification(
  title: string,
  options?: NotificationOptions
): Promise<Notification | null> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return null;
  }

  if (Notification.permission !== 'granted') {
    const granted = await requestNotificationPermission();
    if (!granted) return null;
  }

  try {
    return new Notification(title, options);
  } catch (error) {
    console.error('Error sending notification:', error);
    return null;
  }
}

/**
 * Check if device is online
 */
export function isOnline(): boolean {
  if (typeof window === 'undefined') return true;
  return navigator.onLine;
}

/**
 * Register online/offline listeners
 */
export function onOnlineStatusChange(
  onOnline: () => void,
  onOffline: () => void
): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);

  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
}

/**
 * Check if service worker is supported
 */
export function isServiceWorkerSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'serviceWorker' in navigator;
}

/**
 * Register service worker
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!isServiceWorkerSupported()) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker registered:', registration);
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
}

/**
 * Unregister service worker
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (!isServiceWorkerSupported()) {
    return false;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
    }
    return true;
  } catch (error) {
    console.error('Error unregistering service workers:', error);
    return false;
  }
}
