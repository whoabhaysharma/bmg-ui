'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { plansAPI } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { ChevronLeft } from 'lucide-react';

export default function CreatePlanPage() {
    const params = useParams();
    const gymId = params.id as string;
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        durationValue: 1,
        durationUnit: 'MONTH',
        price: 0
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.price || !formData.durationValue) {
            setError('Please fill in all required fields');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            await plansAPI.create({
                gymId,
                ...formData,
                durationUnit: formData.durationUnit as 'DAY' | 'WEEK' | 'MONTH' | 'YEAR'
            });
            router.push(`/owner/gyms/${gymId}`);
        } catch (err: any) {
            console.error('Failed to create plan:', err);
            setError(err.response?.data?.message || 'Failed to create plan');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-lg">
            <Button variant="ghost" className="mb-4 pl-0" onClick={() => router.back()}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Gym Details
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
                            <label className="text-sm font-medium">Plan Name</label>
                            <Input
                                placeholder="e.g. Monthly Premium"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <Input
                                placeholder="e.g. Full access to gym and cardio"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Duration</label>
                                <Input
                                    type="number"
                                    min="1"
                                    value={formData.durationValue}
                                    onChange={(e) => setFormData({ ...formData, durationValue: parseInt(e.target.value) })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Unit</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.durationUnit}
                                    onChange={(e) => setFormData({ ...formData, durationUnit: e.target.value })}
                                >
                                    <option value="DAY">Days</option>
                                    <option value="WEEK">Weeks</option>
                                    <option value="MONTH">Months</option>
                                    <option value="YEAR">Years</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Price (₹)</label>
                            <Input
                                type="number"
                                min="0"
                                placeholder="1500"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
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
