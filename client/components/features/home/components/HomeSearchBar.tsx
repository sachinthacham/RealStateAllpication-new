"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function HomeSearchBar() {
  const router = useRouter();
  const [type, setType] = useState("for_sale"); // Default
  const [city, setCity] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleSearch = () => {
    // 1. Build the query string
    const params = new URLSearchParams();
    if (type) params.set("status", type); // 'for_sale' or 'for_rent'
    if (city) params.set("city", city);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);

    // 2. Redirect to the properties page with these params
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="surface-card subtle-ring p-4 md:p-5 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
        {/* Type Selector */}
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="h-11 bg-white">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="for_sale">Buy</SelectItem>
            <SelectItem value="for_rent">Rent</SelectItem>
          </SelectContent>
        </Select>

        {/* Location Input */}
        <div className="relative">
          <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="City (e.g. Colombo)"
            className="pl-9 h-11 bg-white"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        {/* Price Range (Simplified for Home) */}
        <div className="flex gap-2">
          <Input
            placeholder="Min Price"
            type="number"
            className="h-11 bg-white"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <Input
            placeholder="Max Price"
            type="number"
            className="h-11 bg-white"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          className="h-11 w-full md:w-auto bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:from-blue-700 hover:to-indigo-700"
        >
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
      </div>
    </div>
  );
}