'use client';

import React, { useEffect, useState } from 'react';
import { gymsAPI, subscriptionsAPI } from '@/lib/api/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { User as UserIcon, Phone, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Gym {
    id: string;
    name: string;
}

interface User {
    id: string;
    name: string;
    mobileNumber: string;
}

interface Subscription {
    id: string;
    user: User;
    status: string;
    startDate: string;
    endDate: string;
}

export default function MembersPage() {
    const [gyms, setGyms] = useState<Gym[]>([]);
    const [selectedGymId, setSelectedGymId] = useState<string>('');
    const [members, setMembers] = useState<Subscription[]>([]); // Using subscription as member record for now
    const [isLoadingGyms, setIsLoadingGyms] = useState(true);
    const [isLoadingMembers, setIsLoadingMembers] = useState(false);
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

        const fetchMembers = async () => {
            setIsLoadingMembers(true);
            try {
                // Speculative endpoint usage
                const response = await subscriptionsAPI.getByGymId(selectedGymId);
                // Filter for active subscriptions or just show all
                setMembers(response.data.data || []);
            } catch (err) {
                console.error('Failed to fetch members', err);
                // Fallback or empty state
                setMembers([]);
            } finally {
                setIsLoadingMembers(false);
            }
        };
        fetchMembers();
    }, [selectedGymId]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (isLoadingGyms) {
        return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
    }

    if (gyms.length === 0) {
        return (
            <div className="container mx-auto p-6 text-center">
                <h1 className="text-2xl font-bold mb-4">Members</h1>
                <p className="mb-4">You need to create a gym to view members.</p>
                <Button onClick={() => router.push('/owner/gyms/create')}>Create Gym</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Members</h1>
                    <p className="text-muted-foreground">View members registered at your gym</p>
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

            {isLoadingMembers ? (
                <div className="flex justify-center p-12"><Spinner /></div>
            ) : members.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <h3 className="text-lg font-medium text-gray-900">No members found</h3>
                    <p className="text-gray-500 mt-1">Once users subscribe to your plans, they will appear here.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {members.map((member) => (
                        <Card key={member.id} className="overflow-hidden">
                            <div className="flex flex-col sm:flex-row sm:items-center p-6 gap-4">
                                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                    <UserIcon className="h-6 w-6 text-gray-500" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <h3 className="font-semibold">{member.user?.name || 'Unknown User'}</h3>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Phone className="mr-2 h-3 w-3" />
                                        {member.user?.mobileNumber || 'No number'}
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <Calendar className="mr-2 h-3 w-3" />
                                        Valid until: {member.endDate ? formatDate(member.endDate) : 'N/A'}
                                    </div>
                                    <div className="mt-1">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                            member.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {member.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
