import { Star, Quote } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    name: "Nimali Perera",
    role: "Home Buyer",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    text: "I found my dream apartment in Colombo 03 within a week. The listing details and visit scheduling process were excellent.",
    rating: 5
  },
  {
    id: 2,
    name: "Ravindu Silva",
    role: "Property Investor",
    image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&w=150&q=80",
    text: "This is one of the most practical property platforms in Sri Lanka. I closed two rental deals in Negombo quickly.",
    rating: 5
  },
  {
    id: 3,
    name: "Kamal Gunawardena",
    role: "Tenant",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80",
    text: "Finally, verified listings with clear neighborhood details. I moved to Kandy with confidence thanks to this platform.",
    rating: 4
  }
];

export default function Testimonials() {
  return (
    <section className="py-20">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-slate-900">What Our Clients Say</h2>
          <p className="text-slate-500 mt-2">Real stories from people who found their perfect place.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div key={item.id} className="surface-card subtle-ring p-8 transition-all hover:-translate-y-0.5 relative">
              {/* Quote Icon Background */}
              <Quote className="absolute top-8 right-8 w-10 h-10 text-gray-100 fill-current" />
              
              {/* Stars */}
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < item.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-600 italic mb-6 relative z-10">"{item.text}"</p>

              {/* User Profile */}
              <div className="flex items-center">
                <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-500">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}