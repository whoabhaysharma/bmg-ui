'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { gymsAPI, plansAPI, subscriptionsAPI } from '@/lib/api/client';
import { Loader2, MapPin, Check, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast'; // Assuming we have this or I'll use alert

interface Gym {
    id: string;
    name: string;
    address?: string;
}

interface Plan {
    id: string;
    name: string;
    description?: string;
    price: number;
    durationValue: number;
    durationUnit: string;
}

export default function GymDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const gymId = params.id as string;

    const [gym, setGym] = useState<Gym | null>(null);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [purchasing, setPurchasing] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const gymRes = await gymsAPI.getById(gymId);
                setGym(gymRes.data.data || gymRes.data);

                const plansRes = await plansAPI.getActiveByGymId(gymId);
                setPlans(plansRes.data.data || plansRes.data);
            } catch (error) {
                console.error("Failed to fetch gym details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (gymId) fetchData();
    }, [gymId]);

    const handleBuyPlan = async (planId: string) => {
        setPurchasing(planId);
        try {
            // 1. Create Subscription & Order
            const res = await subscriptionsAPI.create({
                gymId,
                planId
            });

            const { order } = res.data.data || res.data;

            // 2. Ideally, open Razorpay here using 'order.id'
            // For now, we'll simulate a success or show an alert
            alert(`Order Created! Order ID: ${order.id}\n\n(In a real app, Razorpay checkout would open here.)`);

            // Redirect to dashboard
            router.push('/user/dashboard');

        } catch (error: any) {
            console.error("Failed to purchase plan:", error);
            alert(error.response?.data?.error || 'Failed to initiate purchase');
        } finally {
            setPurchasing(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-300" />
            </div>
        );
    }

    if (!gym) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FA] gap-4">
                <p className="text-zinc-500">Gym not found.</p>
                <Button onClick={() => router.back()} variant="outline">Go Back</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F9FA] pb-24">
            {/* Hero Image Area */}
            <div className="h-64 bg-zinc-900 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent opacity-80"></div>
                <div className="absolute top-6 left-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/20 rounded-full"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h1 className="text-3xl font-bold text-white mb-2">{gym.name}</h1>
                    <div className="flex items-center gap-2 text-zinc-300 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{gym.address || 'No address provided'}</span>
                    </div>
                </div>
            </div>

            <div className="px-4 py-6 max-w-md mx-auto space-y-8">

                {/* About Section */}
                <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
                    <h3 className="font-bold text-zinc-900 text-lg mb-3">About</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed">
                        Welcome to {gym.name}! We offer state-of-the-art equipment and professional trainers to help you achieve your fitness goals.
                    </p>
                    <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                        {['WiFi', 'AC', 'Showers', 'Parking'].map((amenity) => (
                            <Badge key={amenity} variant="secondary" className="bg-zinc-100 text-zinc-600 hover:bg-zinc-200">
                                {amenity}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Membership Plans */}
                <div>
                    <h3 className="font-bold text-zinc-900 text-lg mb-4 px-2">Membership Plans</h3>
                    <div className="space-y-4">
                        {plans.length > 0 ? (
                            plans.map((plan) => (
                                <div key={plan.id} className="bg-white p-5 rounded-3xl border border-zinc-100 shadow-sm relative overflow-hidden">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-bold text-zinc-900 text-lg">{plan.name}</h4>
                                            <p className="text-zinc-400 text-xs uppercase tracking-wider font-bold">
                                                {plan.durationValue} {plan.durationUnit}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-2xl font-bold text-zinc-900">₹{plan.price}</span>
                                        </div>
                                    </div>

                                    {plan.description && (
                                        <p className="text-zinc-500 text-sm mt-2 mb-4 line-clamp-2">{plan.description}</p>
                                    )}

                                    <div className="space-y-2 mb-5">
                                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                                            <Check className="w-3.5 h-3.5 text-green-500" />
                                            <span>Full Gym Access</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                                            <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                                            <span>No Hidden Fees</span>
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full h-12 rounded-xl text-base font-bold bg-zinc-900 hover:bg-zinc-800 shadow-lg shadow-zinc-200"
                                        onClick={() => handleBuyPlan(plan.id)}
                                        disabled={!!purchasing}
                                    >
                                        {purchasing === plan.id ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            'Choose Plan'
                                        )}
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-zinc-400">
                                No active plans available.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
