'use client';

import { useEffect, useState } from 'react';
import { Bell, Shield, Globe } from 'lucide-react';
import { realEstateApi } from '@/lib/api/realEstate';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    emailDigest: 'daily',
    smsEnabled: false,
    pushEnabled: true,
  });

  const [privacy, setPrivacy] = useState({
    showPhone: true,
    showEmail: false,
    showLocation: true,
    profileVisibility: 'public',
  });

  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const data = await realEstateApi.getNotificationPreferences();
        setNotifications({
          emailDigest: data.emailDigest || 'daily',
          smsEnabled: !!data.smsEnabled,
          pushEnabled: !!data.pushEnabled,
        });
      } catch (error: any) {
        setErrorMessage(error?.message || 'Failed to load preferences');
      }
    };
    loadPreferences();
  }, []);

  const savePreferences = async () => {
    try {
      setSaving(true);
      setErrorMessage(null);
      setStatusMessage(null);
      await realEstateApi.updateNotificationPreferences({
        emailDigest: notifications.emailDigest as 'instant' | 'daily' | 'weekly',
        smsEnabled: notifications.smsEnabled,
        pushEnabled: notifications.pushEnabled,
      });
      setStatusMessage('Preferences saved successfully');
    } catch (error: any) {
      setErrorMessage(error?.message || 'Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>

      {errorMessage && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">
          {errorMessage}
        </div>
      )}
      {statusMessage && (
        <div className="mb-4 rounded border border-green-200 bg-green-50 p-2 text-sm text-green-700">
          {statusMessage}
        </div>
      )}

      {/* Notification Settings */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold">Notification Settings</h2>
        </div>
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between py-3 border-b">
              <div>
                <p className="font-medium">{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</p>
                <p className="text-sm text-gray-600">Receive {key} notifications</p>
              </div>
              {key === 'emailDigest' ? (
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={value as string}
                  onChange={(e) => setNotifications({ ...notifications, emailDigest: e.target.value })}
                >
                  <option value="instant">Instant</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              ) : (
                <button
                  onClick={() => setNotifications({...notifications, [key]: !value})}
                  className={`w-12 h-6 rounded-full transition-colors ${value ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${value ? 'translate-x-7' : 'translate-x-1'} mt-0.5`} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold">Privacy Settings</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium">Profile Visibility</p>
              <p className="text-sm text-gray-600">Who can see your profile</p>
            </div>
            <select 
              className="border rounded-lg px-3 py-2"
              value={privacy.profileVisibility}
              onChange={(e) => setPrivacy({...privacy, profileVisibility: e.target.value})}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="contacts">Contacts Only</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium">Show Phone Number</p>
              <p className="text-sm text-gray-600">Display phone in your ads</p>
            </div>
            <button
              onClick={() => setPrivacy({...privacy, showPhone: !privacy.showPhone})}
              className={`w-12 h-6 rounded-full transition-colors ${privacy.showPhone ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${privacy.showPhone ? 'translate-x-7' : 'translate-x-1'} mt-0.5`} />
            </button>
          </div>
        </div>
      </div>

      {/* Language & Region */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold">Language & Region</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Language</label>
            <select className="w-full border rounded-lg px-3 py-2">
              <option>English</option>
              <option>Sinhala</option>
              <option>Tamil</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Currency</label>
            <select className="w-full border rounded-lg px-3 py-2">
              <option>LKR (Rs)</option>
              <option>USD ($)</option>
              <option>EUR (€)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 pt-6 border-t">
        <button
          onClick={savePreferences}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}