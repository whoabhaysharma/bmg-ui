'use client'

import { Activity, Bell, User, Calendar, CreditCard } from "lucide-react"
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
import { useState } from "react";
import { useOwnerStore } from "@/lib/store/ownerStore";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow, isPast } from "date-fns";
import { useRouter } from "next/navigation";
import { useNotificationsQuery, useMarkNotificationReadMutation, useMarkAllNotificationsReadMutation } from "@/lib/hooks/queries/useNotifications";
import { useGymStatsQuery, useCheckInMutation } from "@/lib/hooks/queries/useDashboard";

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

// ---------------------------------------
// Header Component
// ---------------------------------------
export function OwnerHeader() {
    const { currentGym } = useOwnerStore();
    const user = { name: currentGym?.ownerName || 'Gym Owner', avatar: 'GO' };

    // React Query Hooks
    const { data, isLoading } = useNotificationsQuery();
    const markReadMutation = useMarkNotificationReadMutation();
    const markAllReadMutation = useMarkAllNotificationsReadMutation();

    // Safely extract notifications and unreadCount with proper fallbacks
    const notifications = Array.isArray(data?.notifications) ? data.notifications : [];
    const unreadCount = typeof data?.unreadCount === 'number' ? data.unreadCount : 0;


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
                                {isLoading ? (
                                    <div className="flex justify-center py-8">
                                        <Loader2 className="w-6 h-6 animate-spin text-zinc-300" />
                                    </div>
                                ) : notifications.length === 0 ? (
                                    <div className="text-center py-8 text-zinc-400 text-sm">
                                        No notifications yet.
                                    </div>
                                ) : (
                                    notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            onClick={() => !notif.isRead && markReadMutation.mutate(notif.id)}
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
                                    onClick={() => markAllReadMutation.mutate()}
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
function QuickActions({ onCheckInClick, onPaymentsClick }: { onCheckInClick: () => void; onPaymentsClick: () => void }) {
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
                <button
                    onClick={onPaymentsClick}
                    className="flex-1 bg-zinc-800 py-3 rounded-xl text-sm font-medium hover:bg-zinc-700 transition"
                >
                    Payments
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
// Main Dashboard Component
// ---------------------------------------
export default function DashboardContent() {
    const router = useRouter();
    const { currentGym, isLoading: isGymLoading } = useOwnerStore();

    // Use React Query for stats
    const { data: stats, isLoading: isStatsLoading } = useGymStatsQuery(currentGym?.id);
    const checkInMutation = useCheckInMutation(currentGym?.id || '');

    // Check-in Verification State
    const [isCheckInDrawerOpen, setIsCheckInDrawerOpen] = useState(false);
    const [accessCode, setAccessCode] = useState('');
    const [checkInResult, setCheckInResult] = useState<{
        success: boolean;
        message: string;
        user?: string;
        phone?: string;
        plan?: string;
        expiryDate?: string;
    } | null>(null);

    const handleVerifyCheckIn = async () => {
        if (!accessCode.trim() || !currentGym) return;

        checkInMutation.mutate(accessCode, {
            onSuccess: (res) => {
                const data = res.data.data || res.data;
                setCheckInResult({
                    success: true,
                    message: 'Check-in verified successfully!',
                    user: data.user?.name || 'Unknown User',
                    phone: data.user?.mobileNumber,
                    plan: data.subscription?.plan?.name,
                    expiryDate: data.subscription?.endDate
                });
                setAccessCode('');
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onError: (error: any) => {
                console.error("Check-in verification failed:", error);
                const errorMsg = error.response?.data?.error || 'Verification failed. Please try again.';
                setCheckInResult({
                    success: false,
                    message: errorMsg
                });
            }
        });
    };

    const resetCheckInState = (open: boolean) => {
        setIsCheckInDrawerOpen(open);
        if (!open) {
            setTimeout(() => {
                setCheckInResult(null);
                setAccessCode('');
            }, 300); // Delay clear slightly for smooth transition
        }
    };

    // Helper to calculate expiry visual state
    const getExpiryInfo = (dateString?: string) => {
        if (!dateString) return { label: 'No Active Plan', color: 'text-zinc-400', bg: 'bg-zinc-100', expired: false };
        const date = new Date(dateString);
        const expired = isPast(date);
        const relative = formatDistanceToNow(date, { addSuffix: true });

        if (expired) {
            return { label: `Expired ${relative}`, color: 'text-red-700', bg: 'bg-red-50', expired: true };
        }
        return { label: `Expires ${relative}`, color: 'text-emerald-700', bg: 'bg-emerald-50', expired: false };
    };

    // If gym is loading, show loader. If gym is loaded but null (no gym), don't show loader.
    // If gym exists, check if stats are loading.
    const showLoader = isGymLoading || (currentGym && isStatsLoading && !stats);

    if (showLoader) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-300" />
            </div>
        )
    }

    // Default stats if failed or loading
    const displayStats = stats || {
        totalRevenue: 0,
        activeMembers: 0,
        unsettledAmount: 0,
        recentActivity: [] as RecentItemProps[]
    };

    // Format recent activity here if needed, but it was done in hook
    const recentActivityFormatted = displayStats.recentActivity.map((act) => ({
        ...act,
        time: act.time ? new Date(act.time).toLocaleDateString() : 'N/A', // ensure date formatting if raw data differs
        amount: act.amount ? `+ ₹${act.amount}` : undefined
    }));

    return (
        <div className="space-y-6 px-4">
            <OwnerHeader />

            <div className="grid grid-cols-2 gap-4">
                <StatsCard
                    label="Total Revenue"
                    value={`₹${displayStats.totalRevenue.toLocaleString()}`}
                    change="12%"
                    positive
                />
                <StatsCard
                    label="Active Members"
                    value={displayStats.activeMembers.toString()}
                />
                <StatsCard
                    label="Unsettled Amount"
                    value={`₹${displayStats.unsettledAmount.toLocaleString()}`}
                    change={displayStats.unsettledAmount > 0 ? "Pending" : undefined}
                    positive={false} // Neutral or warning color
                />
            </div>

            <QuickActions
                onCheckInClick={() => setIsCheckInDrawerOpen(true)}
                onPaymentsClick={() => router.push('/owner/payments')}
            />

            <RecentActivityList items={recentActivityFormatted} />

            {/* Check-in Verification Drawer */}
            <Drawer open={isCheckInDrawerOpen} onOpenChange={resetCheckInState}>
                <DrawerContent className="max-w-md mx-auto rounded-t-[32px] max-h-[90vh]">

                    {/* Header Section */}
                    <div className="p-6 pb-2 bg-zinc-50/50">
                        <div className="w-12 h-1 bg-zinc-300 rounded-full mx-auto mb-6 opacity-50" />
                        <DrawerHeader className="p-0 text-left">
                            <DrawerTitle className="text-xl font-bold text-zinc-900">Member Check-in</DrawerTitle>
                            <DrawerDescription>
                                {checkInResult ? "Verification Result" : "Enter access code to verify membership"}
                            </DrawerDescription>
                        </DrawerHeader>
                    </div>

                    <div className="p-6 pt-2 space-y-6">
                        {!checkInResult ? (
                            <div className="space-y-6 mt-4">
                                <div className="space-y-3">
                                    <Label className="text-zinc-700 font-bold text-xs uppercase tracking-wider pl-1">Access Code</Label>
                                    <div className="relative">
                                        <Input
                                            value={accessCode}
                                            onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                                            className="h-16 rounded-2xl border-2 border-zinc-100 bg-zinc-50/50 text-center text-3xl font-black tracking-[0.5em] uppercase placeholder:tracking-normal focus:border-zinc-900 focus:ring-0 transition-all text-zinc-900"
                                            placeholder="••••••"
                                            maxLength={8}
                                        />
                                    </div>
                                    <p className="text-xs text-zinc-400 text-center">Ask member for their 6-digit dynamic code</p>
                                </div>
                                <Button
                                    onClick={handleVerifyCheckIn}
                                    disabled={checkInMutation.isPending || accessCode.length < 3}
                                    className="w-full h-14 text-base font-bold bg-zinc-900 hover:bg-zinc-800 rounded-2xl shadow-xl shadow-zinc-200 active:scale-[0.98] transition-all"
                                >
                                    {checkInMutation.isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Verifying...
                                        </>
                                    ) : (
                                        'Verify Access'
                                    )}
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center w-full animate-in fade-in slide-in-from-bottom-4 duration-500">

                                {/* Status Icon with Ripple Effect */}
                                <div className="relative mb-6 mt-2">
                                    {checkInResult.success && (
                                        <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
                                    )}
                                    <div className={`h-20 w-20 rounded-full flex items-center justify-center border-4 border-white shadow-xl ${checkInResult.success ? 'bg-gradient-to-br from-green-400 to-green-600 text-white' : 'bg-gradient-to-br from-red-500 to-red-600 text-white'
                                        }`}>
                                        {checkInResult.success ? (
                                            <CheckCircle2 className="w-10 h-10" strokeWidth={3} />
                                        ) : (
                                            <XCircle className="w-10 h-10" strokeWidth={3} />
                                        )}
                                    </div>
                                </div>

                                <div className="text-center mb-6">
                                    <h3 className="text-2xl font-bold text-zinc-900">
                                        {checkInResult.success ? 'Access Granted' : 'Access Denied'}
                                    </h3>
                                    <p className="text-zinc-500 text-sm mt-1 max-w-[200px] mx-auto leading-relaxed">
                                        {checkInResult.message}
                                    </p>
                                </div>

                                {checkInResult.user && checkInResult.success && (
                                    <div className="w-full bg-white rounded-[24px] border border-zinc-200 shadow-sm overflow-hidden relative">
                                        {/* Decorative top strip */}
                                        <div className="h-2 w-full bg-zinc-900" />

                                        <div className="p-5">
                                            {/* User Info Compact Row */}
                                            <div className="flex items-center gap-4 mb-5">
                                                <div className="h-14 w-14 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 font-bold text-lg border-2 border-white shadow-sm">
                                                    {checkInResult.user.charAt(0)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-lg text-zinc-900 truncate">{checkInResult.user}</h4>
                                                    <div className="flex items-center gap-1.5 text-zinc-500">
                                                        <CreditCard className="w-3.5 h-3.5" />
                                                        <p className="text-xs font-medium">{checkInResult.phone}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Dashed Separator */}
                                            <div className="w-full border-t-2 border-dashed border-zinc-100 mb-5 relative">
                                                <div className="absolute -left-[26px] -top-3 w-6 h-6 rounded-full bg-zinc-50 border-r border-zinc-200" />
                                                <div className="absolute -right-[26px] -top-3 w-6 h-6 rounded-full bg-zinc-50 border-l border-zinc-200" />
                                            </div>

                                            {/* Subscription Details with Relative Time */}
                                            {checkInResult.plan && (
                                                <div className={`rounded-xl p-4 flex items-center justify-between ${getExpiryInfo(checkInResult.expiryDate).bg
                                                    }`}>
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-0.5">Active Plan</span>
                                                        <span className="font-bold text-zinc-800 text-sm">{checkInResult.plan}</span>
                                                    </div>
                                                    <div className="text-right flex flex-col items-end">
                                                        <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-0.5">Validity</span>
                                                        <div className={`flex items-center gap-1.5 ${getExpiryInfo(checkInResult.expiryDate).color}`}>
                                                            <Calendar className="w-3.5 h-3.5" />
                                                            <span className="font-bold text-xs">
                                                                {getExpiryInfo(checkInResult.expiryDate).label}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <Button
                                    onClick={() => {
                                        setCheckInResult(null);
                                        setAccessCode('');
                                    }}
                                    variant="outline"
                                    className="w-full h-14 rounded-2xl mt-6 font-semibold border-2 border-zinc-100 hover:bg-zinc-50 hover:text-zinc-900"
                                >
                                    Scan Another Member
                                </Button>
                            </div>
                        )}
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    )
}
