

import Button from '@/components/ui/button';
import Card from '@/components/ui/card';

export default function UserDashboard() {
  return (
    <div className="container mx-auto p-6">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
        <p className="mb-4">Welcome to your dashboard. Track your fitness journey here.</p>
        <div className="grid gap-4">
          <Button>View My Schedule</Button>
          <Button>Track Progress</Button>
          <Button>My Profile</Button>
        </div>
      </Card>
    </div>
  )
}