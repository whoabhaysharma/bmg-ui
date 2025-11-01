import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'OWNER';
  mobileNumber: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  isAdmin: () => boolean;
  isUser: () => boolean;
  getDashboardPath: () => string;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      logout: () => set({ user: null, token: null, error: null }),
      isAdmin: () => get().user?.role === 'OWNER',
      isUser: () => get().user?.role === 'USER',
      getDashboardPath: () => {
        const user = get().user;
        if (!user) return '/auth/login';
        return user.role === 'OWNER' ? '/admin/dashboard' : '/user/dashboard';
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);