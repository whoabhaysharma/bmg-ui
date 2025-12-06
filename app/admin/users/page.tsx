'use client'

import { useState } from 'react';
import { useUsersQuery, useDeleteUserMutation, useRestoreUserMutation, useAddRoleMutation, useRemoveRoleMutation } from '@/lib/hooks/queries/useUsers';
import { Loader2, Search, User as UserIcon, Shield, Trash2, RefreshCw, MoreVertical, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

export default function AdminUsersPage() {
    const [search, setSearch] = useState('');
    // Debounce search could be added here, but for now direct state is fine for small scale
    const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined);

    const { data, isLoading } = useUsersQuery({
        search: search || undefined,
        role: roleFilter,
        includeDeleted: true, // Always show deleted users to allow restore
    });

    const deleteMutation = useDeleteUserMutation();
    const restoreMutation = useRestoreUserMutation();
    const addRoleMutation = useAddRoleMutation();
    const removeRoleMutation = useRemoveRoleMutation();

    const users = data?.data || [];

    const handleRoleToggle = (userId: string, role: string, currentRoles: string[]) => {
        if (currentRoles.includes(role)) {
            removeRoleMutation.mutate({ userId, role });
        } else {
            addRoleMutation.mutate({ userId, role });
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] pb-12">
            {/* Header */}
            <div className="bg-white border-b border-zinc-100 sticky top-0 z-10">
                <div className="max-w-md mx-auto px-4 py-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-full bg-zinc-900 text-white flex items-center justify-center">
                            <UserIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-zinc-900">User Management</h1>
                            <p className="text-xs text-zinc-500">Manage users and roles</p>
                        </div>
                    </div>

                    {/* Search & Filter */}
                    <div className="space-y-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <Input
                                placeholder="Search by name or phone..."
                                className="pl-9 bg-zinc-50 border-zinc-200 rounded-xl"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                            <button
                                onClick={() => setRoleFilter(undefined)}
                                className={cn(
                                    "px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors",
                                    !roleFilter
                                        ? "bg-zinc-900 text-white"
                                        : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                                )}
                            >
                                All
                            </button>
                            {(['ADMIN', 'OWNER', 'USER'] as const).map((r) => (
                                <button
                                    key={r}
                                    onClick={() => setRoleFilter(r)}
                                    className={cn(
                                        "px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors",
                                        roleFilter === r
                                            ? "bg-zinc-900 text-white"
                                            : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                                    )}
                                >
                                    {r.charAt(0) + r.slice(1).toLowerCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="max-w-md mx-auto px-4 py-6 space-y-4">
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-zinc-300" />
                    </div>
                ) : users.length === 0 ? (
                    <div className="text-center py-12">
                        <UserIcon className="w-12 h-12 text-zinc-200 mx-auto mb-3" />
                        <p className="text-zinc-400 font-medium">No users found</p>
                    </div>
                ) : (
                    users.map((user) => (
                        <div key={user.id} className={cn(
                            "bg-white rounded-[20px] p-5 border shadow-sm relative overflow-hidden transition-all",
                            user.deletedAt ? "border-red-100 bg-red-50/30" : "border-zinc-100"
                        )}>
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className={cn("font-bold text-lg leading-tight mb-1", user.deletedAt ? "text-zinc-500 line-through" : "text-zinc-900")}>
                                        {user.name}
                                    </h3>
                                    <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
                                        <Phone className="w-3 h-3" />
                                        <p>{user.mobileNumber}</p>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-zinc-400">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48 rounded-xl">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => handleRoleToggle(user.id, 'ADMIN', user.roles)}>
                                            <Shield className="w-4 h-4 mr-2" />
                                            {user.roles.includes('ADMIN') ? 'Remove Admin' : 'Make Admin'}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleRoleToggle(user.id, 'OWNER', user.roles)}>
                                            <UserIcon className="w-4 h-4 mr-2" />
                                            {user.roles.includes('OWNER') ? 'Remove Owner' : 'Make Owner'}
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        {user.deletedAt ? (
                                            <DropdownMenuItem onClick={() => restoreMutation.mutate(user.id)} className="text-green-600 focus:text-green-700 focus:bg-green-50">
                                                <RefreshCw className="w-4 h-4 mr-2" />
                                                Restore User
                                            </DropdownMenuItem>
                                        ) : (
                                            <DropdownMenuItem onClick={() => deleteMutation.mutate(user.id)} className="text-red-600 focus:text-red-700 focus:bg-red-50">
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Delete User
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {user.roles.map(role => (
                                    <Badge key={role} variant="secondary" className={cn(
                                        "text-[10px] font-bold tracking-wider border",
                                        role === 'ADMIN' ? "bg-purple-50 text-purple-700 border-purple-100" :
                                            role === 'OWNER' ? "bg-blue-50 text-blue-700 border-blue-100" :
                                                "bg-zinc-50 text-zinc-500 border-zinc-100"
                                    )}>
                                        {role}
                                    </Badge>
                                ))}
                                {user.deletedAt && (
                                    <Badge variant="destructive" className="text-[10px] font-bold tracking-wider">
                                        DELETED
                                    </Badge>
                                )}
                            </div>

                            <div className="text-[10px] text-zinc-400 font-medium border-t border-zinc-100 pt-3 mt-3 flex justify-between">
                                <span>Joined {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}</span>
                                {user.deletedAt && (
                                    <span className="text-red-400">Deleted {formatDistanceToNow(new Date(user.deletedAt), { addSuffix: true })}</span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
