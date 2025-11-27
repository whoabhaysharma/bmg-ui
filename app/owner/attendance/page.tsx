'use client';

import React, { useEffect, useState } from 'react';
import { gymsAPI, attendanceAPI } from '@/lib/api/client';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Clock, User, Calendar } from 'lucide-react';

interface Gym {
    id: string;
    name: string;
}

interface UserData {
    id: string;
    name: string;
}

interface Attendance {
    id: string;
    user: UserData;
    checkInTime: string;
    checkOutTime?: string;
    date: string;
}

export default function AttendancePage() {
    const [gyms, setGyms] = useState<Gym[]>([]);
    const [selectedGymId, setSelectedGymId] = useState<string>('');
    const [attendance, setAttendance] = useState<Attendance[]>([]);
    const [isLoadingGyms, setIsLoadingGyms] = useState(true);
    const [isLoadingAttendance, setIsLoadingAttendance] = useState(false);
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

        const fetchAttendance = async () => {
            setIsLoadingAttendance(true);
            try {
                const response = await attendanceAPI.getByGymId(selectedGymId);
                setAttendance(response.data.data || []);
            } catch (err) {
                console.error('Failed to fetch attendance', err);
                setAttendance([]);
            } finally {
                setIsLoadingAttendance(false);
            }
        };
        fetchAttendance();
    }, [selectedGymId]);

    const formatTime = (timeString: string) => {
        if (!timeString) return '-';
        return new Date(timeString).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-IN', {
            weekday: 'short',
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
                <h1 className="text-2xl font-bold mb-4">Attendance</h1>
                <p className="mb-4">You need to create a gym to view attendance.</p>
                <Button onClick={() => router.push('/owner/gyms/create')}>Create Gym</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
                    <p className="text-muted-foreground">Monitor check-ins at your gym</p>
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

            {isLoadingAttendance ? (
                <div className="flex justify-center p-12"><Spinner /></div>
            ) : attendance.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <h3 className="text-lg font-medium text-gray-900">No attendance records</h3>
                    <p className="text-gray-500 mt-1">Check-ins will appear here.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {attendance.map((record) => (
                        <Card key={record.id}>
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="bg-blue-50 p-2 rounded-full">
                                        <User className="h-5 w-5 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">{record.user?.name || 'Unknown User'}</p>
                                        <div className="flex items-center text-xs text-gray-500 mt-1">
                                            <Calendar className="h-3 w-3 mr-1" />
                                            {formatDate(record.date || record.checkInTime)}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center justify-end text-sm text-green-600 font-medium">
                                        <Clock className="h-3 w-3 mr-1" />
                                        In: {formatTime(record.checkInTime)}
                                    </div>
                                    {record.checkOutTime && (
                                        <div className="flex items-center justify-end text-sm text-gray-500 mt-1">
                                            <Clock className="h-3 w-3 mr-1" />
                                            Out: {formatTime(record.checkOutTime)}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
