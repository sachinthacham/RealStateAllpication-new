import { Building, Home, Trees, Hotel } from 'lucide-react';
import Link from 'next/link';

const categories = [
  { name: 'Apartments', icon: Building, count: 120, href: '/search?type=apartment' },
  { name: 'Houses', icon: Home, count: 350, href: '/search?type=house' },
  { name: 'Lands', icon: Trees, count: 80, href: '/search?type=land' },
  { name: 'Commercial', icon: Hotel, count: 45, href: '/search?type=commercial' },
];

export default function PropertyCategories() {
  return (
    <section className="py-16">
      <div className="section-container">
        <h2 className="text-3xl font-semibold text-slate-900 mb-8">Explore by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link 
              key={cat.name} 
              href={cat.href}
              className="surface-card subtle-ring p-6 transition-all hover:-translate-y-0.5 flex flex-col items-center text-center group"
            >
              <div className="bg-blue-50 p-4 rounded-2xl mb-4 group-hover:bg-blue-100 transition-colors">
                <cat.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg text-slate-900">{cat.name}</h3>
              <p className="text-sm text-slate-500">{cat.count} properties</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}