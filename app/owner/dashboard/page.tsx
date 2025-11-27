'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Users, Calendar, CreditCard, Clock, Plus, Dumbbell } from 'lucide-react';

export default function OwnerDashboard() {
    const router = useRouter();

    const menuItems = [
        { title: 'Members', description: 'View gym members', icon: Users, href: '/owner/members' },
        { title: 'Subscriptions', description: 'Manage subscriptions', icon: CreditCard, href: '/owner/subscriptions' },
        { title: 'Payments', description: 'Track revenue', icon: CreditCard, href: '/owner/payments' },
        { title: 'Attendance', description: 'Monitor check-ins', icon: Clock, href: '/owner/attendance' },
        { title: 'Plans', description: 'Manage plans', icon: Calendar, href: '/owner/plans' },
        { title: 'My Gyms', description: 'Manage locations', icon: Dumbbell, href: '/owner/gyms' },
    ];

    return (
        <div className="container mx-auto p-6 space-y-6 pb-24">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Owner Dashboard</h1>
                <Button onClick={() => router.push('/owner/gyms/create')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Gym
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {menuItems.map((item) => (
                    <Card
                        key={item.href}
                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => router.push(item.href)}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {item.title}
                            </CardTitle>
                            <item.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <CardDescription>{item.description}</CardDescription>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                    <Button variant="outline" onClick={() => router.push('/owner/plans/create')}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Plan
                    </Button>
                    <Button variant="outline" onClick={() => router.push('/owner/attendance')}>
                        <Clock className="w-4 h-4 mr-2" />
                        View Attendance
                    </Button>
                    <Button variant="outline" onClick={() => router.push('/owner/gyms/create')}>
                        <Dumbbell className="w-4 h-4 mr-2" />
                        Add Gym
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
