'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { gymsAPI } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { ChevronLeft } from 'lucide-react';

export default function CreateGymPage() {
    const [formData, setFormData] = useState({ name: '', address: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.address) {
            setError('Please fill in all fields');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            await gymsAPI.create(formData);
            router.push('/owner/gyms');
        } catch (err: any) {
            console.error('Failed to create gym:', err);
            setError(err.response?.data?.message || 'Failed to create gym');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-lg">
            <Button variant="ghost" className="mb-4 pl-0" onClick={() => router.back()}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Gyms
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle>Add New Gym</CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium">Gym Name</label>
                            <Input
                                id="name"
                                placeholder="e.g. Elite Fitness"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="address" className="text-sm font-medium">Address</label>
                            <Input
                                id="address"
                                placeholder="e.g. 123 Main St, City"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                disabled={isLoading}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? <Spinner className="w-4 h-4 mr-2" /> : null}
                            Create Gym
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
