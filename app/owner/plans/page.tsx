'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { gymsAPI, plansAPI } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';

interface Gym {
    id: string;
    name: string;
}

interface Plan {
    id: string;
    name: string;
    description: string;
    price: number;
    durationValue: number;
    durationUnit: string;
    isActive: boolean;
}

export default function PlansPage() {
    const [gyms, setGyms] = useState<Gym[]>([]);
    const [selectedGymId, setSelectedGymId] = useState<string>('');
    const [plans, setPlans] = useState<Plan[]>([]);
    const [isLoadingGyms, setIsLoadingGyms] = useState(true);
    const [isLoadingPlans, setIsLoadingPlans] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchGyms = async () => {
            try {
                const response = await gymsAPI.getMyOwned();
                const gymList = response.data.data || [];
                setGyms(gymList);
                if (gymList.length > 0) {
                    setSelectedGymId(gymList[0].id);
                }
            } catch (err) {
                console.error('Failed to fetch gyms', err);
            } finally {
                setIsLoadingGyms(false);
            }
        };
        fetchGyms();
    }, []);

    useEffect(() => {
        if (!selectedGymId) return;

        const fetchPlans = async () => {
            setIsLoadingPlans(true);
            try {
                const response = await plansAPI.getByGymId(selectedGymId);
                setPlans(response.data.data || []);
            } catch (err) {
                console.error('Failed to fetch plans', err);
            } finally {
                setIsLoadingPlans(false);
            }
        };
        fetchPlans();
    }, [selectedGymId]);

    const handleDelete = async (planId: string) => {
        if (!confirm('Are you sure you want to delete this plan?')) return;
        try {
            await plansAPI.delete(planId);
            setPlans(plans.filter(p => p.id !== planId));
        } catch (err) {
            console.error('Failed to delete plan', err);
            alert('Failed to delete plan');
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(price / 100); // Assuming price is in smallest unit
    };

    if (isLoadingGyms) {
        return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
    }

    if (gyms.length === 0) {
        return (
            <div className="container mx-auto p-6 text-center">
                <h1 className="text-2xl font-bold mb-4">Plans</h1>
                <p className="mb-4">You need to create a gym before managing plans.</p>
                <Button onClick={() => router.push('/owner/gyms/create')}>Create Gym</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Plans</h1>
                    <p className="text-muted-foreground">Manage subscription plans for your gym</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <select
                        className="flex h-10 w-full md:w-[200px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={selectedGymId}
                        onChange={(e) => setSelectedGymId(e.target.value)}
                    >
                        {gyms.map(gym => (
                            <option key={gym.id} value={gym.id}>{gym.name}</option>
                        ))}
                    </select>
                    <Button onClick={() => router.push(`/owner/plans/create?gymId=${selectedGymId}`)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Plan
                    </Button>
                </div>
            </div>

            {isLoadingPlans ? (
                <div className="flex justify-center p-12"><Spinner /></div>
            ) : plans.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <h3 className="text-lg font-medium text-gray-900">No plans found</h3>
                    <p className="text-gray-500 mt-1 mb-4">Create your first subscription plan.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {plans.map((plan) => (
                        <Card key={plan.id}>
                            <CardHeader>
                                <div className="flex justify-between">
                                    <CardTitle>{plan.name}</CardTitle>
                                    {plan.isActive ?
                                        <CheckCircle className="text-green-500 w-5 h-5" /> :
                                        <XCircle className="text-red-500 w-5 h-5" />
                                    }
                                </div>
                                <CardDescription>{plan.durationValue} {plan.durationUnit}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{formatPrice(plan.price)}</p>
                                <p className="text-sm text-gray-500 mt-2">{plan.description}</p>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => router.push(`/owner/plans/${plan.id}/edit`)}>
                                    <Edit className="w-4 h-4 text-gray-500" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(plan.id)}>
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
