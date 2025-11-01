import Button from '@/components/ui/button';

export default function ExplorePage() {
  const gyms = [
    {
      id: 1,
      name: 'FitPlex Downtown',
      location: 'Downtown',
      distance: '2.5 km',
      rating: 4.8,
      price: '$50/month',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',
    },
    {
      id: 2,
      name: 'Muscle Zone',
      location: 'North District',
      distance: '5.2 km',
      rating: 4.5,
      price: '$45/month',
      image: 'https://images.unsplash.com/photo-1577221084712-56ceb7e45923?w=400&h=300&fit=crop',
    },
    {
      id: 3,
      name: 'Elite Fitness',
      location: 'West End',
      distance: '3.8 km',
      rating: 4.9,
      price: '$60/month',
      image: 'https://images.unsplash.com/photo-1540497077202-7361c3c928c9?w=400&h=300&fit=crop',
    },
    {
      id: 4,
      name: 'PowerHouse Gym',
      location: 'Central Hub',
      distance: '1.2 km',
      rating: 4.6,
      price: '$55/month',
      image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-2xl px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Explore Gyms</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Find and book gyms near you</p>
        </div>

        {/* Gym List */}
        <div className="mb-24 space-y-4">
          {gyms.map((gym) => (
            <div
              key={gym.id}
              className="group overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-all hover:shadow-md"
            >
              {/* Image Container */}
              <div className="relative h-40 w-full overflow-hidden bg-gray-200 dark:bg-gray-800">
                <img
                  src={gym.image}
                  alt={gym.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                {/* Rating Badge - Positioned on image */}
                <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-gray-900 dark:bg-gray-100 px-2 py-1 text-xs font-semibold text-white dark:text-gray-900">
                  ⭐ {gym.rating}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Name and Location */}
                <div className="mb-2">
                  <h2 className="font-semibold text-gray-900 dark:text-white">{gym.name}</h2>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{gym.location}</p>
                </div>

                {/* Distance and Price Row */}
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs text-gray-600 dark:text-gray-400">📍 {gym.distance}</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{gym.price}</span>
                </div>

                {/* Action Button */}
                <Button className="w-full py-2 text-sm font-medium">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
