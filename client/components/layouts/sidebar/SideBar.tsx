import Link from 'next/link';
import { 
  FileText, 
  Crown, 
  Search, 
  Heart, 
  Settings, 
  Phone, 
  Briefcase, 
  User, 
  Database,
  Home
} from 'lucide-react';

const menuItems = [
  { icon: <Home className="w-5 h-5" />, label: 'Dashboard', href: '/user/main' },
  { icon: <FileText className="w-5 h-5" />, label: 'My ads', href: '/user/listings' },
  { icon: <Crown className="w-5 h-5" />, label: 'My membership', href: '/user/mymembership' },
  { icon: <Search className="w-5 h-5" />, label: 'Saved searches', href: '/user/saved' },
  { icon: <Heart className="w-5 h-5" />, label: 'Favorites', href: '/user/favourites' },
  { icon: <Settings className="w-5 h-5" />, label: 'Settings', href: '/user/settings' },
  { icon: <Briefcase className="w-5 h-5" />, label: 'Jobs', href: '/user/jobs' },
  { icon: <User className="w-5 h-5" />, label: 'My Profile', href: '/user/profile' },

];

export default function DashboardSidebar() {
  return (
    <aside className="lg:w-64">
      <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-6">
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              <span className="text-gray-400">›</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}