'use client'

import { Activity, Bell, User } from "lucide-react"
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
import { useEffect, useState } from "react";
import { useOwnerStore } from "@/lib/store/ownerStore";


// ---------------------------------------
// Types
// ---------------------------------------
interface StatsCardProps {
    label: string
    value: string
    change?: string
    positive?: boolean
}

interface RecentItemProps {
    title: string
    time: string
    amount?: string
}


export function OwnerHeader() {
    const { currentGym } = useOwnerStore();
    const user = { name: currentGym?.ownerName || 'Gym Owner', avatar: 'GO' };

    // Removed the 'scrolled' state and 'useEffect' hook for scroll handling.
    // const [scrolled, setScrolled] = useState(false);
    // useEffect(() => {
    //     const handleScroll = () => setScrolled(window.scrollY > 10);
    //     window.addEventListener('scroll', handleScroll);
    //     return () => window.removeEventListener('scroll', handleScroll);
    // }, []);

    const notifications = [
        { id: 1, title: "New Member Signup", desc: "Rahul K. purchased Gold Plan", time: "2m ago", unread: true },
        { id: 2, title: "Payment Received", desc: "Received ₹12,000 from Gym A", time: "1h ago", unread: false },
        { id: 3, title: "Maintenance Alert", desc: "Treadmill #4 requires service", time: "3h ago", unread: false },
        { id: 4, title: "Class Cancelled", desc: "Yoga session at 6PM cancelled", time: "5h ago", unread: true },
    ];

    return (
        <header
            // Removed 'sticky top-0 z-40', 'transition-all duration-300 ease-in-out', 
            // and the dynamic class template literal for 'scrolled'.
            // Set a fixed, non-scrolling background and padding.
            className={'bg-transparent pt-6 py-4'}
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

                        {/* ---- Drawer Content (Rest of the drawer content remains the same) ---- */}
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
                                        className={`p-4 mb-2 rounded-2xl border border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50 transition-all cursor-pointer group flex gap-4 items-start ${notif.unread ? 'bg-blue-50/50 border-blue-100' : 'bg-white'
                                            }`}
                                    >
                                        <div className={`mt-1.5 h-2.5 w-2.5 rounded-full flex-shrink-0 shadow-sm ${notif.unread ? 'bg-blue-500 shadow-blue-200' : 'bg-zinc-200'
                                            }`} />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className={`text-sm ${notif.unread ? 'font-bold text-zinc-900' : 'font-semibold text-zinc-700'
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


// ---------------------------------------
// Stats Card
// ---------------------------------------
function StatsCard({ label, value, change, positive }: StatsCardProps) {
    return (
        <div className="bg-white p-5 rounded-3xl shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-zinc-100">
            <p className="text-zinc-400 text-xs font-medium mb-1">{label}</p>
            <h3 className="text-2xl font-bold text-zinc-800">{value}</h3>

            {change && (
                <p
                    className={`text-xs font-bold mt-2 flex items-center gap-1 ${positive ? "text-green-500" : "text-red-500"
                        }`}
                >
                    {positive ? "↑" : "↓"} {change}
                    <span className="text-zinc-300 font-normal">vs last week</span>
                </p>
            )}
        </div>
    )
}

// ---------------------------------------
// Quick Actions Section
// ---------------------------------------
function QuickActions() {
    return (
        <div className="bg-zinc-900 text-white p-6 rounded-[2rem] shadow-xl shadow-zinc-200">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-lg">Manage Gym</h3>
                    <p className="text-zinc-400 text-sm">Quick access tools</p>
                </div>
                <div className="p-2 bg-zinc-800 rounded-full">
                    <Activity className="w-5 h-5 text-white" />
                </div>
            </div>

            <div className="flex gap-3 mt-4">
                <button className="flex-1 bg-zinc-800 py-3 rounded-xl text-sm font-medium hover:bg-zinc-700 transition">
                    Add Member
                </button>
                <button className="flex-1 bg-white text-zinc-900 py-3 rounded-xl text-sm font-bold hover:bg-zinc-100 transition">
                    Check-in
                </button>
            </div>
        </div>
    )
}

// ---------------------------------------
// Recent Item
// ---------------------------------------
function RecentItem({ title, time, amount }: RecentItemProps) {
    return (
        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-zinc-50 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                    <p className="font-bold text-zinc-800 text-sm">{title}</p>
                    <p className="text-zinc-400 text-xs">{time}</p>
                </div>
            </div>
            {amount && <span className="text-sm font-bold text-zinc-800">{amount}</span>}
        </div>
    )
}

// ---------------------------------------
// Recent Activity List
// ---------------------------------------
function RecentActivityList() {
    const items: RecentItemProps[] = [
        { title: "New Signup", time: "2 mins ago", amount: "+ ₹2,500" },
        { title: "Membership Renewed", time: "10 mins ago", amount: "+ ₹1,200" },
        { title: "Product Sold", time: "30 mins ago", amount: "+ ₹450" },
        { title: "New Signup", time: "45 mins ago", amount: "+ ₹2,500" },
        { title: "Check-in", time: "1 hr ago" }
    ]

    return (
        <div>
            <h3 className="font-bold text-zinc-800 text-lg mb-4">Recent Activity</h3>
            <div className="space-y-3 pb-32">
                {items.map((item, idx) => (
                    <RecentItem key={idx} {...item} />
                ))}
            </div>
        </div>
    )
}

// ---------------------------------------
// Main Component
// ---------------------------------------
export default function DashboardContent() {
    return (
        <div className="space-y-6 px-4">
            <OwnerHeader />

            <div className="grid grid-cols-2 gap-4">
                <StatsCard
                    label="Total Revenue"
                    value="₹42.5k"
                    change="12%"
                    positive
                />
                <StatsCard
                    label="Active Members"
                    value="148"
                />
            </div>

            <QuickActions />

            <RecentActivityList />
        </div>
    )
}
