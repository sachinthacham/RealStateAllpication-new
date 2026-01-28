import { Star, Phone, Mail } from 'lucide-react';

const agents = [
  {
    id: 1,
    name: 'Nimal Perera',
    company: 'Lanka Realty',
    properties: 42,
    rating: 4.8,
    phone: '+94 77 123 4567',
    email: 'nimal@lankarealty.com',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face'
  },
  {
    id: 2,
    name: 'Kamala Silva',
    company: 'Prime Properties',
    properties: 38,
    rating: 4.9,
    phone: '+94 77 234 5678',
    email: 'kamala@primeproperties.lk',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face'
  },
  {
    id: 3,
    name: 'Rajith Fernando',
    company: 'Colombo Homes',
    properties: 55,
    rating: 4.7,
    phone: '+94 77 345 6789',
    email: 'rajith@colombohomes.com',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face'
  }
];

export default function FeaturedAgents() {
  return (
    <section className="mt-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Featured Agents</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Work with our top-rated real estate agents who know the Sri Lankan market best
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {agents.map((agent) => (
          <div key={agent.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-4 mb-6">
              <img
                src={agent.image}
                alt={agent.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h3 className="text-xl font-bold">{agent.name}</h3>
                <p className="text-gray-600">{agent.company}</p>
                <div className="flex items-center mt-1">
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  <span className="ml-1 font-semibold">{agent.rating}</span>
                  <span className="ml-2 text-gray-500">({agent.properties} properties)</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3 text-gray-600">
                <Phone size={18} />
                <span>{agent.phone}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Mail size={18} />
                <span className="truncate">{agent.email}</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                View Profile
              </button>
              <button className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                Contact
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <button className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold">
          View All Agents
        </button>
      </div>
    </section>
  );
}