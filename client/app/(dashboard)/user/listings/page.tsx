"use client";

import { useEffect, useState } from 'react';
import { Eye, MessageSquare, Edit, Trash2, Clock, CheckCircle } from 'lucide-react';
import { propertyApi } from '@/lib/api/properties'; // Use your existing API service
import { Property } from '@/components/features/properties/types/property';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/auth.store';
import Link from 'next/link';

export default function MyAdsPage() {
  const [ads, setAds] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState('All');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { user } = useAuthStore();

  useEffect(() => {
    const fetchMyAds = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const response: any = await propertyApi.getByAgentId(user._id); 
        
        const data = response.data.data || response;
        console.log("Fetched Ads:", data);
        if (Array.isArray(data)) {
          setAds(data);
        }
      } catch (error) {
        console.error("Failed to fetch ads", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyAds();
  }, [user]);

  const handleDelete = async (propertyId: string) => {
    const confirmed = window.confirm('Delete this listing? This action cannot be undone.');
    if (!confirmed) return;
    try {
      setDeletingId(propertyId);
      await propertyApi.delete(propertyId);
      setAds((prev) => prev.filter((item) => item._id !== propertyId));
    } catch (error) {
      console.error("Failed to delete property", error);
    } finally {
      setDeletingId(null);
    }
  };

  // Helper to format date relative to now (e.g., "2 days ago")
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Filter Logic
  const filteredAds = ads.filter(ad => {
    if (filter === 'All') return true;
    return ad.status?.toLowerCase() === filter.toLowerCase().replace(' ', '_');
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Ads</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          + Post New Ad
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-4 mb-6 border-b overflow-x-auto">
        {['All', 'For Sale', 'For Rent', 'Sold', 'Expired'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`pb-2 px-1 whitespace-nowrap transition-colors ${
              filter === tab 
                ? 'border-b-2 border-blue-600 text-blue-600 font-medium' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Ads List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading your ads...</div>
        ) : filteredAds.length === 0 ? (
          <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg">
            No properties found in this category.
          </div>
        ) : (
          filteredAds.map((ad) => (
            <div key={ad._id} className="border rounded-lg p-4 hover:border-blue-500 transition-all group">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                
                {/* Content */}
                <div className="flex-1" >
                <Link href={`/properties/agentview${ad._id}`}>
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                      {ad.title}
                    </h3>
                  </div>
                  </Link>
                  
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    {/* Status Badge */}
                    <Badge variant="outline" className={`
                      flex items-center gap-1 px-2 py-1
                      ${ad.status === 'for_sale' || ad.status === 'for_rent' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                      ${ad.status === 'sold' ? 'bg-gray-100 text-gray-700 border-gray-200' : ''}
                    `}>
                      {ad.status === 'for_sale' || ad.status === 'for_rent' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      <span className="capitalize">{ad.status.replace('_', ' ')}</span>
                    </Badge>

                    {/* Stats */}
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <Eye className="w-4 h-4 text-gray-400" /> 
                      {/* Backend doesn't send views yet, hardcoding or handle safely */}
                      {Math.floor(Math.random() * 100)} views 
                    </span>
                    
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <MessageSquare className="w-4 h-4 text-gray-400" /> 
                      0 inquiries
                    </span>

                    {/* Date */}
                    <span className="text-sm text-gray-400 border-l pl-3 ml-1">
                      Posted on 
                    </span>
                  </div>
                  

                  <div className="mt-2 text-sm text-gray-500">
                    {ad.address?.city}, {ad.address?.state} • {ad.type}
                  </div>
                  
                </div>
               

                {/* Actions */}
                <div className="flex gap-2 self-end sm:self-start">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors" title="Edit">
                    <Edit className="w-4 h-4" />
                  </button>
                    <button
                      disabled={deletingId === ad._id}
                      onClick={() => handleDelete(ad._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}