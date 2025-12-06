'use client'

import { useState } from 'react';
import { useSettlementsQuery, useCreateSettlementMutation, useUnsettledAmountQuery } from '@/lib/hooks/queries/useSettlements';
import { useGymsQuery } from '@/lib/hooks/queries/useGyms';
import { Loader2, IndianRupee, Building2, CheckCircle2, Clock, AlertCircle, Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
    DrawerClose
} from '@/components/ui/drawer';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

export default function AdminSettlementsPage() {
    const [selectedGymId, setSelectedGymId] = useState<string | null>(null);
    const [isSettleDrawerOpen, setIsSettleDrawerOpen] = useState(false);
    const [search, setSearch] = useState('');

    const { data: settlementsData, isLoading: isSettlementsLoading } = useSettlementsQuery();
    const { data: gymsData } = useGymsQuery({ verified: true }); // Only fetch verified gyms for settlement
    const { data: unsettledData, isLoading: isUnsettledLoading } = useUnsettledAmountQuery(selectedGymId || undefined);

    const createSettlementMutation = useCreateSettlementMutation();

    const settlements = settlementsData?.data || [];
    const gyms = gymsData?.data || [];

    const handleOpenSettle = (gymId: string) => {
        setSelectedGymId(gymId);
        setIsSettleDrawerOpen(true);
    };

    const handleSettle = () => {
        if (!selectedGymId) return;
        createSettlementMutation.mutate(selectedGymId, {
            onSuccess: () => {
                setIsSettleDrawerOpen(false);
            }
        });
    };

    const filteredGyms = gyms.filter(gym =>
        gym.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#FAFAFA] pb-12">
            {/* Header */}
            <div className="bg-white border-b border-zinc-100 sticky top-0 z-10">
                <div className="max-w-md mx-auto px-4 py-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-full bg-zinc-900 text-white flex items-center justify-center">
                            <IndianRupee className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-zinc-900">Settlements</h1>
                            <p className="text-xs text-zinc-500">Manage payouts to gyms</p>
                        </div>
                    </div>

                    {/* Quick Settle Action */}
                    <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100 mb-4">
                        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Initiate Settlement</h3>
                        <div className="relative mb-3">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <Input
                                placeholder="Search gym to settle..."
                                className="pl-9 bg-white border-zinc-200 rounded-xl h-10 text-sm"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        {search && (
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {filteredGyms.map(gym => (
                                    <div key={gym.id} className="flex items-center justify-between p-2 bg-white rounded-lg border border-zinc-100 shadow-sm">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="w-4 h-4 text-zinc-400" />
                                            <span className="text-sm font-medium text-zinc-700">{gym.name}</span>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-7 text-xs"
                                            onClick={() => handleOpenSettle(gym.id)}
                                        >
                                            Settle
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Settlements List */}
            <div className="max-w-md mx-auto px-4 py-6 space-y-4">
                <h2 className="text-sm font-bold text-zinc-900 px-1">Recent Settlements</h2>
                {isSettlementsLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-zinc-300" />
                    </div>
                ) : settlements.length === 0 ? (
                    <div className="text-center py-12">
                        <IndianRupee className="w-12 h-12 text-zinc-200 mx-auto mb-3" />
                        <p className="text-zinc-400 font-medium">No settlements found</p>
                    </div>
                ) : (
                    settlements.map((settlement) => (
                        <div key={settlement.id} className="bg-white rounded-[20px] p-4 border border-zinc-100 shadow-sm flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "h-10 w-10 rounded-full flex items-center justify-center border",
                                    settlement.status === 'COMPLETED' ? "bg-green-50 border-green-100 text-green-600" :
                                        settlement.status === 'PENDING' ? "bg-amber-50 border-amber-100 text-amber-600" :
                                            "bg-red-50 border-red-100 text-red-600"
                                )}>
                                    {settlement.status === 'COMPLETED' ? <CheckCircle2 className="w-5 h-5" /> :
                                        settlement.status === 'PENDING' ? <Clock className="w-5 h-5" /> :
                                            <AlertCircle className="w-5 h-5" />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-zinc-900 text-sm">{settlement.gym.name}</h3>
                                    <p className="text-[10px] text-zinc-400 font-medium">
                                        {formatDistanceToNow(new Date(settlement.createdAt), { addSuffix: true })}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-black text-zinc-900">₹{settlement.amount.toLocaleString()}</p>
                                <Badge variant="secondary" className={cn(
                                    "text-[10px] h-5 px-1.5 font-bold",
                                    settlement.status === 'COMPLETED' ? "bg-green-50 text-green-700" : "bg-zinc-50 text-zinc-500"
                                )}>
                                    {settlement.status}
                                </Badge>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Settlement Drawer */}
            <Drawer open={isSettleDrawerOpen} onOpenChange={setIsSettleDrawerOpen}>
                <DrawerContent className="max-w-md mx-auto rounded-t-[32px]">
                    <div className="p-6 bg-zinc-50/50 border-b border-zinc-100">
                        <DrawerHeader className="p-0 text-left">
                            <DrawerTitle className="text-xl font-bold text-zinc-900">Confirm Settlement</DrawerTitle>
                            <DrawerDescription>Review the unsettled amount before processing.</DrawerDescription>
                        </DrawerHeader>
                    </div>

                    <div className="p-6 space-y-6">
                        {isUnsettledLoading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="w-8 h-8 animate-spin text-zinc-300" />
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-sm text-zinc-500 font-medium mb-1">Total Unsettled Amount</p>
                                <h2 className="text-4xl font-black text-zinc-900 tracking-tight">
                                    ₹{unsettledData?.amount?.toLocaleString() || 0}
                                </h2>
                                {unsettledData?.amount > 0 ? (
                                    <p className="text-xs text-emerald-600 font-medium mt-2 bg-emerald-50 inline-block px-3 py-1 rounded-full">
                                        Ready for payout
                                    </p>
                                ) : (
                                    <p className="text-xs text-zinc-400 font-medium mt-2">
                                        No pending amount to settle
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 text-xs text-zinc-500 leading-relaxed">
                            <p>
                                By confirming, you are marking all pending payments for this gym as <strong>Settled</strong>.
                                This action cannot be undone. Please ensure the actual fund transfer is initiated separately.
                            </p>
                        </div>
                    </div>

                    <DrawerFooter className="p-6 pt-2">
                        <Button
                            onClick={handleSettle}
                            disabled={createSettlementMutation.isPending || !unsettledData?.amount}
                            className="w-full h-14 text-base font-bold bg-zinc-900 hover:bg-zinc-800 rounded-2xl shadow-xl shadow-zinc-200"
                        >
                            {createSettlementMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Process Settlement <ArrowRight className="ml-2 w-4 h-4" />
                                </>
                            )}
                        </Button>
                        <DrawerClose asChild>
                            <Button variant="ghost" className="w-full h-12 rounded-xl text-zinc-500 font-semibold hover:bg-zinc-50 hover:text-zinc-900">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    );
}
