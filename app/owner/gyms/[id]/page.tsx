'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { gymsAPI, plansAPI } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { ChevronLeft, Plus, Edit, Trash2, IndianRupee } from 'lucide-react';

interface Gym {
    id: string;
    name: string;
    address: string;
    isVerified: boolean;
}

interface Plan {
    id: string;
    name: string;
    description: string;
    durationValue: number;
    durationUnit: string;
    price: number;
    isActive: boolean;
}

export default function GymDetailsPage() {
    const params = useParams();
    const gymId = params.id as string;
    const router = useRouter();

    const [gym, setGym] = useState<Gym | null>(null);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [gymRes, plansRes] = await Promise.all([
                gymsAPI.getById(gymId),
                plansAPI.getByGymId(gymId)
            ]);

            setGym(gymRes.data.data);
            setPlans(plansRes.data.data || []);
        } catch (err) {
            console.error('Failed to fetch data:', err);
            setError('Failed to load gym details.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (gymId) {
            fetchData();
        }
    }, [gymId]);

    const handleDeletePlan = async (planId: string) => {
        if (!confirm('Are you sure you want to delete this plan?')) return;
        try {
            await plansAPI.delete(planId);
            setPlans(plans.filter(p => p.id !== planId));
        } catch (err) {
            console.error('Failed to delete plan:', err);
            alert('Failed to delete plan');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Spinner className="w-8 h-8" />
            </div>
        );
    }

    if (error || !gym) {
        return (
            <div className="container mx-auto p-4 text-center">
                <p className="text-red-600 mb-4">{error || 'Gym not found'}</p>
                <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 pb-24 space-y-8">
            {/* Header */}
            <div className="space-y-4">
                <Button variant="ghost" className="pl-0" onClick={() => router.push('/owner/gyms')}>
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back to Gyms
                </Button>

                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{gym.name}</h1>
                        <p className="text-muted-foreground mt-1">{gym.address}</p>
                        <div className="mt-2">
                            {gym.isVerified ? (
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">Verified Gym</span>
                            ) : (
                                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">Verification Pending</span>
                            )}
                        </div>
                    </div>
                    <Button variant="outline" onClick={() => router.push(`/owner/gyms/${gymId}/edit`)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Gym
                    </Button>
                </div>
            </div>

            {/* Plans Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">Membership Plans</h2>
                    <Button onClick={() => router.push(`/owner/gyms/${gymId}/plans/create`)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Plan
                    </Button>
                </div>

                {plans.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <h3 className="text-lg font-medium text-gray-900">No plans yet</h3>
                        <p className="text-gray-500 mt-1 mb-4">Create membership plans for your customers.</p>
                        <Button variant="outline" onClick={() => router.push(`/owner/gyms/${gymId}/plans/create`)}>
                            Create First Plan
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {plans.map((plan) => (
                            <Card key={plan.id} className={`flex flex-col ${!plan.isActive ? 'opacity-60' : ''}`}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                                        <span className="text-lg font-bold flex items-center">
                                            <IndianRupee className="w-4 h-4" />
                                            {plan.price}
                                        </span>
                                    </div>
                                    <CardDescription>
                                        {plan.durationValue} {plan.durationUnit}(s)
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <p className="text-sm text-gray-600">{plan.description}</p>
                                    {!plan.isActive && (
                                        <p className="text-xs text-red-500 font-medium mt-2">Inactive</p>
                                    )}
                                </CardContent>
                                <CardFooter className="flex justify-end gap-2 border-t pt-4">
                                    <Button variant="ghost" size="icon" onClick={() => router.push(`/owner/gyms/${gymId}/plans/${plan.id}/edit`)}>
                                        <Edit className="w-4 h-4 text-gray-500" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDeletePlan(plan.id)}>
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
