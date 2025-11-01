import Button from '@/components/ui/button';
import Card from '@/components/ui/card';

export default function ExplorePage() {
  // Mock gym data - replace with API call
  const gyms = [
    {
      id: 1,
      name: 'FitPlex Downtown',
      location: 'Downtown',
      distance: '2.5 km',
      rating: 4.8,
      price: '$50/month',
    },
    {
      id: 2,
      name: 'Muscle Zone',
      location: 'North District',
      distance: '5.2 km',
      rating: 4.5,
      price: '$45/month',
    },
    {
      id: 3,
      name: 'Elite Fitness',
      location: 'West End',
      distance: '3.8 km',
      rating: 4.9,
      price: '$60/month',
    },
    {
      id: 4,
      name: 'PowerHouse Gym',
      location: 'Central Hub',
      distance: '1.2 km',
      rating: 4.6,
      price: '$55/month',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-2">Explore Gyms</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Find and book your perfect gym</p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {gyms.map((gym) => (
            <Card key={gym.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="text-lg font-bold">{gym.name}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{gym.location}</p>
                </div>
                <span className="bg-black dark:bg-white text-white dark:text-black px-2 py-1 rounded text-xs font-semibold">
                  ⭐ {gym.rating}
                </span>
              </div>

              <div className="mb-4 space-y-1">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  📍 {gym.distance}
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {gym.price}
                </p>
              </div>

              <Button className="w-full">View Details</Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
