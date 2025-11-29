'use client'

import { useState } from "react"
import { 
    Search, 
    Plus, 
    MoreHorizontal, 
    Filter, 
    ArrowUpRight, 
    ArrowDownLeft, 
    Wallet, 
    CheckCircle2, 
    Clock, 
    XCircle,
    Receipt
} from "lucide-react"

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

// ---------------------------------------
// Types
// ---------------------------------------
interface Payment {
    id: number
    memberName: string
    amount: string
    date: string
    method: "UPI" | "Cash" | "Card"
    status: "success" | "pending" | "failed"
    plan: string
}

// ---------------------------------------
// Component: Payment Item
// ---------------------------------------
function PaymentItem({ memberName, amount, date, method, status, plan }: Payment) {
    const initials = memberName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    
    // Status Styles
    const statusConfig = {
        success: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50 border-emerald-100" },
        pending: { icon: Clock, color: "text-amber-500", bg: "bg-amber-50 border-amber-100" },
        failed: { icon: XCircle, color: "text-rose-500", bg: "bg-rose-50 border-rose-100" },
    }[status]

    const StatusIcon = statusConfig.icon

    return (
        <div className="group relative flex items-center justify-between p-4 bg-white border border-zinc-100 rounded-2xl shadow-sm hover:border-zinc-200 transition-all duration-200">
            
            {/* Left: Avatar & Details */}
            <div className="flex items-center gap-3.5 flex-1 min-w-0">
                {/* Avatar with Method Icon Badge */}
                <div className="relative flex-shrink-0">
                    <Avatar className="h-11 w-11 border border-zinc-50 bg-zinc-50">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${memberName}`} />
                        <AvatarFallback className="bg-zinc-100 text-zinc-600 font-bold text-xs">{initials}</AvatarFallback>
                    </Avatar>
                    {/* Payment Method Badge (Small overlap) */}
                    <div className="absolute -bottom-1 -right-1 bg-zinc-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md border-2 border-white shadow-sm">
                        {method}
                    </div>
                </div>

                {/* Text Info */}
                <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                    <h3 className="font-bold text-sm text-zinc-900 truncate leading-tight">{memberName}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
                        <span className="truncate">{plan}</span>
                        <span className="text-zinc-300">•</span>
                        <span>{date}</span>
                    </div>
                </div>
            </div>

            {/* Right: Amount, Status, Menu */}
            <div className="flex items-center gap-3">
                
                {/* Amount & Status Icon */}
                <div className="text-right">
                    <div className="font-bold text-zinc-900 text-sm">{amount}</div>
                    <div className={`flex items-center justify-end gap-1 text-[10px] font-semibold uppercase tracking-wide ${statusConfig.color}`}>
                        <span>{status}</span>
                    </div>
                </div>

                {/* Actions */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-300 hover:text-zinc-600 hover:bg-zinc-50 -mr-2">
                            <MoreHorizontal className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-xl p-1">
                        <DropdownMenuItem className="cursor-pointer text-xs font-medium rounded-lg h-9">
                            <Receipt className="w-4 h-4 mr-2" /> View Receipt
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer text-xs font-medium rounded-lg h-9">
                            <ArrowUpRight className="w-4 h-4 mr-2" /> Share Invoice
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-rose-600 focus:text-rose-600 focus:bg-rose-50 cursor-pointer text-xs font-medium rounded-lg h-9">
                            Refund Payment
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

// ---------------------------------------
// Main Payments Page
// ---------------------------------------
export default function PaymentsPage() {
    const [filter, setFilter] = useState<"all" | "success" | "pending" | "failed">("all")
    const [search, setSearch] = useState("")

    // Mock Data
    const transactions: Payment[] = [
        { id: 1, memberName: "Rohan Sharma", amount: "+ ₹4,500", date: "Today, 10:30 AM", method: "UPI", status: "success", plan: "Quarterly Gold" },
        { id: 2, memberName: "Simran Kaur", amount: "+ ₹12,000", date: "Yesterday", method: "Card", status: "success", plan: "Yearly Platinum" },
        { id: 3, memberName: "Karan Mehta", amount: "₹1,500", date: "Oct 24", method: "Cash", status: "pending", plan: "Monthly Silver" },
        { id: 4, memberName: "Aman Gupta", amount: "₹4,500", date: "Oct 22", method: "UPI", status: "failed", plan: "Quarterly Gold" },
        { id: 5, memberName: "Priya Singh", amount: "+ ₹800", date: "Oct 20", method: "UPI", status: "success", plan: "Personal Training" },
    ]

    const filtered = transactions.filter((t) => {
        const matchesFilter = filter === "all" || t.status === filter
        const matchesSearch = t.memberName.toLowerCase().includes(search.toLowerCase())
        return matchesFilter && matchesSearch
    })

    const counts = {
        all: transactions.length,
        success: transactions.filter(t => t.status === 'success').length,
        pending: transactions.filter(t => t.status === 'pending').length,
        failed: transactions.filter(t => t.status === 'failed').length,
    };

    // Helper for Filters
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
            
            {/* --- UNIFIED HEADER CARD --- */}
            <div className="bg-white rounded-b-[2rem] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border-b border-zinc-100 px-5 pt-8 pb-6 space-y-5">
                
                {/* Top Row: Title & Total Revenue Badge */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-900">
                            <Wallet className="w-4 h-4" strokeWidth={2.5} />
                        </div>
                        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Payments</h1>
                    </div>
                    
                    {/* Total Revenue Highlight */}
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">This Month</p>
                        <p className="text-lg font-bold text-emerald-600 leading-none">₹42.5k</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-800 transition-colors" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or transaction ID..."
                        className="w-full pl-10 h-12 bg-zinc-50 border-zinc-200 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300 transition-all placeholder:text-zinc-400" 
                    />
                </div>

                {/* Filter Row */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                    <FilterButton id="all" label="All" count={counts.all} />
                    <FilterButton id="success" label="Completed" count={counts.success} />
                    <FilterButton id="pending" label="Pending" count={counts.pending} />
                    <FilterButton id="failed" label="Failed" count={counts.failed} />
                </div>
            </div>


            {/* --- CONTENT LIST --- */}
            <div className="px-4 py-6 space-y-3">
                {/* Date Heading Example (Optional) */}
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider px-2">Recent Transactions</h3>
                
                {filtered.map((item) => <PaymentItem key={item.id} {...item} />)}
                
                {filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="bg-white p-4 rounded-full mb-3 shadow-sm border border-zinc-100">
                            <Receipt className="h-6 w-6 text-zinc-300" />
                        </div>
                        <h3 className="text-zinc-900 font-bold text-sm">No payments found</h3>
                        <p className="text-zinc-400 text-xs mt-1">Try changing the filters</p>
                    </div>
                )}
            </div>

            {/* Floating Action Button (Record Payment) */}
            <div className="fixed bottom-24 right-4 z-40">
                <Button 
                    size="icon" 
                    className="h-14 w-14 rounded-2xl shadow-xl shadow-zinc-900/20 bg-zinc-900 hover:bg-zinc-800 active:scale-95 transition-all border border-zinc-700"
                >
                    <Plus className="h-6 w-6 text-white" strokeWidth={2} />
                </Button>
            </div>
        </div>
    )
}