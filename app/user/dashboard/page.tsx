import Button from '@/components/ui/button';
import Card from '@/components/ui/card';

export default function UserDashboard() {
  const upcomingBookings = [
    {
      id: 1,
      gym: 'FitPlex Downtown',
      date: 'Tomorrow, 6:00 PM - 7:30 PM',
      status: 'Confirmed',
    },
    {
      id: 2,
      gym: 'Muscle Zone',
      date: 'Friday, 5:00 PM - 6:30 PM',
      status: 'Confirmed',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-2xl px-4 py-6">
        {/* Hero Section with Stats */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
        </div>

        {/* Streak Highlight Card */}
        <div className="mb-8 rounded-xl border-2 border-gray-900 dark:border-gray-100 bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-100 dark:to-gray-200 p-6 text-white dark:text-gray-900">
          <p className="text-sm font-medium opacity-90">Current Streak</p>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <p className="text-5xl font-bold tracking-tighter">7</p>
              <p className="mt-1 text-sm font-medium opacity-75">Days in a row</p>
            </div>
            <div className="text-5xl">🔥</div>
          </div>
          <p className="mt-4 text-xs font-medium opacity-75">Keep it up! You're on fire!</p>
        </div>

        {/* Stats Row */}
        <div className="mb-8 grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-4">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">12</p>
            <p className="mt-1 text-xs font-medium text-gray-600 dark:text-gray-400">Total Bookings</p>
          </div>
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-4">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">8</p>
            <p className="mt-1 text-xs font-medium text-gray-600 dark:text-gray-400">Visits This Month</p>
          </div>
        </div>

        {/* Upcoming Bookings Section */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Bookings</h2>
            <a href="/user/explore" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              View All
            </a>
          </div>
          
          <div className="space-y-2">
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map((booking) => (
                <div 
                  key={booking.id} 
                  className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{booking.gym}</p>
                    <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">{booking.date}</p>
                  </div>
                  <span className="ml-4 inline-flex items-center rounded-full bg-green-50 dark:bg-green-900/30 px-2.5 py-1.5 text-xs font-medium text-green-700 dark:text-green-400">
                    {booking.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-4 py-8 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">No upcoming bookings</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="mb-24">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Actions</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button className="w-full py-2.5 text-sm font-medium">
              Book a Gym
            </Button>
            <Button variant="outline" className="w-full py-2.5 text-sm font-medium text-gray-900 dark:text-white">
              View Gyms
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}