'use client'

import { useState } from "react"
import {
    Settings,
    ChevronRight,
    Shield,
    LogOut,
    Edit2,
    Camera,
    Loader2,
    Database,
    Server,
    FileText
} from "lucide-react"
import { toast } from "sonner"

// SHADCN / UI Imports
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
    DrawerClose
} from '@/components/ui/drawer'
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store/authStore"
import { useUserProfileQuery, useUpdateProfileMutation } from "@/lib/hooks/queries/useSettings"
import { useAuditLogsQuery } from "@/lib/hooks/queries/useAuditLogs"
import { formatDistanceToNow } from "date-fns"

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
export default function AdminSettingsPage() {
    const router = useRouter();
    const logout = useAuthStore((state) => state.logout);

    // React Query Hooks
    const { data: user, isLoading: isUserLoading } = useUserProfileQuery();
    const updateProfileMutation = useUpdateProfileMutation();

    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(user?.name || '');

    // Update local state when user data loads
    if (!editName && user?.name) {
        setEditName(user.name);
    }

    const [isAuditOpen, setIsAuditOpen] = useState(false);

    // Real Audit Logs
    const { data: auditLogsData, isLoading: isAuditLoading } = useAuditLogsQuery();
    const auditLogs = auditLogsData || [];

    const handleUpdateProfile = async () => {
        if (!editName.trim()) return;

        updateProfileMutation.mutate(
            { name: editName },
            {
                onSuccess: () => {
                    setIsEditing(false);
                    toast.success('Profile updated successfully');
                },
                onError: (error) => {
                    console.error('Failed to update profile:', error);
                    toast.error('Failed to update profile');
                }
            }
        );
    };

    const handleLogout = () => {
        logout();
        router.push('/auth/login');
    };

    if (isUserLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-300" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] pb-32">

            {/* --- FIXED HEADER --- */}
            <div className="bg-white rounded-b-[2rem] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border-b border-zinc-100 px-5 pt-8 pb-8 space-y-6 overflow-hidden">

                {/* Title Row */}
                <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-900 flex-shrink-0">
                        <Settings className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                    <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Admin Settings</h1>
                </div>

                {/* Profile Card */}
                <div className="flex items-center gap-4 bg-zinc-50 p-4 rounded-2xl border border-zinc-100 relative overflow-hidden">

                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                        <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} />
                            <AvatarFallback className="bg-zinc-800 text-white font-bold">
                                {user?.name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white"></div>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-bold text-zinc-900 truncate">{user?.name}</h2>
                        <div className="flex items-center gap-2 mt-0.5">
                            <Badge variant="secondary" className="bg-white text-zinc-500 border-zinc-200 text-[10px] h-5 px-2 font-bold shadow-none">
                                {user?.role}
                            </Badge>
                            <span className="text-xs text-zinc-400 font-medium truncate">{user?.mobileNumber}</span>
                        </div>
                    </div>

                    {/* Edit Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-zinc-300 hover:text-zinc-600 flex-shrink-0 -mr-2"
                        onClick={() => {
                            setEditName(user?.name || '');
                            setIsEditing(true);
                        }}
                    >
                        <Edit2 className="w-5 h-5" />
                    </Button>
                </div>
            </div>


            {/* --- CONTENT AREA --- */}
            <div className="px-4 py-6 space-y-8">

                {/* Section 1: System */}
                <SettingsSection title="System Management">
                    <SettingItem
                        icon={Server}
                        label="System Status"
                        sub="All systems operational"
                        action={
                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 text-[10px] h-5">
                                Healthy
                            </Badge>
                        }
                    />
                    <SettingItem
                        icon={Database}
                        label="Database"
                        sub="Manage backups & data"
                    />
                    <SettingItem
                        icon={FileText}
                        label="Audit Logs"
                        sub="View system activity"
                        onClick={() => setIsAuditOpen(true)}
                    />
                </SettingsSection>

                {/* Section 2: Security */}
                <SettingsSection title="Security">
                    <SettingItem
                        icon={Shield}
                        label="Admin Access"
                        sub="Manage admin roles"
                    />
                </SettingsSection>

                {/* Logout Button */}
                <div className="pt-2">
                    <Button
                        variant="outline"
                        onClick={handleLogout}
                        className="w-full h-12 bg-white border-zinc-200 text-rose-600 hover:text-rose-700 hover:bg-rose-50 hover:border-rose-100 rounded-2xl font-semibold gap-2 shadow-sm"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </Button>
                    <p className="text-center text-[10px] text-zinc-300 mt-5 font-mono">
                        Admin Portal v1.0.0
                    </p>
                </div>

            </div>

            {/* Edit Profile Drawer */}
            <Drawer open={isEditing} onOpenChange={setIsEditing}>
                <DrawerContent className="max-w-md mx-auto rounded-t-[32px]">
                    <div className="p-6 bg-zinc-50/50 border-b border-zinc-100">
                        <DrawerHeader className="p-0 text-left">
                            <DrawerTitle className="text-xl font-bold text-zinc-900">Edit Profile</DrawerTitle>
                            <DrawerDescription>Update your personal information.</DrawerDescription>
                        </DrawerHeader>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="flex justify-center">
                            <div className="relative">
                                <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${editName}`} />
                                    <AvatarFallback className="bg-zinc-800 text-white text-2xl font-bold">
                                        {editName?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute bottom-0 right-0 p-2 bg-zinc-900 text-white rounded-full border-4 border-white shadow-sm cursor-pointer hover:bg-zinc-800">
                                    <Camera className="w-4 h-4" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-zinc-900 font-bold text-sm">Full Name</Label>
                            <Input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="h-12 rounded-2xl border-zinc-200 bg-white shadow-sm text-base font-medium"
                                placeholder="Enter your name"
                            />
                        </div>

                        <div className="space-y-3 opacity-60">
                            <Label className="text-zinc-900 font-bold text-sm">Mobile Number</Label>
                            <Input
                                value={user?.mobileNumber || ''}
                                disabled
                                className="h-12 rounded-2xl border-zinc-200 bg-zinc-50 text-base font-medium"
                            />
                            <p className="text-[10px] text-zinc-400 font-medium px-1">Mobile number cannot be changed directly.</p>
                        </div>
                    </div>

                    <DrawerFooter className="p-6 pt-2">
                        <Button
                            onClick={handleUpdateProfile}
                            disabled={updateProfileMutation.isPending}
                            className="w-full h-14 text-base font-bold bg-zinc-900 hover:bg-zinc-800 rounded-2xl shadow-xl shadow-zinc-200"
                        >
                            {updateProfileMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </Button>
                        <DrawerClose asChild>
                            <Button variant="ghost" className="w-full h-12 rounded-xl text-zinc-500 font-semibold hover:bg-zinc-50 hover:text-zinc-900">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>

            {/* Audit Logs Drawer */}
            <Drawer open={isAuditOpen} onOpenChange={setIsAuditOpen}>
                <DrawerContent className="max-w-md mx-auto rounded-t-[32px] h-[85vh]">
                    <div className="p-6 bg-zinc-50/50 border-b border-zinc-100">
                        <DrawerHeader className="p-0 text-left">
                            <DrawerTitle className="text-xl font-bold text-zinc-900">Audit Logs</DrawerTitle>
                            <DrawerDescription>Recent system activities and admin actions.</DrawerDescription>
                        </DrawerHeader>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {isAuditLoading ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="w-6 h-6 animate-spin text-zinc-300" />
                            </div>
                        ) : auditLogs.length === 0 ? (
                            <div className="text-center py-12">
                                <FileText className="w-12 h-12 text-zinc-200 mx-auto mb-3" />
                                <p className="text-zinc-400 font-medium">No logs found</p>
                            </div>
                        ) : (
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            auditLogs.map((log: any) => (
                                <div key={log.id} className="bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge variant="outline" className="text-[10px] font-bold tracking-wider bg-zinc-50 border-zinc-200 text-zinc-600">
                                            {log.action}
                                        </Badge>
                                        <span className="text-[10px] text-zinc-400 font-medium">
                                            {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-zinc-800 leading-snug mb-2">{log.details}</p>
                                    <div className="flex items-center gap-2 pt-2 border-t border-zinc-50">
                                        <div className="h-5 w-5 rounded-full bg-zinc-100 flex items-center justify-center text-[10px] font-bold text-zinc-500">
                                            {log.userName.charAt(0)}
                                        </div>
                                        <span className="text-xs text-zinc-500">Performed by <span className="font-semibold text-zinc-700">{log.userName}</span></span>
                                    </div>
                                </div>
                            ))
                        )}
                        {!isAuditLoading && auditLogs.length > 0 && (
                            <div className="text-center py-8">
                                <p className="text-xs text-zinc-400">End of logs</p>
                            </div>
                        )}
                    </div>

                    <DrawerFooter className="p-6 pt-2 border-t border-zinc-100">
                        <DrawerClose asChild>
                            <Button variant="outline" className="w-full h-12 rounded-xl text-zinc-900 font-bold border-zinc-200 hover:bg-zinc-50">Close</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    )
}
