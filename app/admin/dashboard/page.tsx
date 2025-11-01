

import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import { withAuth } from '@/lib/auth/withAuth';

function AdminDashboard() {
  return (
    <div className="container mx-auto p-6">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <p className="mb-4">Welcome to the admin area. Here you can manage gyms and users.</p>
        <div className="grid gap-4">
          <Button>Manage Gyms</Button>
          <Button>View Users</Button>
          <Button>System Settings</Button>
        </div>
      </Card>
    </div>
  )
}

export default withAuth(AdminDashboard, 'OWNER');