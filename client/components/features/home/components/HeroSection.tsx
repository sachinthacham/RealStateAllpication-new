"use client";

import React from 'react';
import HomeSearchBar from './HomeSearchBar'; // Import your existing search bar

export default function HeroSection() {
  return (
    <section className="relative min-h-152 flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ backgroundImage:"url('/images/heroimage.jpg')" }}
      >
        <div className="absolute inset-0 bg-slate-950/65" />
      </div>
      <div className="absolute inset-0 bg-linear-to-b from-blue-900/20 via-transparent to-slate-950/40" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl space-y-7">
        <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-blue-100">
          Verified Listings • Trusted Agents • Fast Discovery
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
          Discover Premium Homes <br /> Across <span className="text-sky-300">Sri Lanka</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto">
          Browse curated properties for sale and rent with modern search, trusted profiles, and instant contact tools.
        </p>

        <div className="pt-4">
          <HomeSearchBar />
        </div>
      </div>
    </section>
  );
}