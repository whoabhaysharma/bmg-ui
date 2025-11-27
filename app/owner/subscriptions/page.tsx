'use client';

import React, { useEffect, useState } from 'react';
import { gymsAPI, subscriptionsAPI } from '@/lib/api/client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { CreditCard, Calendar, User } from 'lucide-react';

interface Gym {
    id: string;
    name: string;
}

interface Plan {
    id: string;
    name: string;
    price: number;
}

interface UserData {
    id: string;
    name: string;
}

interface Subscription {
    id: string;
    user: UserData;
    plan: Plan;
    status: string;
    startDate: string;
    endDate: string;
    createdAt: string;
}

export default function SubscriptionsPage() {
    const [gyms, setGyms] = useState<Gym[]>([]);
    const [selectedGymId, setSelectedGymId] = useState<string>('');
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [isLoadingGyms, setIsLoadingGyms] = useState(true);
    const [isLoadingSubs, setIsLoadingSubs] = useState(false);
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

        const fetchSubscriptions = async () => {
            setIsLoadingSubs(true);
            try {
                const response = await subscriptionsAPI.getByGymId(selectedGymId);
                setSubscriptions(response.data.data || []);
            } catch (err) {
                console.error('Failed to fetch subscriptions', err);
                setSubscriptions([]);
            } finally {
                setIsLoadingSubs(false);
            }
        };
        fetchSubscriptions();
    }, [selectedGymId]);

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(price / 100);
    };

    if (isLoadingGyms) {
        return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
    }

    if (gyms.length === 0) {
        return (
            <div className="container mx-auto p-6 text-center">
                <h1 className="text-2xl font-bold mb-4">Subscriptions</h1>
                <p className="mb-4">You need to create a gym to view subscriptions.</p>
                <Button onClick={() => router.push('/owner/gyms/create')}>Create Gym</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
                    <p className="text-muted-foreground">View all subscriptions for your gym</p>
                </div>
                <div className="w-full md:w-auto">
                    <select
                        className="flex h-10 w-full md:w-[200px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                        value={selectedGymId}
                        onChange={(e) => setSelectedGymId(e.target.value)}
                    >
                        {gyms.map(gym => (
                            <option key={gym.id} value={gym.id}>{gym.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {isLoadingSubs ? (
                <div className="flex justify-center p-12"><Spinner /></div>
            ) : subscriptions.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <h3 className="text-lg font-medium text-gray-900">No subscriptions</h3>
                    <p className="text-gray-500 mt-1">No subscriptions found for this gym.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {subscriptions.map((sub) => (
                        <Card key={sub.id}>
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-lg">{sub.plan?.name || 'Unknown Plan'}</h3>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                sub.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                                sub.status === 'EXPIRED' ? 'bg-gray-100 text-gray-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {sub.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500 gap-4">
                                            <span className="flex items-center">
                                                <User className="w-3 h-3 mr-1" />
                                                {sub.user?.name || 'Unknown User'}
                                            </span>
                                            <span className="flex items-center">
                                                <CreditCard className="w-3 h-3 mr-1" />
                                                {sub.plan?.price ? formatPrice(sub.plan.price) : '-'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-500 flex flex-col md:items-end">
                                        <div className="flex items-center">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            Start: {formatDate(sub.startDate)}
                                        </div>
                                        <div className="flex items-center">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            End: {formatDate(sub.endDate)}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
