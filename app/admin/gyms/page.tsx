'use client'

import { useState } from 'react';
import { useGymsQuery, useVerifyGymMutation, useUnverifyGymMutation } from '@/lib/hooks/queries/useGyms';
import { Loader2, CheckCircle2, XCircle, MapPin, User, Building2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

export default function GymVerifyPage() {
    const [filter, setFilter] = useState<'all' | 'verified' | 'unverified'>('unverified');
    const [search, setSearch] = useState('');

    const { data, isLoading } = useGymsQuery({
        verified: filter === 'all' ? undefined : filter === 'verified',
    });

    const verifyMutation = useVerifyGymMutation();
    const unverifyMutation = useUnverifyGymMutation();

    const gyms = data?.data || [];
    const filteredGyms = gyms.filter(gym =>
        gym.name.toLowerCase().includes(search.toLowerCase()) ||
        gym.address.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#FAFAFA] pb-12">
            {/* Header */}
            <div className="bg-white border-b border-zinc-100 sticky top-0 z-10">
                <div className="max-w-md mx-auto px-4 py-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-full bg-zinc-900 text-white flex items-center justify-center">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-zinc-900">Gym Verification</h1>
                            <p className="text-xs text-zinc-500">Manage gym approvals</p>
                        </div>
                    </div>

                    {/* Search & Filter */}
                    <div className="space-y-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <Input
                                placeholder="Search gyms..."
                                className="pl-9 bg-zinc-50 border-zinc-200 rounded-xl"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                            {(['unverified', 'verified', 'all'] as const).map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={cn(
                                        "px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors",
                                        filter === f
                                            ? "bg-zinc-900 text-white"
                                            : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                                    )}
                                >
                                    {f.charAt(0).toUpperCase() + f.slice(1)}
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
                ) : filteredGyms.length === 0 ? (
                    <div className="text-center py-12">
                        <Building2 className="w-12 h-12 text-zinc-200 mx-auto mb-3" />
                        <p className="text-zinc-400 font-medium">No gyms found</p>
                    </div>
                ) : (
                    filteredGyms.map((gym) => (
                        <div key={gym.id} className="bg-white rounded-[20px] p-5 border border-zinc-100 shadow-sm relative overflow-hidden">
                            {/* Status Badge */}
                            <div className="absolute top-5 right-5">
                                {gym.verified ? (
                                    <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-100 gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> Verified
                                    </Badge>
                                ) : (
                                    <Badge variant="secondary" className="bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-100 gap-1">
                                        <Loader2 className="w-3 h-3" /> Pending
                                    </Badge>
                                )}
                            </div>

                            <div className="pr-20 mb-4">
                                <h3 className="font-bold text-lg text-zinc-900 leading-tight mb-1">{gym.name}</h3>
                                <div className="flex items-start gap-1.5 text-zinc-500 text-xs">
                                    <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                    <p className="line-clamp-2">{gym.address}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 mb-5 p-3 bg-zinc-50 rounded-xl border border-zinc-100/50">
                                <div className="h-8 w-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-400">
                                    <User className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-zinc-700">Owner</p>
                                    <p className="text-xs text-zinc-500">{gym.owner?.name || 'Unknown'}</p>
                                </div>
                                <div className="ml-auto text-[10px] text-zinc-400 font-medium">
                                    {formatDistanceToNow(new Date(gym.createdAt), { addSuffix: true })}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                {!gym.verified ? (
                                    <Button
                                        onClick={() => verifyMutation.mutate(gym.id)}
                                        disabled={verifyMutation.isPending}
                                        className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-bold h-11"
                                    >
                                        {verifyMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Approve Gym'}
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() => unverifyMutation.mutate(gym.id)}
                                        disabled={unverifyMutation.isPending}
                                        variant="outline"
                                        className="flex-1 border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl font-bold h-11"
                                    >
                                        {unverifyMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Revoke Verification'}
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
