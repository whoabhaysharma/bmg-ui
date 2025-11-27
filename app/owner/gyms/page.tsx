'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { gymsAPI } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Plus, MapPin, Edit, Trash2, ExternalLink } from 'lucide-react';

interface Gym {
    id: string;
    name: string;
    address: string;
    isVerified: boolean;
}

export default function MyGymsPage() {
    const [gyms, setGyms] = useState<Gym[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const fetchGyms = async () => {
        try {
            setIsLoading(true);
            const response = await gymsAPI.getMyOwned();
            // Assuming response.data.data is the array of gyms based on standard response format
            setGyms(response.data.data || []);
        } catch (err) {
            console.error('Failed to fetch gyms:', err);
            setError('Failed to load your gyms. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGyms();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this gym? This action cannot be undone.')) return;

        try {
            await gymsAPI.delete(id);
            setGyms(gyms.filter(gym => gym.id !== id));
        } catch (err) {
            console.error('Failed to delete gym:', err);
            alert('Failed to delete gym.');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Spinner className="w-8 h-8" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 pb-24 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Gyms</h1>
                    <p className="text-muted-foreground">Manage your fitness centers</p>
                </div>
                <Button onClick={() => router.push('/owner/gyms/create')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Gym
                </Button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-200">
                    {error}
                </div>
            )}

            {gyms.length === 0 && !error ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <h3 className="text-lg font-medium text-gray-900">No gyms found</h3>
                    <p className="text-gray-500 mt-1 mb-4">Get started by adding your first gym.</p>
                    <Button onClick={() => router.push('/owner/gyms/create')}>
                        Add Your First Gym
                    </Button>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {gyms.map((gym) => (
                        <Card key={gym.id} className="flex flex-col">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-xl">{gym.name}</CardTitle>
                                    {gym.isVerified ? (
                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">Verified</span>
                                    ) : (
                                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">Pending</span>
                                    )}
                                </div>
                                <CardDescription className="flex items-center mt-1">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {gym.address}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                {/* Add stats here later if available */}
                            </CardContent>
                            <CardFooter className="flex justify-between border-t pt-4">
                                <Button variant="outline" size="sm" onClick={() => router.push(`/owner/gyms/${gym.id}`)}>
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Manage
                                </Button>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => router.push(`/owner/gyms/${gym.id}/edit`)}>
                                        <Edit className="w-4 h-4 text-gray-500" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(gym.id)}>
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
