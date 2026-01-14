"use client";

import React from 'react';
import HomeSearchBar from './HomeSearchBar'; // Import your existing search bar

export default function HeroSection() {
  return (
    <section className="relative h-150 flex flex-col items-center justify-center text-center px-4">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ backgroundImage:"url('/images/heroimage.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50" /> {/* Dark overlay for readability */}
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold text-white">
          Find Your Dream Home <br /> in <span className="text-primary-400">Sri Lanka</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
          Discover thousands of apartments, houses, and lands for sale & rent across the island.
        </p>

        {/* Your Existing Search Bar Component */}
        <div className="pt-6">
          <HomeSearchBar />
        </div>
      </div>
    </section>
  );
}