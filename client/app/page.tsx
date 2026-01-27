import React from 'react';
import HeroSection from '@/components/features/home/components/HeroSection';
import StatsSection from '@/components/features/home/components/StatsSection';
import PropertyCategories from '@/components/features/home/components/PropertyCategories';
import FeaturedProperties from '@/components/features/home/components/FeaturedProperties';
import WhyChooseUs from '@/components/features/home/components/WhyChooseUs';
import CallToAction from '@/components/features/home/components/CallToAction';
import Testimonials from '@/components/features/home/components/Testimonials';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. Hero Section (Includes Search Bar) */}
      <HeroSection />

      {/* 2. Quick Stats (Trust Builders) */}
      <StatsSection />

      {/* 3. Browse by Property Type */}
      <PropertyCategories />

      {/* 4. Featured Listings (The "Juicy" Content) */}
      <FeaturedProperties />

      {/* 5. Value Proposition */}
      <WhyChooseUs />

      {/* 6. Social Proof */}
      <Testimonials />

      {/* 7. Final Push */}
      <CallToAction />
    </div>
  );
};

export default HomePage;