import { MapPin, Bed, Bath, Maximize } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Dummy Data
const featured = [
  {
    id: 1,
    title: 'Luxury Villa in Colombo 7',
    price: 'LKR 95,000,000',
    location: 'Cinnamon Gardens, Colombo 07',
    beds: 4,
    baths: 3,
    area: '3,500 sqft',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    tag: 'For Sale'
  },
  {
    id: 2,
    title: 'Modern Apartment with Sea View',
    price: 'LKR 310,000 / month',
    location: 'Marine Drive, Colombo 03',
    beds: 2,
    baths: 2,
    area: '1,200 sqft',
    image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80',
    tag: 'For Rent'
  },
  {
    id: 3,
    title: 'Colonial House in Kandy',
    price: 'LKR 52,000,000',
    location: 'Peradeniya, Kandy',
    beds: 5,
    baths: 4,
    area: '4,000 sqft',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    tag: 'For Sale'
  },
  {
    id: 4,
    title: 'Beachfront Villa in Galle',
    price: 'LKR 68,000,000',
    location: 'Unawatuna, Galle',
    beds: 4,
    baths: 3,
    area: '2,900 sqft',
    image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80',
    tag: 'For Sale'
  }
];

export default function FeaturedProperties() {
  return (
    <section className="py-16">
      <div className="section-container">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-semibold text-slate-900">Featured Properties</h2>
            <p className="text-slate-500 mt-2">Handpicked selection of high-value listings</p>
          </div>
          <Link href="/search" className="text-blue-600 font-semibold hover:underline hidden md:block">
            View All Properties →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {featured.map((item) => (
            <div key={item.id} className="surface-card subtle-ring overflow-hidden transition-all group hover:-translate-y-0.5">
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