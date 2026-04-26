import { Users, Home, Building2 } from 'lucide-react';

export default function StatsSection() {
  const stats = [
    { label: 'Active Listings', value: '5,000+', icon: Home },
    { label: 'Happy Customers', value: '1,200+', icon: Users },
    { label: 'Cities Covered', value: '50+', icon: Building2 },
  ];

  return (
    <div className="py-10">
      <div className="section-container grid grid-cols-1 md:grid-cols-3 gap-5 text-center">
        {stats.map((stat, index) => (
          <div key={index} className="surface-card subtle-ring flex flex-col items-center p-6">
            <div className="mb-3 rounded-xl bg-blue-50 p-3">
              <stat.icon className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-3xl font-semibold text-slate-900">{stat.value}</h3>
            <p className="text-slate-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}