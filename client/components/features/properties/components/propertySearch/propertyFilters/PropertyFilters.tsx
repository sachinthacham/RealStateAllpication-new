"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL params (so filters persist on refresh)
  const [filters, setFilters] = useState({
    city: searchParams.get("city") || "",
    status: searchParams.get("status") || "all",
    type: searchParams.get("type") || "all",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    bedrooms: searchParams.get("bedrooms") || "",
  });

  // Update filters when user types/selects
  const handleChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Apply Filters = Update URL
  const applyFilters = () => {
    const params = new URLSearchParams();
    
    // Only add params that have values
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "all") {
        params.set(key, value);
      }
    });
    router.push(`/search?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({ city: "", status: "all", type: "all", minPrice: "", maxPrice: "", bedrooms: "" });
    router.push("/properties");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
      <h3 className="font-bold text-lg">Filter Properties</h3>

      {/* Location */}
      <div className="space-y-2">
        <Label>Location</Label>
        <Input 
          placeholder="Enter city..." 
          value={filters.city} 
          onChange={(e) => handleChange("city", e.target.value)} 
        />
      </div>

      {/* Status (Rent/Buy) */}
      <div className="space-y-2">
        <Label>Status</Label>
        <Select value={filters.status} onValueChange={(val) => handleChange("status", val)}>
          <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any</SelectItem>
            <SelectItem value="for_sale">For Sale</SelectItem>
            <SelectItem value="for_rent">For Rent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Property Type */}
      <div className="space-y-2">
        <Label>Property Type</Label>
        <Select value={filters.type} onValueChange={(val) => handleChange("type", val)}>
          <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any</SelectItem>
            <SelectItem value="house">House</SelectItem>
            <SelectItem value="apartment">Apartment</SelectItem>
            <SelectItem value="land">Land</SelectItem>
            <SelectItem value="villa">Villa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <Label>Price Range</Label>
        <div className="flex gap-2">
          <Input 
            placeholder="Min" 
            type="number" 
            value={filters.minPrice}
            onChange={(e) => handleChange("minPrice", e.target.value)}
          />
          <Input 
            placeholder="Max" 
            type="number" 
            value={filters.maxPrice}
            onChange={(e) => handleChange("maxPrice", e.target.value)}
          />
        </div>
      </div>

      {/* Bedrooms */}
      <div className="space-y-2">
        <Label>Bedrooms</Label>
        <Select value={filters.bedrooms} onValueChange={(val) => handleChange("bedrooms", val)}>
          <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any</SelectItem>
            <SelectItem value="1">1+</SelectItem>
            <SelectItem value="2">2+</SelectItem>
            <SelectItem value="3">3+</SelectItem>
            <SelectItem value="4">4+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="pt-4 flex flex-col gap-2">
        <Button onClick={applyFilters} className="w-full">Apply Filters</Button>
        <Button variant="outline" onClick={clearFilters} className="w-full">Reset</Button>
      </div>
    </div>
  );
}