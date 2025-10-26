'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { LogOut, User as UserIcon, Calendar as CalendarIcon, Star } from 'lucide-react';
import Button from '@/components/button';
import Card from '@/components/card';

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, logout } = useAuthStore();

  useEffect(() => {
    if (!user || !token) {
      router.push('/auth/login');
    }
  }, [user, token, router]);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 bg-white border-b border-[var(--border)]">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg border border-[var(--border)] flex items-center justify-center">
              <div className="font-bold">FG</div>
            </div>
            <h1 className="text-lg font-semibold">FitGym</h1>
          </div>
          <Button onClick={handleLogout} variant="ghost" className="p-2">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        <Card className="p-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl border border-[var(--border)] flex items-center justify-center">
              <UserIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-lg font-semibold">{user.name}</div>
              <div className="text-xs text-[var(--muted)]">{user.email}</div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 text-center">
            <CalendarIcon className="mx-auto mb-2" />
            <div className="font-medium">Find Gyms</div>
            <div className="text-xs text-[var(--muted)]">Search nearby gyms</div>
          </Card>

          <Card className="p-4 text-center">
            <Star className="mx-auto mb-2" />
            <div className="font-medium">My Bookings</div>
            <div className="text-xs text-[var(--muted)]">View your sessions</div>
          </Card>

          <Card className="p-4 text-center">
            <div className="mx-auto mb-2 text-2xl">🏷️</div>
            <div className="font-medium">Favorites</div>
            <div className="text-xs text-[var(--muted)]">Saved gyms</div>
          </Card>

          <Card className="p-4 text-center">
            <div className="mx-auto mb-2 text-2xl">👤</div>
            <div className="font-medium">Profile</div>
            <div className="text-xs text-[var(--muted)]">Edit details</div>
          </Card>
        </div>

        <div className="mt-4">
          <Card className="p-4">
            <div className="text-sm text-[var(--muted)]">Coming soon: more features tailored for trainers and gyms.</div>
          </Card>
        </div>
      </main>
    </div>
  );
}