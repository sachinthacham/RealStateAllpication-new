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
    <div className="bg-white p-4 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Type Selector */}
        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="for_sale">Buy</SelectItem>
            <SelectItem value="for_rent">Rent</SelectItem>
          </SelectContent>
        </Select>

        {/* Location Input */}
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="City (e.g. Colombo)"
            className="pl-9"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        {/* Price Range (Simplified for Home) */}
        <div className="flex gap-2">
          <Input
            placeholder="Min Price"
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <Input
            placeholder="Max Price"
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          className="w-full md:w-auto bg-primary hover:bg-primary/90"
        >
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
      </div>
    </div>
  );
}