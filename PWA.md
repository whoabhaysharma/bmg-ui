# Progressive Web App (PWA) Setup

This Gym Manager UI is configured as a Progressive Web App (PWA), providing an app-like experience with offline functionality, installability, and enhanced performance.

## Features Enabled

### 1. **Service Worker** (`public/sw.js`)
- Intelligent caching with network-first strategy
- Offline page support
- Automatic cache updates
- Works in production (disabled in development)

### 2. **App Installation**
- Users can install the app on their home screen
- Works on iOS (web clip) and Android (install to home screen)
- Auto-generated install prompt when conditions are met
- Customizable install prompt component

### 3. **Offline Support**
- Offline page at `/offline` with auto-reload on reconnection
- Offline status indicator at the top of the page
- Network status detection and real-time updates

### 4. **Web App Manifest** (`public/manifest.json`)
- App name, description, and icons
- Theme and background colors
- Display mode (standalone)
- App shortcuts
- Screenshots for app stores

### 5. **PWA Utilities** (`lib/pwa.ts`)
- Install prompt management
- Notification permission handling
- Online/offline status detection
- Service worker registration/unregistration

## Installation & Usage

### For Users

The app will show an install prompt when accessed in a compatible browser:

1. **Mobile (Android)**
   - Open in Chrome/Firefox
   - Tap the install banner when it appears
   - Or use the browser menu → "Install app"

2. **Mobile (iOS)**
   - Open in Safari
   - Tap Share → "Add to Home Screen"
   - The app will be saved with the custom icon

3. **Desktop**
   - Open in Chrome/Edge
   - Address bar will show install icon
   - Click to install (runs in windowed mode)

### For Developers

#### Enable PWA in Development

To see PWA features during development, set the environment variable:

```bash
NODE_ENV=production npm run build
npm run start
```

#### Service Worker Management

```typescript
import {
  registerServiceWorker,
  unregisterServiceWorker,
  isServiceWorkerSupported,
} from '@/lib/pwa';

// Register
await registerServiceWorker();

// Unregister
await unregisterServiceWorker();

// Check support
if (isServiceWorkerSupported()) {
  // Register or manage SW
}
```

#### Notification Handling

```typescript
import {
  requestNotificationPermission,
  sendNotification,
} from '@/lib/pwa';

// Request permission
const granted = await requestNotificationPermission();

// Send notification
if (granted) {
  await sendNotification('Booking Confirmed', {
    body: 'Your gym session has been confirmed',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
  });
}
```

#### Install Prompt Customization

```typescript
import {
  initPWAPrompt,
  triggerInstallPrompt,
  canInstallPWA,
  isPWAInstalled,
} from '@/lib/pwa';

useEffect(() => {
  initPWAPrompt();
  
  if (isPWAInstalled()) {
    // User has installed the app
  }
  
  if (canInstallPWA()) {
    // Show custom install button
  }
}, []);
```

#### Online/Offline Detection

```typescript
import { onOnlineStatusChange, isOnline } from '@/lib/pwa';

useEffect(() => {
  const unsubscribe = onOnlineStatusChange(
    () => console.log('Online'),
    () => console.log('Offline')
  );

  if (isOnline()) {
    // Device is online
  }

  return unsubscribe;
}, []);
```

## Configuration

### Service Worker Configuration

Edit `public/sw.js` to customize:
- Cache name and version
- URLs to pre-cache
- Caching strategies
- Network timeout behavior

### App Manifest Configuration

Edit `public/manifest.json` to customize:
- App name and description
- Icon paths and sizes
- Theme colors
- App shortcuts
- Display mode

### PWA Configuration

Edit `next.config.ts` to customize:
- PWA destination folder
- Service worker scope
- Custom service worker path

## Testing PWA Features

### Test Installation
1. Open DevTools (F12)
2. Go to Application/Manifest tab
3. Check manifest validity
4. Trigger install prompt (if available)

### Test Service Worker
1. Open DevTools → Application → Service Workers
2. Check registration status
3. Test offline mode (check "offline" checkbox)
4. Verify cache storage

### Test Offline
1. DevTools → Network → Throttling → "Offline"
2. Navigate the app
3. Should show offline page or cached content

### Lighthouse PWA Audit
1. Open DevTools
2. Run Lighthouse audit
3. Check PWA category score
4. Review recommendations

## Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Service Worker | ✅ | ✅ | ✅ | ✅ |
| Install (Android) | ✅ | ✅ | ⚠️ | ✅ |
| Install (iOS) | ⚠️ | ⚠️ | ✅ | ⚠️ |
| Offline Support | ✅ | ✅ | ✅ | ✅ |
| Notifications | ✅ | ✅ | ⚠️ | ✅ |

✅ = Full support | ⚠️ = Partial support | ❌ = Not supported

## Best Practices

1. **Cache Strategy**: Currently using network-first. Consider cache-first for static assets.
2. **Update Strategy**: Use `skipWaiting` to force updates on new deployments.
3. **Offline Pages**: Keep offline pages simple and light.
4. **Notifications**: Ask for permission at the right time, not on load.
5. **App Icons**: Provide multiple sizes (192x192, 512x512 minimum).
6. **HTTPS**: PWA requires HTTPS in production (HTTP allowed for localhost).

## Troubleshooting

### App Not Installing
- Check manifest validity in DevTools
- Ensure HTTPS (if not localhost)
- Check that all icons are accessible
- Clear cache and service workers

### Service Worker Not Updating
- Check `sw.js` has changed
- Use `skipWaiting: true` to force update
- In DevTools, use "Skip waiting" button

### Notifications Not Working
- Check notification permission is granted
- Verify service worker is registered
- Test in non-private/incognito mode

### Offline Page Not Showing
- Ensure `/offline` route exists
- Check service worker cache
- Verify offline.html or offline route is cached

## Future Improvements

- [ ] Background sync for offline actions
- [ ] Push notifications from backend
- [ ] Image caching optimization
- [ ] Periodic sync for updates
- [ ] App update notifications
- [ ] Share target API integration
- [ ] Contact picker integration
