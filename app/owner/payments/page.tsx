'use client';

import React, { useEffect, useState } from 'react';
import { gymsAPI, paymentsAPI } from '@/lib/api/client';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Receipt, Calendar, User, CreditCard } from 'lucide-react';

interface Gym {
    id: string;
    name: string;
}

interface UserData {
    id: string;
    name: string;
}

interface Payment {
    id: string;
    user: UserData;
    amount: number;
    currency: string;
    status: string;
    createdAt: string;
    method?: string;
}

export default function PaymentsPage() {
    const [gyms, setGyms] = useState<Gym[]>([]);
    const [selectedGymId, setSelectedGymId] = useState<string>('');
    const [payments, setPayments] = useState<Payment[]>([]);
    const [isLoadingGyms, setIsLoadingGyms] = useState(true);
    const [isLoadingPayments, setIsLoadingPayments] = useState(false);
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

        const fetchPayments = async () => {
            setIsLoadingPayments(true);
            try {
                const response = await paymentsAPI.getByGymId(selectedGymId);
                setPayments(response.data.data || []);
            } catch (err) {
                console.error('Failed to fetch payments', err);
                setPayments([]);
            } finally {
                setIsLoadingPayments(false);
            }
        };
        fetchPayments();
    }, [selectedGymId]);

    const formatAmount = (amount: number, currency: string = 'INR') => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: currency
        }).format(amount / 100);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isLoadingGyms) {
        return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
    }

    if (gyms.length === 0) {
        return (
            <div className="container mx-auto p-6 text-center">
                <h1 className="text-2xl font-bold mb-4">Payments</h1>
                <p className="mb-4">You need to create a gym to view payments.</p>
                <Button onClick={() => router.push('/owner/gyms/create')}>Create Gym</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
                    <p className="text-muted-foreground">Track revenue and transactions</p>
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

            {isLoadingPayments ? (
                <div className="flex justify-center p-12"><Spinner /></div>
            ) : payments.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <h3 className="text-lg font-medium text-gray-900">No payments</h3>
                    <p className="text-gray-500 mt-1">Transaction history will appear here.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {payments.map((payment) => (
                        <Card key={payment.id}>
                            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-full ${
                                        payment.status === 'captured' || payment.status === 'success' ? 'bg-green-100' : 'bg-yellow-100'
                                    }`}>
                                        <Receipt className={`h-5 w-5 ${
                                            payment.status === 'captured' || payment.status === 'success' ? 'text-green-600' : 'text-yellow-600'
                                        }`} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-lg">{formatAmount(payment.amount, payment.currency)}</p>
                                        <div className="flex items-center text-sm text-gray-500 mt-1">
                                            <User className="h-3 w-3 mr-1" />
                                            {payment.user?.name || 'Unknown User'}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-left sm:text-right space-y-1">
                                    <div className="flex items-center sm:justify-end text-sm text-gray-500">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {formatDate(payment.createdAt)}
                                    </div>
                                    <div className="flex items-center sm:justify-end text-xs text-gray-400">
                                        <CreditCard className="h-3 w-3 mr-1" />
                                        {payment.method || 'Razorpay'} • {payment.status}
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
