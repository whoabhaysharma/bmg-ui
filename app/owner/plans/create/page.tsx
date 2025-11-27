'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { plansAPI, gymsAPI } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { ChevronLeft } from 'lucide-react';

export default function CreatePlanPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialGymId = searchParams.get('gymId') || '';

    const [gyms, setGyms] = useState<{ id: string, name: string }[]>([]);
    const [formData, setFormData] = useState({
        gymId: initialGymId,
        name: '',
        description: '',
        durationValue: 1,
        durationUnit: 'MONTH',
        price: 0
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingGyms, setIsFetchingGyms] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGyms = async () => {
            try {
                const response = await gymsAPI.getMyOwned();
                const gymList = response.data.data || [];
                setGyms(gymList);
                if (gymList.length > 0 && !formData.gymId) {
                    setFormData(prev => ({ ...prev, gymId: gymList[0].id }));
                }
            } catch (err) {
                console.error('Failed to fetch gyms', err);
            } finally {
                setIsFetchingGyms(false);
            }
        };
        fetchGyms();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.gymId || formData.price < 0 || formData.durationValue <= 0) {
            setError('Please fill in all required fields correctly');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            await plansAPI.create({
                ...formData,
                price: Number(formData.price) * 100, // Convert to paise/smallest unit if backend expects it.
                // Re-reading Plans Page code: "formatPrice(plan.price)".
                // Usually prices are stored in smallest unit (e.g. cents/paise).
                // "Create Plan ... Price is in smallest currency unit" says the Postman JSON description.
                durationUnit: formData.durationUnit as 'DAY' | 'WEEK' | 'MONTH' | 'YEAR'
            });
            router.push('/owner/plans');
        } catch (err: any) {
            console.error('Failed to create plan:', err);
            setError(err.response?.data?.message || 'Failed to create plan');
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetchingGyms) {
        return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
    }

    return (
        <div className="container mx-auto p-4 max-w-lg">
            <Button variant="ghost" className="mb-4 pl-0" onClick={() => router.back()}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Plans
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle>Create New Plan</CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="gymId" className="text-sm font-medium">Select Gym</label>
                            <select
                                id="gymId"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                                value={formData.gymId}
                                onChange={(e) => setFormData({ ...formData, gymId: e.target.value })}
                                disabled={isLoading || gyms.length === 0}
                            >
                                <option value="" disabled>Select a gym</option>
                                {gyms.map(gym => (
                                    <option key={gym.id} value={gym.id}>{gym.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium">Plan Name</label>
                            <Input
                                id="name"
                                placeholder="e.g. Monthly Premium"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="description" className="text-sm font-medium">Description</label>
                            <Input
                                id="description"
                                placeholder="e.g. Full access to all equipment"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="durationValue" className="text-sm font-medium">Duration</label>
                                <Input
                                    id="durationValue"
                                    type="number"
                                    min="1"
                                    value={formData.durationValue}
                                    onChange={(e) => setFormData({ ...formData, durationValue: parseInt(e.target.value) || 0 })}
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="durationUnit" className="text-sm font-medium">Unit</label>
                                <select
                                    id="durationUnit"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                                    value={formData.durationUnit}
                                    onChange={(e) => setFormData({ ...formData, durationUnit: e.target.value })}
                                    disabled={isLoading}
                                >
                                    <option value="DAY">Days</option>
                                    <option value="WEEK">Weeks</option>
                                    <option value="MONTH">Months</option>
                                    <option value="YEAR">Years</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="price" className="text-sm font-medium">Price (INR)</label>
                            <Input
                                id="price"
                                type="number"
                                min="0"
                                placeholder="0.00"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                disabled={isLoading}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? <Spinner className="w-4 h-4 mr-2" /> : null}
                            Create Plan
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
