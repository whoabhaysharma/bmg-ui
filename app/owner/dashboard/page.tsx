
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

export default function OwnerDashboard() {
    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Owner Dashboard</h1>
                <Button>Add New Gym</Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>My Gyms</CardTitle>
                        <CardDescription>Manage your gym locations</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">0</p>
                        <p className="text-xs text-muted-foreground">Active locations</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Active Plans</CardTitle>
                        <CardDescription>Manage subscription plans</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">0</p>
                        <p className="text-xs text-muted-foreground">Total plans</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Total Members</CardTitle>
                        <CardDescription>Active subscriptions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">0</p>
                        <p className="text-xs text-muted-foreground">Across all gyms</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-4">
                    <Button variant="outline">Create Plan</Button>
                    <Button variant="outline">View Attendance</Button>
                    <Button variant="outline">Manage Staff</Button>
                </CardContent>
            </Card>
        </div>
    )
}
