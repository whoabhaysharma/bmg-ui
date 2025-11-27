'use client';

import React, { useState, useEffect } from 'react';
import { Home, Dumbbell, Activity, User, Bell } from 'lucide-react';

// SHADCN Drawer import
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";

// MOCKS
const usePathname = () => '/owner/dashboard';
const useRouter = () => ({ push: (path: string) => console.log(`Navigating to ${path}`) });

// --- 1. Modern Header Component with SHADCN DRAWER ---
export function OwnerHeader() {
  const user = { name: 'Arjun Verma', avatar: 'AV' };
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const notifications = [
    { id: 1, title: "New Member Signup", desc: "Rahul K. purchased Gold Plan", time: "2m ago", unread: true },
    { id: 2, title: "Payment Received", desc: "Received ₹12,000 from Gym A", time: "1h ago", unread: false },
    { id: 3, title: "Maintenance Alert", desc: "Treadmill #4 requires service", time: "3h ago", unread: false },
    { id: 4, title: "Class Cancelled", desc: "Yoga session at 6PM cancelled", time: "5h ago", unread: true },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ease-in-out px-6 py-4
        ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-sm pt-4' : 'bg-transparent pt-6'}
      `}
    >
      <div className="flex items-center justify-between max-w-md mx-auto w-full relative">
        
        {/* Profile */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer">
            <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-zinc-200 ring-2 ring-white">
              {user.avatar}
            </div>
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">Good Morning</p>
            <h1 className="text-lg font-bold text-zinc-800 leading-tight tracking-tight">{user.name}</h1>
          </div>
        </div>

        {/* ---- Drawer Trigger ---- */}
        <div className="flex items-center gap-2 relative">
          <Drawer>
            <DrawerTrigger asChild>
              <button className="p-2.5 rounded-full bg-white text-zinc-600 shadow-sm border border-zinc-100 hover:bg-zinc-50 transition-transform active:scale-95 relative outline-none focus:ring-2 focus:ring-zinc-200">
                <Bell className="w-5 h-5" strokeWidth={2} />
                <span className="absolute top-2.5 right-3 h-2 w-2 rounded-full bg-rose-500 border border-white animate-pulse"></span>
              </button>
            </DrawerTrigger>

            {/* ---- Drawer Content ---- */}
            <DrawerContent className="max-w-md mx-auto rounded-t-[32px] p-0 overflow-hidden">

              <div className="p-6 bg-zinc-50/50">
                <DrawerHeader>
                  <DrawerTitle>Notifications</DrawerTitle>
                  <DrawerDescription>You have 3 unread messages today.</DrawerDescription>
                </DrawerHeader>
              </div>

              <div className="px-4 pb-4 max-h-[50vh] overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 mb-2 rounded-2xl border border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50 transition-all cursor-pointer group flex gap-4 items-start ${
                      notif.unread ? 'bg-blue-50/50 border-blue-100' : 'bg-white'
                    }`}
                  >
                    <div className={`mt-1.5 h-2.5 w-2.5 rounded-full flex-shrink-0 shadow-sm ${
                      notif.unread ? 'bg-blue-500 shadow-blue-200' : 'bg-zinc-200'
                    }`} />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`text-sm ${
                          notif.unread ? 'font-bold text-zinc-900' : 'font-semibold text-zinc-700'
                        }`}>
                          {notif.title}
                        </h4>
                        <span className="text-[10px] font-medium text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">
                          {notif.time}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 leading-relaxed">{notif.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <DrawerFooter>
                <button className="w-full bg-zinc-900 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-zinc-200 hover:bg-zinc-800 transition-colors">
                  Mark all as read
                </button>

                <DrawerClose asChild>
                  <button className="w-full bg-white text-zinc-500 border border-zinc-200 py-3.5 rounded-xl font-semibold text-sm hover:bg-zinc-50 transition-colors">
                    Close
                  </button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
}


// --- 2. Modern Floating Footer Component ---
export function OwnerFooter() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('/owner/dashboard');

  const navItems = [
    { icon: Home, label: 'Home', path: '/owner/dashboard' },
    { icon: Dumbbell, label: 'Gyms', path: '/owner/gyms' },
    { icon: Activity, label: 'Activity', path: '/owner/activity' },
    { icon: User, label: 'Profile', path: '/owner/profile' },
  ];

  return (
    <div className="fixed bottom-3 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <nav className="pointer-events-auto bg-white/90 backdrop-blur-2xl border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl px-2 py-2 flex items-center justify-between gap-1 w-[90%] max-w-[360px]">
        {navItems.map((item) => {
          const isActive = activeTab === item.path;
          return (
            <button
              key={item.label}
              onClick={() => {
                setActiveTab(item.path);
                router.push(item.path);
              }}
              className={`relative flex flex-col items-center justify-center h-14 w-14 rounded-xl transition-all duration-300 ${
                isActive ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'
              }`}
            >
              {isActive && (
                <span className="absolute inset-0 bg-zinc-100 rounded-xl -z-10 scale-100 transition-transform duration-300" />
              )}
              
              <item.icon
                className={`w-6 h-6 transition-all duration-300 ${
                  isActive ? 'stroke-[2.5px] scale-110' : 'stroke-2 scale-100'
                }`}
              />
            </button>
          );
        })}
      </nav>
    </div>
  );
}


// --- 4. Main Layout Wrapper ---
export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-zinc-900 font-sans selection:bg-zinc-200">
      <OwnerHeader />
      <main className="flex-1 w-full max-w-md mx-auto relative z-10">
        {children}
      </main>
      <OwnerFooter />
    </div>
  );
}
