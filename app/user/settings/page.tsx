import Card from '@/components/ui/card';
import Button from '@/components/ui/button';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-4 max-w-md">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        {/* Account Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Account</h2>
          <Card className="p-4 space-y-3">
            <button className="w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
              <p className="font-medium text-gray-900 dark:text-white">Profile Information</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Edit your personal details</p>
            </button>
            <button className="w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
              <p className="font-medium text-gray-900 dark:text-white">Payment Methods</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Manage your payment options</p>
            </button>
            <button className="w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
              <p className="font-medium text-gray-900 dark:text-white">Saved Addresses</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Manage your gym locations</p>
            </button>
          </Card>
        </div>

        {/* Preferences Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Preferences</h2>
          <Card className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900 dark:text-white">Notifications</span>
              <input type="checkbox" defaultChecked className="w-5 h-5 cursor-pointer" />
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900 dark:text-white">Dark Mode</span>
              <input type="checkbox" className="w-5 h-5 cursor-pointer" />
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900 dark:text-white">Email Updates</span>
              <input type="checkbox" defaultChecked className="w-5 h-5 cursor-pointer" />
            </div>
          </Card>
        </div>

        {/* Support Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Support</h2>
          <Card className="p-4 space-y-3">
            <button className="w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
              <p className="font-medium text-gray-900 dark:text-white">Help & Support</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Get help with your account</p>
            </button>
            <button className="w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
              <p className="font-medium text-gray-900 dark:text-white">Privacy Policy</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Read our privacy policy</p>
            </button>
            <button className="w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
              <p className="font-medium text-gray-900 dark:text-white">Terms of Service</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Review our terms</p>
            </button>
          </Card>
        </div>

        {/* Logout Section */}
        <div className="mb-6">
          <Button variant="outline" className="w-full">
            Logout
          </Button>
        </div>

        {/* About */}
        <Card className="p-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>FitGym v1.0.0</p>
          <p className="text-xs mt-2">© 2025 FitGym. All rights reserved.</p>
        </Card>
      </div>
    </div>
  );
}
