'use client';

import { useState } from 'react';
import { 
  User, 
  Camera, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Shield,
  CheckCircle,
  Edit,
  Globe,
  FileText
} from 'lucide-react';

export default function MyProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Sachintha Chamindu',
    email: 'sachintha@example.com',
    phone: '071-123-4567',
    location: 'Colombo, Sri Lanka',
    joinedDate: 'January 2024',
    memberType: 'Verified Member',
    bio: 'Active buyer and seller on ikman.lk. Mainly interested in electronics and vehicles.',
    language: 'English',
    timezone: 'GMT+5:30 (Colombo)',
  });

  const stats = [
    { label: 'Total Ads Posted', value: '24' },
    { label: 'Active Ads', value: '8' },
    { label: 'Items Sold', value: '16' },
    { label: 'Member Rating', value: '4.8/5' },
  ];

  const recentActivity = [
    { action: 'Posted new ad', item: 'iPhone 15 Pro Max', time: '2 hours ago' },
    { action: 'Sold item', item: 'Toyota Prius 2018', time: '1 day ago' },
    { action: 'Updated profile', item: 'Changed profile picture', time: '3 days ago' },
    { action: 'Verified phone', item: 'Number verification', time: '1 week ago' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 rounded-t-lg">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Profile Picture */}
          <div className="relative">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center">
              <User className="w-16 h-16 text-blue-600" />
            </div>
            <button className="absolute bottom-2 right-2 bg-blue-500 p-2 rounded-full hover:bg-blue-400">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
                <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                    {profile.memberType}
                  </span>
                  <span className="text-blue-200">Member since {profile.joinedDate}</span>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-white text-blue-600 px-6 py-2 rounded-lg hover:bg-gray-100 font-medium"
              >
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-blue-100">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Personal Info */}
          <div className="lg:col-span-2">
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </h2>
              
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name</label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                        className="w-full border rounded-lg px-4 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                        className="w-full border rounded-lg px-4 py-2"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Bio</label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      rows={3}
                      className="w-full border rounded-lg px-4 py-2"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{profile.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Phone className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{profile.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">{profile.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Member Since</p>
                        <p className="font-medium">{profile.joinedDate}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">About Me</p>
                    <p className="text-gray-800">{profile.bio}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        activity.action.includes('Posted') ? 'bg-green-100' :
                        activity.action.includes('Sold') ? 'bg-blue-100' :
                        'bg-purple-100'
                      }`}>
                        <FileText className={`w-5 h-5 ${
                          activity.action.includes('Posted') ? 'text-green-600' :
                          activity.action.includes('Sold') ? 'text-blue-600' :
                          'text-purple-600'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-gray-600">{activity.item}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Account Details */}
          <div className="space-y-6">
            {/* Account Type Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Account Type
              </h3>
              <div className="mb-4">
                <div className="text-2xl font-bold text-blue-700 mb-1">Verified Member</div>
                <p className="text-sm text-gray-600">Basic account with standard features</p>
              </div>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
                Upgrade to Premium
              </button>
            </div>

            {/* Preferences */}
            <div className="border rounded-xl p-6">
              <h3 className="font-bold text-gray-800 mb-4">Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Language</p>
                      <p className="text-sm text-gray-500">{profile.language}</p>
                    </div>
                  </div>
                  <Edit className="w-4 h-4 text-gray-400 cursor-pointer" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Timezone</p>
                      <p className="text-sm text-gray-500">{profile.timezone}</p>
                    </div>
                  </div>
                  <Edit className="w-4 h-4 text-gray-400 cursor-pointer" />
                </div>
              </div>
            </div>

            {/* Verification Status */}
            <div className="border rounded-xl p-6">
              <h3 className="font-bold text-gray-800 mb-4">Verification Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Email</span>
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    Verified
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Phone Number</span>
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    Verified
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Identity</span>
                  <button className="text-blue-600 text-sm hover:text-blue-700">
                    Verify Now
                  </button>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="border rounded-xl p-6">
              <h3 className="font-bold text-gray-800 mb-4">Account Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50">
                  Change Password
                </button>
                <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50">
                  Privacy Settings
                </button>
                <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 text-red-600">
                  Deactivate Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}