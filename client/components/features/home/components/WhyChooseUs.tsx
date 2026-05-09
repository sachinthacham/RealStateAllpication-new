import { ShieldCheck, Clock, Award } from 'lucide-react';

export default function WhyChooseUs() {
  const features = [
    {
      icon: ShieldCheck,
      title: 'Trusted by Thousands',
      desc: 'We verify every listing to ensure your safety and peace of mind.'
    },
    {
      icon: Clock,
      title: 'Fast & Efficient',
      desc: 'Our platform helps you find properties 3x faster than traditional methods.'
    },
    {
      icon: Award,
      title: 'Market Experts',
      desc: 'With over 10 years of experience in the Sri Lankan real estate market.'
    }
  ];

  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Why Choose Us?</h2>
          <p className="text-gray-400 mt-2">We provide the most complete real estate service in the country.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="bg-gray-800 p-8 rounded-2xl text-center hover:bg-gray-700 transition-colors">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <f.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}