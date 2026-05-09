import Link from 'next/link';

export default function CallToAction() {
  return (
    <section className="py-20 px-4">
      <div className="section-container">
        <div className="rounded-3xl bg-linear-to-r from-blue-700 via-blue-600 to-indigo-700 text-white text-center px-6 py-14 md:px-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Are you a Property Owner?</h2>
        <p className="text-lg md:text-xl text-blue-100 mb-8">
          List your property with us today and reach thousands of potential buyers and tenants instantly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/post-ad"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            Post Your Ad for Free
          </Link>
          <Link 
            href="/contact" 
            className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white/10 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
      </div>
    </section>
  );
}