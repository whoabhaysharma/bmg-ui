'use client'

import { useState, useEffect } from "react"
import { subscriptionsAPI } from "@/lib/api/client"
import { useOwnerStore } from "@/lib/store/ownerStore"
import { Search, UserPlus, Phone, MoreHorizontal, CalendarClock, Users, Filter, CreditCard, Calendar, Loader2 } from "lucide-react"

// SHADCN / UI Imports
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { plansAPI } from "@/lib/api/client"

// ---------------------------------------
// Types & Interfaces
// ---------------------------------------
interface Member {
    id: string
    name: string
    phone: string
    accessCode: string
    status: "active" | "inactive" | "expiring" | "pending"
    lastVisit?: string
    // Subscription details
    planName?: string
    startDate?: string
    endDate?: string
    price?: number
}

// ---------------------------------------
// Component: Member Item 
// ---------------------------------------
function MemberItem({ id, name, phone, accessCode, status, lastVisit, planName, endDate, onActivate }: Member & { onActivate: (id: string) => void }) {
    const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()

    const statusColor = {
        active: "bg-emerald-500 ring-emerald-100",
        inactive: "bg-zinc-300 ring-zinc-100",
        expiring: "bg-amber-500 ring-amber-100",
        pending: "bg-blue-500 ring-blue-100"
    }[status]

    return (
        <div className="group relative flex items-center gap-3 p-4 bg-white border border-zinc-100 rounded-2xl shadow-sm hover:border-zinc-200 transition-all duration-200">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
                <Avatar className="h-11 w-11 border border-zinc-50 bg-zinc-50">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} />
                    <AvatarFallback className="bg-zinc-100 text-zinc-600 font-bold text-xs">{initials}</AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full ring-2 ring-white ${statusColor}`} />
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                <h3 className="font-bold text-sm text-zinc-800 truncate leading-tight">{name}</h3>
                <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
                        <Phone className="h-3 w-3 text-zinc-400" />
                        <span className="truncate">{phone}</span>
                    </div>
                    {planName && (
                        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                            <CreditCard className="h-3 w-3 text-zinc-300" />
                            <span className="truncate">{planName}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                        <CalendarClock className="h-3 w-3 text-zinc-300" />
                        <span>Last: <span className="text-zinc-500 font-medium">{lastVisit || 'N/A'}</span></span>
                    </div>
                    {endDate && (
                        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                            <Calendar className="h-3 w-3 text-zinc-300" />
                            <span>Expires: <span className="text-zinc-500 font-medium">{endDate}</span></span>
                        </div>
                    )}
                </div>
            </div>

            {/* Access Code */}
            <div className="flex flex-col items-center justify-center bg-zinc-50 rounded-xl px-3 py-2 border border-zinc-100/80 min-w-[72px]">
                <span className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider leading-none mb-0.5">Code</span>
                <span className="font-mono text-lg font-bold text-zinc-900 leading-none tracking-tight">{accessCode}</span>
            </div>

            {/* Actions */}
            <div className="flex-shrink-0">
                {status === 'pending' ? (
                    <Button
                        size="sm"
                        className="h-8 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 rounded-lg shadow-sm shadow-blue-200"
                        onClick={() => onActivate(id)}
                    >
                        Activate
                    </Button>
                ) : (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-zinc-300 hover:text-zinc-600 hover:bg-transparent">
                                <MoreHorizontal className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl p-1">
                            <DropdownMenuItem className="cursor-pointer text-xs font-medium rounded-lg h-9">View Profile</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-xs font-medium rounded-lg h-9" onClick={() => window.open(`tel:${phone}`, '_self')}>Call Member</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-rose-600 focus:text-rose-600 focus:bg-rose-50 cursor-pointer text-xs font-medium rounded-lg h-9">Delete Member</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </div>
    )
}

function formatTimeAgo(dateString?: string) {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return date.toLocaleDateString()
}

// ---------------------------------------
// Main Members Page
// ---------------------------------------
export default function MembersPage() {
    const [filter, setFilter] = useState<"all" | "active" | "inactive" | "expiring" | "pending">("all")
    const [search, setSearch] = useState("")

    const [members, setMembers] = useState<Member[]>([])
    const [loading, setLoading] = useState(true)

    const { currentGym, isLoading: isGymLoading } = useOwnerStore()

    const [plans, setPlans] = useState<any[]>([])
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
    const [newMember, setNewMember] = useState({ name: '', phone: '', planId: '' })
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (currentGym) {
            plansAPI.getActiveByGymId(currentGym.id)
                .then(res => setPlans(res.data.data || res.data))
                .catch(err => console.error("Failed to fetch plans", err))
        }
    }, [currentGym])

    const handleAddMember = async () => {
        if (!newMember.name || !newMember.phone || !newMember.planId) {
            alert("Please fill all fields")
            return
        }

        setIsSubmitting(true)
        try {
            await subscriptionsAPI.createConsole({
                name: newMember.name,
                mobileNumber: newMember.phone,
                planId: newMember.planId,
                gymId: currentGym!.id
            })

            setIsAddMemberOpen(false)
            setNewMember({ name: '', phone: '', planId: '' })
            fetchMembers()
            alert("Member added successfully")
        } catch (error) {
            console.error("Failed to add member", error)
            alert("Failed to add member")
        } finally {
            setIsSubmitting(false)
        }
    }

    const fetchMembers = async () => {
        if (!currentGym) {
            // If currentGym is not available and not loading, set loading to false
            if (!isGymLoading) setLoading(false);
            return;
        }

        try {
            // Get subscriptions for this gym
            const subsRes = await subscriptionsAPI.getByGymId(currentGym.id)
            const subscriptions = subsRes.data.data || subsRes.data

            // Map to Member interface
            const mappedMembers: Member[] = subscriptions.map((sub: any) => ({
                id: sub.id,
                name: sub.user.name,
                phone: sub.user.mobileNumber || 'N/A',
                accessCode: sub.accessCode || 'PENDING',
                status: sub.status.toLowerCase(),
                lastVisit: formatTimeAgo(sub.lastCheckIn),
                planName: sub.plan.name,
                startDate: new Date(sub.startDate).toLocaleDateString(),
                endDate: new Date(sub.endDate).toLocaleDateString(),
                price: sub.plan.price
            }))

            setMembers(mappedMembers)
        } catch (error) {
            console.error("Failed to fetch members:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMembers()
    }, [currentGym, isGymLoading])

    const handleActivate = async (id: string) => {
        if (!confirm('Are you sure you want to manually activate this subscription?')) return;

        try {
            await subscriptionsAPI.activate(id);
            // Refresh list
            fetchMembers();
        } catch (error) {
            console.error("Failed to activate subscription:", error);
            alert("Failed to activate subscription");
        }
    };

    const filtered = members.filter((m) => {
        const matchesFilter = filter === "all" || m.status === filter
        const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.phone.includes(search) || m.accessCode.includes(search)
        return matchesFilter && matchesSearch
    })

    const counts = {
        all: members.length,
        active: members.filter(m => m.status === 'active').length,
        inactive: members.filter(m => m.status === 'inactive').length,
        expiring: members.filter(m => m.status === 'expiring').length,
        pending: members.filter(m => m.status === 'pending').length,
    };

    const FilterButton = ({ id, label, count }: { id: typeof filter, label: string, count: number }) => (
        <Button
            variant="ghost"
            onClick={() => setFilter(id)}
            className={`
                h-8 text-xs font-medium rounded-lg transition-all border
                ${filter === id
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-md shadow-zinc-200'
                    : 'bg-white text-zinc-500 border-zinc-200 hover:bg-zinc-50'}
            `}
        >
            {label}
            <span className={`ml-1.5 ${filter === id ? 'opacity-100 text-zinc-400' : 'opacity-50'}`}>
                {count}
            </span>
        </Button>
    )

    return (
        <div className="min-h-screen bg-[#FAFAFA] pb-28">

            {/* --- UNIFIED HEADER CARD ---
               This merges the Title, Search, and Filters into one 
               clean block at the top, removing the "disconnected" feel.
            */}
            <div className="bg-white rounded-b-[2rem] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border-b border-zinc-100 px-5 pt-8 pb-6 space-y-5">

                {/* Top Row: Title & Count */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users className="w-6 h-6 text-zinc-800" fill="currentColor" fillOpacity={0.1} />
                        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Members</h1>
                    </div>
                    <Badge variant="secondary" className="bg-zinc-100 text-zinc-500 hover:bg-zinc-100 font-bold px-3 py-1 text-xs">
                        {counts.all} Total
                    </Badge>
                </div>

                {/* Search Bar */}
                <div className="relative group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-800 transition-colors" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search name, phone, code..."
                        className="w-full pl-10 h-12 bg-zinc-50 border-zinc-200 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300 transition-all placeholder:text-zinc-400"
                    />
                </div>

                {/* Filter Row */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                    <FilterButton id="all" label="All" count={counts.all} />
                    <FilterButton id="pending" label="Pending" count={counts.pending} />
                    <FilterButton id="active" label="Active" count={counts.active} />
                    <FilterButton id="expiring" label="Expiring" count={counts.expiring} />
                    <FilterButton id="inactive" label="Inactive" count={counts.inactive} />
                </div>
            </div>


            {/* --- CONTENT LIST --- */}
            <div className="px-4 py-6 space-y-3">
                {filtered.map((member) => <MemberItem key={member.id} {...member} onActivate={handleActivate} />)}

                {filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="bg-white p-4 rounded-full mb-3 shadow-sm border border-zinc-100">
                            <Search className="h-6 w-6 text-zinc-300" />
                        </div>
                        <h3 className="text-zinc-900 font-bold text-sm">No members found</h3>
                        <p className="text-zinc-400 text-xs mt-1">Try adjusting your filters</p>
                    </div>
                )}
            </div>

            {/* Floating Action Button */}
            {/* Add Member Drawer */}
            <Drawer open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
                <DrawerTrigger asChild>
                    <div className="fixed bottom-24 right-4 z-40">
                        <Button
                            size="icon"
                            className="h-14 w-14 rounded-2xl shadow-xl shadow-zinc-900/20 bg-zinc-900 hover:bg-zinc-800 active:scale-95 transition-all border border-zinc-700"
                        >
                            <UserPlus className="h-6 w-6 text-white" strokeWidth={2} />
                        </Button>
                    </div>
                </DrawerTrigger>
                <DrawerContent>
                    <div className="mx-auto w-full max-w-sm">
                        <DrawerHeader>
                            <DrawerTitle>Add New Member</DrawerTitle>
                            <DrawerDescription>Add a new member to your gym manually.</DrawerDescription>
                        </DrawerHeader>
                        <div className="p-4 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    placeholder="John Doe"
                                    value={newMember.name}
                                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    placeholder="+91 9876543210"
                                    value={newMember.phone}
                                    onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="plan">Subscription Plan</Label>
                                <Select
                                    value={newMember.planId}
                                    onValueChange={(val) => setNewMember({ ...newMember, planId: val })}
                                >
                                    <SelectTrigger id="plan">
                                        <SelectValue placeholder="Select a plan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {plans.map((plan) => (
                                            <SelectItem key={plan.id} value={plan.id}>
                                                {plan.name} - ₹{plan.price}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DrawerFooter>
                            <Button onClick={handleAddMember} disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Add Member
                            </Button>
                            <DrawerClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    )
}