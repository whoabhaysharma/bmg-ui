'use client'

import {
    Settings,
    ChevronRight,
    CreditCard,
    Bell,
    Shield,
    LogOut,
    Store,
    Dumbbell,
    Users,
    HelpCircle,
    ToggleRight // Using an icon instead of a component for stability
} from "lucide-react"

// SHADCN / UI Imports
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

// ---------------------------------------
// Types
// ---------------------------------------
interface SettingItemProps {
    icon: React.ElementType
    label: string
    sub?: string
    action?: React.ReactNode
    onClick?: () => void
    isDestructive?: boolean
}

// ---------------------------------------
// Component: Setting Item Row
// ---------------------------------------
function SettingItem({ icon: Icon, label, sub, action, onClick, isDestructive }: SettingItemProps) {
    return (
        <div
            onClick={onClick}
            className={`
                group flex items-center justify-between p-4 bg-white border border-zinc-100 
                first:rounded-t-2xl last:rounded-b-2xl 
                [&:not(:last-child)]:border-b-0 
                hover:bg-zinc-50 cursor-pointer transition-colors
            `}
        >
            {/* Left Side: Icon & Text */}
            <div className="flex items-center gap-3.5 flex-1 min-w-0">
                <div className={`
                    h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0
                    ${isDestructive ? 'bg-rose-50 text-rose-500' : 'bg-zinc-50 text-zinc-600'}
                `}>
                    <Icon className="w-5 h-5" strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1 pr-2">
                    <h3 className={`font-semibold text-sm truncate ${isDestructive ? 'text-rose-600' : 'text-zinc-900'}`}>
                        {label}
                    </h3>
                    {sub && <p className="text-xs text-zinc-400 font-medium truncate">{sub}</p>}
                </div>
            </div>

            {/* Right Side: Action or Chevron */}
            <div className="flex-shrink-0 text-zinc-300 flex items-center">
                {action || <ChevronRight className="w-5 h-5 group-hover:text-zinc-500 transition-colors" />}
            </div>
        </div>
    )
}

// ---------------------------------------
// Component: Section Container
// ---------------------------------------
function SettingsSection({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="space-y-3">
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider px-2">{title}</h2>
            <div className="shadow-sm shadow-zinc-200/50 rounded-2xl overflow-hidden">
                {children}
            </div>
        </div>
    )
}

// ---------------------------------------
// Main Settings Page
// ---------------------------------------
export default function SettingsPage() {
    const router = useRouter();
    const user = { name: 'Arjun Verma', avatar: 'AV', role: 'Gym Owner' };

    return (
        <div className="min-h-screen bg-[#FAFAFA] pb-32">

            {/* --- FIXED HEADER --- */}
            <div className="bg-white rounded-b-[2rem] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border-b border-zinc-100 px-5 pt-8 pb-8 space-y-6 overflow-hidden">

                {/* Title Row */}
                <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-900 flex-shrink-0">
                        <Settings className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                    <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Settings</h1>
                </div>

                {/* Profile Card */}
                <div className="flex items-center gap-4 bg-zinc-50 p-4 rounded-2xl border border-zinc-100 relative overflow-hidden">

                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                        <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                            <AvatarFallback className="bg-zinc-800 text-white font-bold">{user.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white"></div>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-bold text-zinc-900 truncate">{user.name}</h2>
                        <div className="flex items-center gap-2 mt-0.5">
                            <Badge variant="secondary" className="bg-white text-zinc-500 border-zinc-200 text-[10px] h-5 px-2 font-bold shadow-none">
                                {user.role}
                            </Badge>
                            <span className="text-xs text-zinc-400 font-medium truncate">Edit Profile</span>
                        </div>
                    </div>

                    {/* Arrow */}
                    <Button variant="ghost" size="icon" className="text-zinc-300 hover:text-zinc-600 flex-shrink-0 -mr-2">
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>
            </div>


            {/* --- CONTENT AREA --- */}
            <div className="px-4 py-6 space-y-8">

                {/* Section 1: Gym Configuration */}
                <SettingsSection title="Gym Configuration">
                    <SettingItem
                        icon={Dumbbell}
                        label="Membership Plans"
                        sub="Manage prices & duration"
                        onClick={
                            () => router.push('/owner/settings/plans')
                        }
                        action={<Badge className="bg-zinc-900 text-white hover:bg-zinc-800 text-[10px] h-5">5 Active</Badge>}
                    />
                    <SettingItem
                        icon={Users}
                        label="Trainers & Staff"
                        sub="Add coaches and staff"
                    />
                    <SettingItem
                        icon={Store}
                        label="Gym Profile"
                        sub="Logo, Address, Hours"
                        onClick={() => router.push('/owner/settings/gym-profile')}
                    />
                </SettingsSection>

                {/* Section 2: App Preferences */}
                <SettingsSection title="App Preferences">
                    <SettingItem
                        icon={Bell}
                        label="Notifications"
                        sub="Push alerts, Emails"
                        action={<ToggleRight className="w-8 h-8 text-emerald-500" strokeWidth={1.5} />}
                    />
                    <SettingItem
                        icon={CreditCard}
                        label="Payment Gateway"
                        sub="Razorpay linked"
                    />
                </SettingsSection>

                {/* Section 3: Security */}
                <SettingsSection title="Security & Support">
                    <SettingItem
                        icon={Shield}
                        label="Privacy & Security"
                        sub="Change password"
                    />
                    <SettingItem
                        icon={HelpCircle}
                        label="Help & Support"
                        sub="Contact support"
                    />
                </SettingsSection>

                {/* Logout Button */}
                <div className="pt-2">
                    <Button variant="outline" className="w-full h-12 bg-white border-zinc-200 text-rose-600 hover:text-rose-700 hover:bg-rose-50 hover:border-rose-100 rounded-2xl font-semibold gap-2 shadow-sm">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </Button>
                    <p className="text-center text-[10px] text-zinc-300 mt-5 font-mono">
                        Version 2.4.0 (Build 202)
                    </p>
                </div>

            </div>
        </div>
    )
}