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
import { gymsAPI, attendanceAPI } from "@/lib/api/client";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNotificationStore } from "@/lib/store/notificationStore";
import { formatDistanceToNow } from "date-fns";


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
    const { notifications, unreadCount, fetchNotifications, markAllAsRead, markAsRead } = useNotificationStore();

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <header className={'bg-transparent pt-6 py-4'}>
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
                                {unreadCount > 0 && (
                                    <span className="absolute top-2.5 right-3 h-2 w-2 rounded-full bg-rose-500 border border-white animate-pulse"></span>
                                )}
                            </button>
                        </DrawerTrigger>

                        {/* ---- Drawer Content ---- */}
                        <DrawerContent className="max-w-md mx-auto rounded-t-[32px] p-0 overflow-hidden">

                            <div className="p-6 bg-zinc-50/50">
                                <DrawerHeader>
                                    <DrawerTitle>Notifications</DrawerTitle>
                                    <DrawerDescription>You have {unreadCount} unread messages.</DrawerDescription>
                                </DrawerHeader>
                            </div>

                            <div className="px-4 pb-4 max-h-[50vh] overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="text-center py-8 text-zinc-400 text-sm">
                                        No notifications yet.
                                    </div>
                                ) : (
                                    notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            onClick={() => markAsRead(notif.id)}
                                            className={`p-4 mb-2 rounded-2xl border border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50 transition-all cursor-pointer group flex gap-4 items-start ${!notif.isRead ? 'bg-blue-50/50 border-blue-100' : 'bg-white'
                                                }`}
                                        >
                                            <div className={`mt-1.5 h-2.5 w-2.5 rounded-full flex-shrink-0 shadow-sm ${!notif.isRead ? 'bg-blue-500 shadow-blue-200' : 'bg-zinc-200'
                                                }`} />
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className={`text-sm ${!notif.isRead ? 'font-bold text-zinc-900' : 'font-semibold text-zinc-700'
                                                        }`}>
                                                        {notif.title}
                                                    </h4>
                                                    <span className="text-[10px] font-medium text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">
                                                        {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-zinc-500 leading-relaxed">{notif.message}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <DrawerFooter>
                                <button
                                    onClick={() => markAllAsRead()}
                                    className="w-full bg-zinc-900 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-zinc-200 hover:bg-zinc-800 transition-colors"
                                >
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
function QuickActions({ onCheckInClick }: { onCheckInClick: () => void }) {
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
                <button
                    onClick={onCheckInClick}
                    className="flex-1 bg-white text-zinc-900 py-3 rounded-xl text-sm font-bold hover:bg-zinc-100 transition"
                >
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
function RecentActivityList({ items }: { items: RecentItemProps[] }) {
    if (items.length === 0) {
        return (
            <div>
                <h3 className="font-bold text-zinc-800 text-lg mb-4">Recent Activity</h3>
                <div className="p-8 text-center bg-white rounded-2xl border border-zinc-100">
                    <p className="text-zinc-400 text-sm">No recent activity</p>
                </div>
            </div>
        )
    }

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
// ---------------------------------------
// Main Component
// ---------------------------------------
export default function DashboardContent() {
    const { currentGym, isLoading: isGymLoading } = useOwnerStore();
    const [stats, setStats] = useState({
        totalRevenue: 0,
        activeMembers: 0,
        recentActivity: [] as RecentItemProps[]
    });
    const [loading, setLoading] = useState(true);

    // Check-in Verification State
    const [isCheckInDrawerOpen, setIsCheckInDrawerOpen] = useState(false);
    const [accessCode, setAccessCode] = useState('');
    const [checkInLoading, setCheckInLoading] = useState(false);
    const [checkInResult, setCheckInResult] = useState<{ success: boolean; message: string; user?: string } | null>(null);

    const handleVerifyCheckIn = async () => {
        if (!accessCode.trim() || !currentGym) return;

        setCheckInLoading(true);
        setCheckInResult(null);

        try {
            const res = await attendanceAPI.verifyCheckIn(currentGym.id, accessCode);
            const data = res.data.data || res.data;

            setCheckInResult({
                success: true,
                message: 'Check-in verified successfully!',
                user: data.user?.name || 'User'
            });
            setAccessCode(''); // Clear code on success

            // Refresh stats to show new activity
            // fetchStats(); // Ideally we should refactor fetchStats to be callable here, but for now let's skip or duplicate logic if needed. 
            // Actually, let's just leave it, the user can refresh. Or we can trigger a refresh if we move fetchStats out.
        } catch (error: any) {
            console.error("Check-in verification failed:", error);
            const errorMsg = error.response?.data?.error || 'Verification failed. Please try again.';
            setCheckInResult({
                success: false,
                message: errorMsg
            });
        } finally {
            setCheckInLoading(false);
        }
    };

    const resetCheckInState = (open: boolean) => {
        setIsCheckInDrawerOpen(open);
        if (!open) {
            setCheckInResult(null);
            setAccessCode('');
        }
    };

    useEffect(() => {
        const fetchStats = async () => {
            if (!currentGym) {
                if (!isGymLoading) setLoading(false);
                return;
            }

            try {
                const res = await gymsAPI.getStats(currentGym.id);
                const data = res.data.data || res.data;

                setStats({
                    totalRevenue: data.totalRevenue,
                    activeMembers: data.activeMembers,
                    recentActivity: data.recentActivity.map((act: any) => ({
                        title: act.title,
                        time: new Date(act.time).toLocaleDateString(), // Simple formatting
                        amount: act.amount ? `+ ₹${act.amount}` : undefined
                    }))
                });
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [currentGym, isGymLoading]);

    if (loading || isGymLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-300" />
            </div>
        )
    }

    return (
        <div className="space-y-6 px-4">
            <OwnerHeader />

            <div className="grid grid-cols-2 gap-4">
                <StatsCard
                    label="Total Revenue"
                    value={`₹${stats.totalRevenue.toLocaleString()}`}
                    change="12%" // TODO: Calculate change from backend
                    positive
                />
                <StatsCard
                    label="Active Members"
                    value={stats.activeMembers.toString()}
                />
            </div>

            <QuickActions onCheckInClick={() => setIsCheckInDrawerOpen(true)} />

            <RecentActivityList items={stats.recentActivity} />

            {/* Check-in Verification Drawer */}
            <Drawer open={isCheckInDrawerOpen} onOpenChange={resetCheckInState}>
                <DrawerContent className="max-w-md mx-auto rounded-t-[32px]">
                    <div className="p-6 bg-zinc-50/50 border-b border-zinc-100">
                        <DrawerHeader className="p-0 text-left">
                            <DrawerTitle className="text-xl font-bold text-zinc-900">Verify Check-in</DrawerTitle>
                            <DrawerDescription>Enter the member's access code.</DrawerDescription>
                        </DrawerHeader>
                    </div>

                    <div className="p-6 space-y-6">
                        {!checkInResult ? (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-zinc-900 font-bold text-sm">Access Code</Label>
                                    <Input
                                        value={accessCode}
                                        onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                                        className="h-14 rounded-2xl border-zinc-200 bg-white shadow-sm text-center text-2xl font-mono tracking-widest uppercase placeholder:tracking-normal"
                                        placeholder="CODE"
                                        maxLength={8}
                                    />
                                </div>
                                <Button
                                    onClick={handleVerifyCheckIn}
                                    disabled={checkInLoading || accessCode.length < 3}
                                    className="w-full h-14 text-base font-bold bg-zinc-900 hover:bg-zinc-800 rounded-2xl shadow-xl shadow-zinc-200"
                                >
                                    {checkInLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Verifying...
                                        </>
                                    ) : (
                                        'Verify & Check-in'
                                    )}
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center text-center space-y-4 py-4">
                                <div className={`h-20 w-20 rounded-full flex items-center justify-center ${checkInResult.success ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    {checkInResult.success ? (
                                        <CheckCircle2 className="w-10 h-10" />
                                    ) : (
                                        <XCircle className="w-10 h-10" />
                                    )}
                                </div>
                                <div>
                                    <h3 className={`text-xl font-bold ${checkInResult.success ? 'text-green-700' : 'text-red-700'}`}>
                                        {checkInResult.success ? 'Check-in Successful' : 'Check-in Failed'}
                                    </h3>
                                    <p className="text-zinc-500 mt-1">
                                        {checkInResult.message}
                                    </p>
                                    {checkInResult.user && (
                                        <p className="text-zinc-900 font-bold mt-2 text-lg">
                                            Welcome, {checkInResult.user}!
                                        </p>
                                    )}
                                </div>
                                <Button
                                    onClick={() => {
                                        setCheckInResult(null);
                                        setAccessCode('');
                                    }}
                                    variant="outline"
                                    className="w-full h-12 rounded-xl mt-4"
                                >
                                    Verify Another
                                </Button>
                            </div>
                        )}
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    )
}
