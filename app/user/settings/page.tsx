import Card from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

export default function SettingsPage() {
  const menuItems = [
    {
      section: 'Account',
      items: [
        { title: 'Profile Information', description: 'Edit your personal details' },
        { title: 'Payment Methods', description: 'Manage your payment options' },
        { title: 'Saved Addresses', description: 'Manage your gym locations' },
      ],
    },
    {
      section: 'Support',
      items: [
        { title: 'Help & Support', description: 'Get help with your account' },
        { title: 'Privacy Policy', description: 'Read our privacy policy' },
        { title: 'Terms of Service', description: 'Review our terms' },
      ],
    },
  ];

  const preferences = [
    { id: 'notifications', label: 'Notifications', defaultChecked: true },
    { id: 'email-updates', label: 'Email Updates', defaultChecked: true },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-2xl px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Settings</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Manage your account and preferences</p>
        </div>

        {/* Preferences Section */}
        <div className="mb-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-500">Preferences</h2>
          <Card className="overflow-hidden divide-y divide-gray-200 dark:divide-gray-800">
            {preferences.map((pref) => (
              <div key={pref.id} className="flex items-center gap-3 px-4 py-3">
                <Checkbox
                  id={pref.id}
                  defaultChecked={pref.defaultChecked}
                  className="cursor-pointer"
                />
                <label htmlFor={pref.id} className="flex-1 font-medium text-gray-900 dark:text-white cursor-pointer">
                  {pref.label}
                </label>
              </div>
            ))}
          </Card>
        </div>

        {/* Menu Sections */}
        {menuItems.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-500">{section.section}</h2>
            <Card className="overflow-hidden divide-y divide-gray-200 dark:divide-gray-800">
              {section.items.map((item, itemIndex) => (
                <button
                  key={itemIndex}
                  className="w-full px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                  <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                  <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">{item.description}</p>
                </button>
              ))}
            </Card>
          </div>
        ))}

        {/* Logout Button */}
        <div className="mb-6">
          <Button className="w-full py-2.5 text-sm font-medium">
            Logout
          </Button>
        </div>

        {/* Footer Info */}
        <div className="mb-24 text-center">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400">FitGym v1.0.0</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">© 2025 FitGym. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
