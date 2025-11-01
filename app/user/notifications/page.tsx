import Card from '@/components/ui/card';
import Button from '@/components/ui/button';

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      title: 'Booking Confirmed',
      message: 'Your booking at FitPlex Downtown for tomorrow at 6:00 PM is confirmed.',
      timestamp: '2 hours ago',
      read: false,
    },
    {
      id: 2,
      title: 'Special Offer',
      message: 'Get 20% off on annual membership at Elite Fitness. Limited time offer!',
      timestamp: '1 day ago',
      read: true,
    },
    {
      id: 3,
      title: 'Membership Expiring',
      message: 'Your membership at Muscle Zone expires in 5 days. Renew now to avoid interruption.',
      timestamp: '3 days ago',
      read: true,
    },
    {
      id: 4,
      title: 'New Gym Added',
      message: 'PowerHouse Gym has been added near your location. Check it out!',
      timestamp: '5 days ago',
      read: true,
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-2xl px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Notifications</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Stay updated with your gym activities</p>
        </div>

        {/* Notification List */}
        <div className="mb-24 space-y-3">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`p-4 transition-all ${
                  !notification.read ? 'bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className={`${!notification.read ? 'font-semibold' : 'font-medium'} text-gray-900 dark:text-white`}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span className="inline-block h-2 w-2 rounded-full bg-gray-900 dark:bg-white flex-shrink-0"></span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {notification.message}
                    </p>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                      {notification.timestamp}
                    </p>
                  </div>

                  {/* Close Button */}
                  <Button variant="ghost" className="ml-2 h-8 w-8 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0">
                    ✕
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-8 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">No notifications yet</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}