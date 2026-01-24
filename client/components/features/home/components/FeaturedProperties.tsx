import { MapPin, Bed, Bath, Maximize } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Dummy Data
const featured = [
  {
    id: 1,
    title: 'Luxury Villa in Colombo 7',
    price: 'LKR 85,000,000',
    location: 'Cinnamon Gardens, Colombo',
    beds: 4,
    baths: 3,
    area: '3,500 sqft',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aG9tZXxlbnwwfHwwfHx8MA%3D%3D',
    tag: 'For Sale'
  },
  {
    id: 2,
    title: 'Modern Apartment with Sea View',
    price: 'LKR 250,000 / month',
    location: 'Marine Drive, Colombo 3',
    beds: 2,
    baths: 2,
    area: '1,200 sqft',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    tag: 'For Rent'
  },
  {
    id: 3,
    title: 'Colonial House in Kandy',
    price: 'LKR 45,000,000',
    location: 'Peradeniya, Kandy',
    beds: 5,
    baths: 4,
    area: '4,000 sqft',
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80',
    tag: 'For Sale'
  },
  {
    id: 4,
    title: 'Colonial House in Kandy',
    price: 'LKR 45,000,000',
    location: 'Peradeniya, Kandy',
    beds: 5,
    baths: 4,
    area: '4,000 sqft',
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80',
    tag: 'For Sale'
  }
];

export default function FeaturedProperties() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Properties</h2>
            <p className="text-gray-500 mt-2">Handpicked selection of the best properties for you</p>
          </div>
          <Link href="/search" className="text-blue-600 font-semibold hover:underline hidden md:block">
            View All Properties →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {featured.map((item) => (
            <div key={item.id} className="border rounded-xl overflow-hidden hover:shadow-xl transition-shadow group">
              <div className="relative h-64 overflow-hidden">
                <span className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 text-xs font-bold uppercase rounded z-10">
                  {item.tag}
                </span>
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <p className="text-blue-600 font-bold text-xl mb-1">{item.price}</p>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  {item.location}
                </div>
                <div className="flex justify-between border-t pt-4 text-gray-600 text-sm">
                  <span className="flex items-center"><Bed className="w-4 h-4 mr-1"/> {item.beds} Beds</span>
                  <span className="flex items-center"><Bath className="w-4 h-4 mr-1"/> {item.baths} Baths</span>
                  <span className="flex items-center"><Maximize className="w-4 h-4 mr-1"/> {item.area}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <Link href="/search" className="text-blue-600 font-semibold hover:underline">
            View All Properties →
          </Link>
        </div>
      </div>
    </section>
  );
}