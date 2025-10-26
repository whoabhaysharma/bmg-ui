# FitGym UI - Mobile-First PWA

A modern, mobile-first Progressive Web App for booking gym sessions using Next.js, Firebase Authentication, and Tailwind CSS.

## Features

✨ **Mobile-First Design** - Optimized for mobile devices  
🔐 **Firebase Google Auth** - Secure authentication  
💾 **PWA Support** - Works offline, installable  
🎨 **Modern UI** - Responsive, accessible components  
📱 **Touch-Friendly** - Large buttons and easy navigation  
🚀 **Fast** - Built with Next.js 15 & Turbopack  

## Project Structure

```
gym-ui/
├── app/
│   ├── auth/
│   │   └── login/           # Login page
│   ├── dashboard/           # Main dashboard
│   ├── layout.tsx           # Root layout with PWA setup
│   ├── page.tsx            # Home page (redirects)
│   └── providers.tsx       # Client-side providers
├── lib/
│   ├── api/
│   │   └── client.ts       # API client with interceptors
│   ├── firebase/
│   │   └── config.ts       # Firebase initialization
│   └── store/
│       └── authStore.ts    # Zustand auth store
├── public/
│   ├── manifest.json       # PWA manifest
│   └── sw.js              # Service worker
└── package.json
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd gym-ui
npm install
```

### 2. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Go to Project Settings → Your apps → Web
4. Copy your Firebase config
5. Create `.env.local` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

### 3. Enable Google Sign-In in Firebase

1. Go to Firebase Console → Authentication → Sign-in Method
2. Enable Google provider
3. Add your domain to authorized domains

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Pages

### Login Page (`/auth/login`)
- Google authentication
- Beautiful gradient UI
- Mobile-optimized
- Error handling

### Dashboard (`/dashboard`)
- User profile display
- Quick actions
- Logout functionality
- Protected route

## Authentication Flow

1. User clicks "Continue with Google"
2. Firebase OAuth dialog opens
3. User signs in with Google account
4. Frontend receives Firebase ID token
5. Token sent to backend `/api/auth/google`
6. Backend verifies token and returns JWT
7. User logged in with JWT token
8. Redirected to dashboard

## PWA Features

✅ **Installable** - Add to home screen on mobile  
✅ **Offline Support** - Service worker caches pages  
✅ **App-like** - Standalone display mode  
✅ **Fast** - Optimized assets and caching  
✅ **Web Push Ready** - Infrastructure for notifications  

### Install PWA

**iOS:**
1. Open in Safari
2. Tap Share → Add to Home Screen

**Android:**
1. Open in Chrome
2. Tap Menu → Install app

**Desktop:**
1. Click Install button in address bar

## Zustand Auth Store

```typescript
import { useAuthStore } from '@/lib/store/authStore';

const { user, token, setUser, setToken, logout } = useAuthStore();
```

## API Client

The API client automatically:
- Adds JWT token to all requests
- Handles 401 errors (redirects to login)
- Uses base URL from `.env.local`

```typescript
import { authAPI } from '@/lib/api/client';

// Login with Firebase token
const response = await authAPI.loginWithGoogle(firebaseToken);

// Update profile
await authAPI.updateProfile(userId, { mobileNumber: '+91...' });
```

## Styling

- **Framework**: Tailwind CSS v4
- **Icons**: Lucide React
- **Responsive**: Mobile-first approach
- **Gradients**: Purple to Blue theme

## Build & Deploy

### Build

```bash
npm run build
```

### Production Start

```bash
npm start
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API Key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Project ID |
| `NEXT_PUBLIC_API_BASE_URL` | Backend API URL |

## Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 13+
- Mobile browsers (iOS Safari 13+, Chrome Android)

## Troubleshooting

### Firebase Auth Not Working
- Check Firebase config in `.env.local`
- Ensure Google provider is enabled in Firebase Console
- Verify domain is authorized

### PWA Not Installable
- Must be served over HTTPS (except localhost)
- Check browser console for service worker errors
- Verify `manifest.json` is valid

### API Calls Failing
- Ensure backend is running on `NEXT_PUBLIC_API_BASE_URL`
- Check CORS configuration on backend
- Verify JWT token is valid

## Performance Metrics

- **FCP**: < 1.5s
- **LCP**: < 2.5s
- **CLS**: < 0.1
- **TTI**: < 2.5s

## License

MIT