import { Heart, Eye, MapPin, Calendar, Phone } from 'lucide-react';

const favorites = [
  { 
    id: 1, 
    title: 'Toyota Aqua 2018 Hybrid', 
    price: 'Rs 4,200,000', 
    location: 'Colombo 05', 
    date: 'Today', 
    category: 'Cars',
    image: 'car'
  },
  { 
    id: 2, 
    title: '3 Bedroom House for Rent', 
    price: 'Rs 85,000/month', 
    location: 'Battaramulla', 
    date: '2 days ago', 
    category: 'Property',
    image: 'house'
  },
  { 
    id: 3, 
    title: 'iPhone 15 Pro 256GB', 
    price: 'Rs 350,000', 
    location: 'Kandy', 
    date: '1 week ago', 
    category: 'Phones',
    image: 'phone'
  },
  { 
    id: 4, 
    title: 'Samsung Refrigerator', 
    price: 'Rs 120,000', 
    location: 'Gampaha', 
    date: '3 days ago', 
    category: 'Electronics',
    image: 'fridge'
  },
];

export default function FavoritesPage() {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Favorites</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-700">12</div>
          <div className="text-sm text-blue-600">Total Favorites</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-700">8</div>
          <div className="text-sm text-green-600">Active Listings</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-700">3</div>
          <div className="text-sm text-yellow-600">Price Drops</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-700">4</div>
          <div className="text-sm text-purple-600">Categories</div>
        </div>
      </div>

      {/* Favorites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {favorites.map((item) => (
          <div key={item.id} className="border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-48 bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
                  <Heart className="w-8 h-8 text-red-500" />
                </div>
                <span className="text-sm text-gray-600">{item.category}</span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xl font-bold text-blue-700">{item.price}</span>
                <span className="text-sm text-gray-500">{item.date}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {item.location}
                </span>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Contact Seller
                </button>
                <button className="p-2 border rounded-lg hover:bg-gray-50">
                  <Heart className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}