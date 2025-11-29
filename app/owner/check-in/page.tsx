'use client'

import { useState } from "react"
import { 
    QrCode, 
    Search, 
    CheckCircle2, 
    XCircle, 
    History, 
    User, 
    CalendarClock, 
    ChevronRight,
    ScanLine
} from "lucide-react"

// SHADCN / UI Imports
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

// ---------------------------------------
// Types
// ---------------------------------------
type CheckInStatus = 'idle' | 'loading' | 'success' | 'error' | 'expired'

interface MemberDetails {
    id: string
    name: string
    plan: string
    expiryDate: string
    daysLeft: number
    status: 'active' | 'expired'
    lastVisit: string
    photo: string
}

// ---------------------------------------
// Mock Database
// ---------------------------------------
const MOCK_DB: Record<string, MemberDetails> = {
    "4829": {
        id: "1",
        name: "Rohan Sharma",
        plan: "Gold Quarterly",
        expiryDate: "2024-12-15",
        daysLeft: 18,
        status: "active",
        lastVisit: "2 days ago",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan"
    },
    "5522": {
        id: "2",
        name: "Simran Kaur",
        plan: "Silver Monthly",
        expiryDate: "2023-11-01",
        daysLeft: -26,
        status: "expired",
        lastVisit: "1 month ago",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Simran"
    }
}

// ---------------------------------------
// Main Page Component
// ---------------------------------------
export default function CheckInPage() {
    const [accessCode, setAccessCode] = useState("")
    const [status, setStatus] = useState<CheckInStatus>('idle')
    const [member, setMember] = useState<MemberDetails | null>(null)

    const handleCheckIn = (e: React.FormEvent) => {
        e.preventDefault()
        if (!accessCode) return

        setStatus('loading')
        setMember(null)

        // Simulate API delay
        setTimeout(() => {
            const foundMember = MOCK_DB[accessCode]
            
            if (foundMember) {
                setMember(foundMember)
                if (foundMember.status === 'active') {
                    setStatus('success')
                } else {
                    setStatus('expired')
                }
            } else {
                setStatus('error')
            }
        }, 600)
    }

    const resetForm = () => {
        setAccessCode("")
        setStatus('idle')
        setMember(null)
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] pb-28">
            
            {/* --- UNIFIED HEADER --- */}
            <div className="bg-white rounded-b-[2rem] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border-b border-zinc-100 px-5 pt-8 pb-8 space-y-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-zinc-900 flex items-center justify-center text-white shadow-lg shadow-zinc-200">
                        <ScanLine className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight leading-none">Check-in</h1>
                        <p className="text-xs text-zinc-400 font-medium mt-1">Verify access & log attendance</p>
                    </div>
                </div>
            </div>

            {/* --- MAIN ACTION AREA --- */}
            <div className="px-4 py-6 -mt-4 relative z-10">
                
                {/* Input Card */}
                <Card className="p-6 rounded-3xl border-zinc-100 shadow-xl shadow-zinc-200/40 bg-white">
                    <form onSubmit={handleCheckIn} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">
                                Enter Access Code
                            </label>
                            <div className="relative">
                                <QrCode className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-300" />
                                <Input 
                                    autoFocus
                                    type="number" // Numeric keypad on mobile
                                    value={accessCode}
                                    onChange={(e) => {
                                        const val = e.target.value
                                        // Enforce max length of 6 digits
                                        if (val.length <= 6) {
                                            setAccessCode(val)
                                            if(status !== 'idle') setStatus('idle') // Reset on type
                                        }
                                    }}
                                    placeholder="e.g. 123456"
                                    className="pl-12 h-14 text-lg font-bold tracking-widest bg-zinc-50 border-zinc-200 rounded-2xl focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300 transition-all placeholder:tracking-normal placeholder:font-medium placeholder:text-zinc-400"
                                />
                            </div>
                        </div>
                        
                        <Button 
                            disabled={status === 'loading' || !accessCode || accessCode.length < 4}
                            className={`w-full h-12 rounded-xl text-base font-bold shadow-lg transition-all
                                ${status === 'loading' ? 'bg-zinc-100 text-zinc-400' : 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-zinc-900/20'}
                            `}
                        >
                            {status === 'loading' ? 'Verifying...' : 'Check In Member'}
                        </Button>
                    </form>
                </Card>

                {/* --- FEEDBACK STATES --- */}
                <div className="mt-6">
                    
                    {/* SUCCESS STATE */}
                    {status === 'success' && member && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-3xl relative overflow-hidden">
                                {/* Success Icon Watermark */}
                                <CheckCircle2 className="absolute -right-4 -bottom-4 w-24 h-24 text-emerald-100/50" />
                                
                                <div className="flex items-center gap-4 relative z-10">
                                    <Avatar className="h-16 w-16 border-4 border-white shadow-sm">
                                        <AvatarImage src={member.photo} />
                                        <AvatarFallback>M</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <Badge className="bg-emerald-500 hover:bg-emerald-600 border-none text-white mb-1">Access Granted</Badge>
                                        <h2 className="text-xl font-bold text-zinc-900">{member.name}</h2>
                                        <p className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                                            <CalendarClock className="w-3 h-3" /> Last visit: {member.lastVisit}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-emerald-200/50 grid grid-cols-2 gap-4 relative z-10">
                                    <div>
                                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Plan</p>
                                        <p className="font-bold text-zinc-800 text-sm">{member.plan}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Expires In</p>
                                        <p className="font-bold text-zinc-800 text-sm">{member.daysLeft} Days</p>
                                    </div>
                                </div>
                                
                                <Button onClick={resetForm} variant="ghost" className="absolute top-2 right-2 h-8 w-8 p-0 text-emerald-700 hover:bg-emerald-100 rounded-full">
                                    <XCircle className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* EXPIRED STATE */}
                    {status === 'expired' && member && (
                         <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-amber-50 border border-amber-100 p-5 rounded-3xl relative overflow-hidden">
                                <div className="flex items-center gap-4 relative z-10">
                                    <Avatar className="h-16 w-16 border-4 border-white grayscale opacity-80">
                                        <AvatarImage src={member.photo} />
                                        <AvatarFallback>M</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <Badge variant="destructive" className="bg-amber-500 hover:bg-amber-600 border-none text-white mb-1">Plan Expired</Badge>
                                        <h2 className="text-xl font-bold text-zinc-900">{member.name}</h2>
                                        <p className="text-xs text-amber-700 font-medium">
                                            Expired on {member.expiryDate}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-amber-200/50 relative z-10">
                                    <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-sm">
                                        Renew Subscription
                                    </Button>
                                </div>
                                <Button onClick={resetForm} variant="ghost" className="absolute top-2 right-2 h-8 w-8 p-0 text-amber-700 hover:bg-amber-100 rounded-full">
                                    <XCircle className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* ERROR STATE */}
                    {status === 'error' && (
                        <div className="animate-in shake duration-300">
                            <div className="bg-rose-50 border border-rose-100 p-5 rounded-3xl text-center">
                                <div className="w-12 h-12 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <XCircle className="w-6 h-6" />
                                </div>
                                <h3 className="text-zinc-900 font-bold">Invalid Code</h3>
                                <p className="text-sm text-rose-600/80 mt-1">
                                    No member found with code <span className="font-mono font-bold">{accessCode}</span>
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* --- RECENT ACTIVITY (Only shown when idle or loading) --- */}
                {status !== 'success' && status !== 'expired' && (
                    <div className="mt-8 space-y-4">
                        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider px-2">Recent Check-ins</h3>
                        <div className="space-y-3 opacity-60 grayscale-[0.3]">
                            {[1, 2].map((i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-white border border-zinc-100 rounded-2xl shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9 border border-zinc-100 bg-zinc-50">
                                            <AvatarFallback className="text-xs font-bold text-zinc-400">U{i}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-bold text-zinc-900">Recent User {i}</p>
                                            <p className="text-[10px] text-zinc-400 font-medium">10:4{i} AM</p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="text-[10px] text-emerald-600 bg-emerald-50 border-emerald-100">
                                        Active
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}