'use client';

import { useEffect, useState } from 'react';
import { Bell, User, QrCode, MapPin, Calendar, ArrowRight, Loader2, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose
} from "@/components/ui/drawer";
import { usersAPI, subscriptionsAPI, attendanceAPI } from '@/lib/api/client';
import { formatDistanceToNow, format } from 'date-fns';
import { useRouter } from 'next/navigation';

// --- Types ---
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

interface Subscription {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  accessCode?: string;
  plan: {
    name: string;
    price: number;
  };
  gym: {
    id: string;
    name: string;
    address?: string;
  };
}

interface AttendanceLog {
  id: string;
  checkIn: string;
  checkOut?: string;
  gym: {
    name: string;
  };
}

// --- Components ---

function UserHeader({ user }: { user: UserProfile | null }) {
  return (
    <header className="bg-transparent pt-6 py-4 px-4">
      <div className="flex items-center justify-between max-w-md mx-auto w-full relative">
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer">
            <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-indigo-200 ring-2 ring-white">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">Welcome Back</p>
            <h1 className="text-lg font-bold text-zinc-800 leading-tight tracking-tight">{user?.name || 'User'}</h1>
          </div>
        </div>
        <button className="p-2.5 rounded-full bg-white text-zinc-600 shadow-sm border border-zinc-100 hover:bg-zinc-50 transition-transform active:scale-95 relative">
          <Bell className="w-5 h-5" strokeWidth={2} />
        </button>
      </div>
    </header>
  );
}

function SubscriptionCard({ sub }: { sub: Subscription }) {
  return (
    <div className="bg-zinc-900 text-white p-6 rounded-[2rem] shadow-xl shadow-zinc-200 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="font-bold text-lg">{sub.gym.name}</h3>
            <p className="text-zinc-400 text-sm flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {sub.gym.address || 'Location'}
            </p>
          </div>
          <Badge className="bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-md">
            {sub.plan.name}
          </Badge>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex items-center justify-between border border-white/5">
          <div>
            <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold mb-1">Access Code</p>
            <p className="text-2xl font-mono font-bold tracking-widest">{sub.accessCode || '----'}</p>
          </div>
          <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center">
            <QrCode className="w-6 h-6 text-zinc-900" />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-zinc-400 font-medium">
          <Calendar className="w-3.5 h-3.5" />
          <span>Expires {format(new Date(sub.endDate), 'MMM dd, yyyy')}</span>
        </div>
      </div>
    </div>
  );
}

function RecentActivityItem({ log }: { log: AttendanceLog }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-zinc-50 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
          <User className="w-5 h-5" />
        </div>
        <div>
          <p className="font-bold text-zinc-800 text-sm">Checked In</p>
          <p className="text-zinc-400 text-xs">{log.gym.name}</p>
        </div>
      </div>
      <span className="text-xs font-medium text-zinc-400">
        {formatDistanceToNow(new Date(log.checkIn), { addSuffix: true })}
      </span>
    </div>
  );
}

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeSub, setActiveSub] = useState<Subscription | null>(null);
  const [recentLogs, setRecentLogs] = useState<AttendanceLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Profile
        const userRes = await usersAPI.getMe();
        setUser(userRes.data.data || userRes.data);

        // 2. Fetch Active Subscriptions
        const subsRes = await subscriptionsAPI.getMySubscriptions();
        const subs = subsRes.data.data || subsRes.data;
        // Find first active subscription for the card
        const active = subs.find((s: Subscription) => s.status === 'ACTIVE');
        setActiveSub(active || null);

        // 3. Fetch Recent Attendance
        const attendanceRes = await attendanceAPI.getMe();
        const logs = attendanceRes.data.data || attendanceRes.data;
        setRecentLogs(logs.slice(0, 5)); // Take top 5

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-300" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <UserHeader user={user} />

      {/* Active Subscription Card */}
      <div className="px-4">
        {activeSub ? (
          <SubscriptionCard sub={activeSub} />
        ) : (
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-[2rem] shadow-xl shadow-indigo-200 text-center py-10">
            <h3 className="text-xl font-bold mb-2">No Active Membership</h3>
            <p className="text-indigo-100 text-sm mb-6">Start your fitness journey today!</p>
            <Button
              onClick={() => router.push('/user/explore')}
              className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold rounded-xl px-8"
            >
              Explore Gyms
            </Button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="px-4 grid grid-cols-2 gap-3">
        <button
          onClick={() => router.push('/user/explore')}
          className="bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm flex flex-col items-center justify-center gap-2 hover:bg-zinc-50 transition"
        >
          <div className="h-10 w-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <span className="text-sm font-bold text-zinc-700">Find Gyms</span>
        </button>
        <button className="bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm flex flex-col items-center justify-center gap-2 hover:bg-zinc-50 transition">
          <div className="h-10 w-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <span className="text-sm font-bold text-zinc-700">My Stats</span>
        </button>
      </div>

      {/* Recent Activity */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-zinc-800 text-lg">Recent Activity</h3>
          <button className="text-xs font-bold text-indigo-600 flex items-center gap-1">
            View All <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-3">
          {recentLogs.length > 0 ? (
            recentLogs.map((log) => (
              <RecentActivityItem key={log.id} log={log} />
            ))
          ) : (
            <div className="text-center py-8 bg-white rounded-2xl border border-zinc-100">
              <p className="text-zinc-400 text-sm">No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}