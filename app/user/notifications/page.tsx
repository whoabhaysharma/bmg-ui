import Card from '@/components/ui/card';
import Button from '@/components/ui/button';

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      title: 'Booking Confirmed',
      message: 'Your booking at FitPlex Downtown for tomorrow at 6:00 PM is confirmed.',
      timestamp: '2 hours ago',
      type: 'success',
    },
    {
      id: 2,
      title: 'Special Offer',
      message: 'Get 20% off on annual membership at Elite Fitness. Limited time offer!',
      timestamp: '1 day ago',
      type: 'info',
    },
    {
      id: 3,
      title: 'Membership Expiring',
      message: 'Your membership at Muscle Zone expires in 5 days. Renew now to avoid interruption.',
      timestamp: '3 days ago',
      type: 'warning',
    },
    {
      id: 4,
      title: 'New Gym Added',
      message: 'PowerHouse Gym has been added near your location. Check it out!',
      timestamp: '5 days ago',
      type: 'info',
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 dark:bg-green-900 border-l-4 border-green-500';
      case 'warning':
        return 'bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500';
      case 'info':
        return 'bg-blue-100 dark:bg-blue-900 border-l-4 border-blue-500';
      default:
        return 'bg-gray-100 dark:bg-gray-900 border-l-4 border-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-gray-600 dark:text-gray-400">Stay updated with your gym activities</p>
          </div>
          <Button variant="outline" className="text-sm px-3 h-10">Mark all as read</Button>
        </div>

        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${getTypeColor(notification.type)}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {notification.title}
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {notification.timestamp}
                  </p>
                </div>
                <button className="ml-2 text-gray-400 hover:text-gray-600">✕</button>
              </div>
            </Card>
          ))}
        </div>

        {notifications.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
          </Card>
        )}
      </div>
    </div>
  );
}
