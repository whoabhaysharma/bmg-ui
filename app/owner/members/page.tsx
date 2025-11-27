'use client';

import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Search, 
  Plus, 
  MoreVertical, 
  CreditCard,
  AlertCircle,
  Loader2,
  User
} from 'lucide-react';

const useRouter = () => ({ 
  push: (path: string) => console.log(`Navigating to: ${path}`),
  back: () => console.log('Going back')
});
const useParams = () => ({ id: '1' });

// Mock Data Generation
const MOCK_MEMBERS = [
  { id: '1', name: 'Arjun Mehta', accessCode: 'AM-9021', plan: 'Annual Elite', status: 'active', expiryDate: '2024-12-15' },
  { id: '2', name: 'Priya Sharma', accessCode: 'PS-3321', plan: 'Monthly Silver', status: 'expiring', expiryDate: '2023-11-30' },
  { id: '3', name: 'Rahul Verma', accessCode: 'RV-1102', plan: 'Quarterly Gold', status: 'inactive', expiryDate: '2023-10-01' },
  { id: '4', name: 'Sneha Gupta', accessCode: 'SG-5543', plan: 'Monthly Silver', status: 'active', expiryDate: '2024-01-20' },
  { id: '5', name: 'Vikram Singh', accessCode: 'VS-8877', plan: 'Annual Elite', status: 'expiring', expiryDate: '2023-11-28' },
];

// Simplified Components for Preview
const Button = ({ children, variant = 'primary', size = 'default', className = '', ...props }: any) => {
  const baseClass = "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
  const variants: any = {
    primary: "bg-zinc-900 text-white hover:bg-zinc-800 shadow",
    secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 shadow-sm",
    ghost: "hover:bg-zinc-100 hover:text-zinc-900",
    outline: "border border-zinc-200 bg-transparent hover:bg-zinc-50 text-zinc-900",
  };
  const sizes: any = {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-xs",
    icon: "h-9 w-9",
  };
  return <button className={`${baseClass} ${variants[variant] || variants.primary} ${sizes[size] || sizes.default} ${className}`} {...props}>{children}</button>;
};

const Input = ({ className = '', ...props }: any) => (
  <input className={`flex h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props} />
);

const Badge = ({ variant = 'default', className = '', children, onClick }: any) => {
  const variants: any = {
    default: "border-transparent bg-zinc-900 text-zinc-50 hover:bg-zinc-900/80",
    secondary: "border-transparent bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
    destructive: "border-transparent bg-red-500 text-zinc-50 hover:bg-red-500/80",
    outline: "text-zinc-500 border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900",
    // Status specific
    active: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200",
    expiring: "bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200",
    inactive: "bg-red-100 text-red-700 hover:bg-red-200 border-red-200",
  };
  
  return (
    <div 
      onClick={onClick}
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer ${variants[variant]} ${className}`}
    >
      {children}
    </div>
  );
};

// ----------------------------------------------------------------

export default function MembersPage() {
    const router = useRouter();
    const params = useParams();
    
    const [members, setMembers] = useState(MOCK_MEMBERS);
    const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'inactive' | 'expiring'
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate fetch
        setTimeout(() => setIsLoading(false), 600);
    }, []);

    // Filter Logic
    const filteredMembers = members.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(search.toLowerCase()) || 
                              member.accessCode.toLowerCase().includes(search.toLowerCase());
        
        if (!matchesSearch) return false;

        if (filter === 'all') return true;
        return member.status === filter;
    });

    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0,2);

    // Status Styling Helper
    const getStatusColor = (status: string) => {
        switch(status) {
            case 'active': return 'bg-emerald-500';
            case 'expiring': return 'bg-amber-500';
            case 'inactive': return 'bg-red-500';
            default: return 'bg-zinc-300';
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-900" />
                <p className="text-zinc-500 text-sm">Loading member list...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-white pb-24">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-zinc-100">
                <div className="flex items-center justify-between px-4 py-3">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="-ml-2">
                        <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <span className="font-semibold text-sm">Members</span>
                    <Button variant="ghost" size="icon">
                        <MoreVertical className="w-5 h-5 text-zinc-600" />
                    </Button>
                </div>
                
                {/* Search */}
                <div className="px-4 pb-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input 
                            placeholder="Search by name or code..." 
                            value={search}
                            onChange={(e: any) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>

                {/* Filters (Horizontal Scroll) */}
                <div className="px-4 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
                    <Badge 
                        variant={filter === 'all' ? 'default' : 'outline'} 
                        onClick={() => setFilter('all')}
                    >
                        All Members
                    </Badge>
                    <Badge 
                        variant={filter === 'active' ? 'active' : 'outline'}
                        className={filter !== 'active' ? 'hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200' : ''}
                        onClick={() => setFilter('active')}
                    >
                        Active
                    </Badge>
                    <Badge 
                        variant={filter === 'expiring' ? 'expiring' : 'outline'}
                        className={filter !== 'expiring' ? 'hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200' : ''}
                        onClick={() => setFilter('expiring')}
                    >
                        Expiring Soon
                    </Badge>
                    <Badge 
                        variant={filter === 'inactive' ? 'inactive' : 'outline'}
                        className={filter !== 'inactive' ? 'hover:bg-red-50 hover:text-red-700 hover:border-red-200' : ''}
                        onClick={() => setFilter('inactive')}
                    >
                        Inactive
                    </Badge>
                </div>
            </div>

            {/* List Content */}
            <div className="p-4 space-y-3">
                {filteredMembers.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-3">
                            <User className="w-8 h-8 text-zinc-300" />
                        </div>
                        <h3 className="text-zinc-900 font-medium">No members found</h3>
                        <p className="text-zinc-500 text-sm">Try adjusting your filters.</p>
                    </div>
                ) : (
                    filteredMembers.map((member) => (
                        <div 
                            key={member.id} 
                            onClick={() => router.push(`/owner/gyms/${params.id}/members/${member.id}`)}
                            className="group flex items-center p-3 rounded-2xl border border-zinc-100 shadow-sm bg-white active:scale-[0.99] transition-all cursor-pointer"
                        >
                            {/* Avatar */}
                            <div className="relative">
                                <div className="h-12 w-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-700 font-bold text-sm">
                                    {getInitials(member.name)}
                                </div>
                                {/* Status Indicator Dot */}
                                <div className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white ${getStatusColor(member.status)}`}></div>
                            </div>

                            {/* Info */}
                            <div className="ml-3 flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-semibold text-zinc-900 truncate">{member.name}</h3>
                                    <span className="font-mono text-xs font-medium bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded">
                                        {member.accessCode}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
                                    <div className="flex items-center gap-1">
                                        <CreditCard className="w-3 h-3" />
                                        <span className="truncate max-w-[80px] sm:max-w-none">{member.plan}</span>
                                    </div>
                                    {member.status === 'expiring' && (
                                        <div className="flex items-center gap-1 text-amber-600 font-medium">
                                            <AlertCircle className="w-3 h-3" />
                                            <span>Exp: {member.expiryDate}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Floating Action Button */}
            <button 
                onClick={() => router.push(`/owner/gyms/${params.id}/members/create`)}
                className="fixed bottom-24 right-6 h-14 w-14 bg-zinc-900 text-white rounded-full shadow-lg shadow-zinc-900/20 flex items-center justify-center hover:scale-105 transition-transform active:scale-95 z-30"
            >
                <Plus className="w-6 h-6" />
            </button>
        </div>
    );
}