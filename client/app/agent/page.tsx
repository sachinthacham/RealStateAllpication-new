'use client';

import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Phone,  
  CheckCircle, 
  Award,
  TrendingUp,
  MessageSquare,
  ExternalLink
} from 'lucide-react';
import { agents,categories,locations } from '@/mockdata/agent';


export default function AgentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [sortBy, setSortBy] = useState('rating');

  // Filter agents based on search and filters
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || agent.category === selectedCategory;
    const matchesLocation = selectedLocation === 'All Locations' || agent.location === selectedLocation;
    
    return matchesSearch && matchesCategory && matchesLocation;
  }).sort((a, b) => {
    switch(sortBy) {
      case 'rating': return b.rating - a.rating;
      case 'reviews': return b.reviews - a.reviews;
      case 'activeAds': return b.activeAds - a.activeAds;
      default: return b.rating - a.rating;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-linear-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Verified Agents</h1>
            <p className="text-xl text-blue-100 mb-8">
              Connect with trusted professionals and businesses on ikman.lk
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for agents, businesses, or services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold">Filter Agents</h2>
              <span className="text-sm text-gray-500 ml-2">
                {filteredAgents.length} agents found
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm"
              >
                <option value="rating">Highest Rating</option>
                <option value="reviews">Most Reviews</option>
                <option value="activeAds">Most Active</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <div className="flex flex-wrap gap-2">
                {locations.map((location) => (
                  <button
                    key={location}
                    onClick={() => setSelectedLocation(location)}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                      selectedLocation === location
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Verified Agents */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-500" />
            Why Choose Verified Agents?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: <CheckCircle className="w-8 h-8 text-green-500" />, title: 'Verified Identity', desc: 'Identity and business verified by ikman' },
              { icon: <Award className="w-8 h-8 text-yellow-500" />, title: 'Trust Score', desc: 'Based on user reviews and ratings' },
              { icon: <TrendingUp className="w-8 h-8 text-blue-500" />, title: 'Active Listings', desc: 'Regularly posting quality ads' },
              { icon: <Star className="w-8 h-8 text-purple-500" />, title: 'Quality Service', desc: 'Better customer support and reliability' },
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border text-center">
                <div className="inline-block p-3 bg-gray-50 rounded-full mb-4">
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <div key={agent.id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition-shadow">
              {/* Agent Header */}
              <div className="bg-linear-to-r from-blue-50 to-indigo-50 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{agent.name}</h3>
                      {agent.verified && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                    <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mb-2">
                      {agent.badge}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <span className="font-bold">{agent.rating}</span>
                      <span className="text-sm text-gray-500">({agent.reviews})</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {agent.location}
                  </span>
                  <span>•</span>
                  <span>{agent.category}</span>
                  <span>•</span>
                  <span>Since {agent.memberSince}</span>
                </div>
              </div>

              {/* Agent Body */}
              <div className="p-6">
                <p className="text-gray-600 mb-4">{agent.description}</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Active Ads</span>
                    <span className="font-semibold">{agent.activeAds}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Contact</span>
                    <span className="font-semibold">{agent.contact.phone}</span>
                  </div>
                </div>

                {/* Contact Buttons */}
                <div className="flex gap-2 mb-4">
                  <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                    <Phone className="w-4 h-4" />
                    Call Now
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50">
                    <MessageSquare className="w-4 h-4" />
                    Message
                  </button>
                </div>

                {/* View Details */}
                <button className="w-full flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 py-2">
                  View Agent Profile
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Become an Agent Section */}
        <div className="mt-12 bg-linear-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Become a Verified Agent</h2>
            <p className="text-xl text-blue-100 mb-6">
              Grow your business with ikman's verified agent program. Get more visibility and build trust with customers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
                Apply Now
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10">
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                q: 'How do I become a verified agent?',
                a: 'Submit your business registration documents and complete the verification process through our agent portal.'
              },
              {
                q: 'What are the benefits of being a verified agent?',
                a: 'Verified agents get priority listing, trust badges, analytics dashboard, and higher customer trust.'
              },
              {
                q: 'Is there a fee to become an agent?',
                a: 'Basic verification is free. Premium features are available through subscription plans.'
              },
              {
                q: 'How long does verification take?',
                a: 'Typically 1-3 business days after submitting all required documents.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="font-bold text-gray-800 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}