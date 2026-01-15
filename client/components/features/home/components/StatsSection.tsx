import { Users, Home, Building2 } from 'lucide-react';

export default function StatsSection() {
  const stats = [
    { label: 'Active Listings', value: '5,000+', icon: Home },
    { label: 'Happy Customers', value: '1,200+', icon: Users },
    { label: 'Cities Covered', value: '50+', icon: Building2 },
  ];

  return (
    <div className="bg-white py-10 border-b">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {stats.map((stat, index) => (
          <div key={index} className="flex flex-col items-center p-4">
            <stat.icon className="w-8 h-8 text-blue-600 mb-2" />
            <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}