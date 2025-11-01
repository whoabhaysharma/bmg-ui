import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import { Icon } from '@/components/icons';

export default function UserDashboard() {
  const upcomingBookings = [
    {
      id: 1,
      gym: 'FitPlex Downtown',
      date: 'Tomorrow',
      time: '6:00 PM - 7:30 PM',
      status: 'Confirmed',
    },
    {
      id: 2,
      gym: 'Muscle Zone',
      date: 'Friday',
      time: '5:00 PM - 6:30 PM',
      status: 'Confirmed',
    },
  ];

  const stats = [
    { label: 'Bookings', value: '12' },
    { label: 'Monthly Visits', value: '45' },
    { label: 'Streak', value: '7 days' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-4">
        {/* Header with greeting */}
        <div className="mb-8 mt-2">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-1">Welcome Back!</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Keep pushing towards your goals</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mb-8">
          {stats.map((stat) => (
            <Card 
              key={stat.label} 
              className="p-3 text-center"
            >
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Upcoming Bookings Section */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            <Icon name="Calendar" className="w-5 h-5" />
            Upcoming Bookings
          </h2>
          <div className="space-y-3">
            {upcomingBookings.map((booking) => (
              <Card 
                key={booking.id} 
                className="p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{booking.gym}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{booking.date}</p>
                  </div>
                  <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-2 py-1 rounded text-xs font-medium">
                    {booking.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <Icon name="Clock" className="w-4 h-4" />
                  <span>{booking.time}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-24">
          <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            <Icon name="Zap" className="w-5 h-5" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Button className="py-3 flex flex-col items-center gap-2 text-sm font-semibold">
              <Icon name="BookOpen" className="w-6 h-6" />
              <span>New Booking</span>
            </Button>
            <Button variant="outline" className="py-3 flex flex-col items-center gap-2 text-sm font-semibold text-black dark:text-white">
              <Icon name="TrendingUp" className="w-6 h-6" />
              <span>View Stats</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}