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

// // app/page.tsx
// import HomeSearchBar from '@/components/features/home/components/HomeSearchBar';
// import FeaturedAgents from '@/components/features/home/components/FeaturedAgents';
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import {
//   Shield, Users, Target, Heart,
// } from 'lucide-react';

// export default function HomePage() {
//   const features = [
//     {
//       icon: <Shield className="h-8 w-8" />,
//       title: "Verified Listings",
//       description: "Every property is personally verified"
//     },
//     {
//       icon: <Users className="h-8 w-8" />,
//       title: "500+ Agents",
//       description: "Network of certified professionals"
//     },
//     {
//       icon: <Target className="h-8 w-8" />,
//       title: "Smart Search",
//       description: "Find your perfect home faster"
//     },
//     {
//       icon: <Heart className="h-8 w-8" />,
//       title: "Trusted Service",
//       description: "14+ years of excellence"
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Hero Section */}
//       <section className="bg-linear-to-r from-primary to-primary/90 text-primary-foreground pt-16 pb-24">
//         <div className="container px-4">
//           <div className="max-w-3xl mx-auto text-center">
//             <h1 className="text-4xl md:text-5xl font-bold mb-6">
//               Find Your Perfect Property in Sri Lanka
//             </h1>
//             <p className="text-xl opacity-90 mb-8">
//               Browse thousands of verified properties for sale and rent across all 25 districts
//             </p>
//           </div>

//           {/* Search Bar */}
//           <HomeSearchBar />
//         </div>
//       </section>

//       {/* Features */}
//       <section className="container px-4 -mt-12 mb-16">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {features.map((feature, index) => (
//             <Card key={index} className="text-center">
//               <CardContent className="pt-6">
//                 <div className="flex justify-center mb-4">
//                   <div className="p-3 bg-primary/10 rounded-full">
//                     <div className="text-primary">{feature.icon}</div>
//                   </div>
//                 </div>
//                 <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
//                 <p className="text-sm text-muted-foreground">{feature.description}</p>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </section>

//       <div className="container px-4 pb-12">
//         {/* Featured Properties */}
//         <section className="mb-16">
//           <div className="flex justify-between items-center mb-8">
//             <div>
//               <h2 className="text-3xl font-bold">Featured Properties</h2>
//               <p className="text-muted-foreground">Recently listed premium properties</p>
//             </div>
//             <Button variant="outline">View All Properties</Button>
//           </div>

//         </section>

//         {/* Stats */}
//         <section className="mb-16">
//           <Card className="bg-linear-to-r from-primary/5 to-primary/10 border-primary/20">
//             <CardContent className="p-8">
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
//                 <div>
//                   <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
//                   <div className="text-muted-foreground">Properties</div>
//                 </div>
//                 <div>
//                   <div className="text-3xl font-bold text-primary mb-2">500+</div>
//                   <div className="text-muted-foreground">Agents</div>
//                 </div>
//                 <div>
//                   <div className="text-3xl font-bold text-primary mb-2">25+</div>
//                   <div className="text-muted-foreground">Cities</div>
//                 </div>
//                 <div>
//                   <div className="text-3xl font-bold text-primary mb-2">14+</div>
//                   <div className="text-muted-foreground">Years</div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </section>

//         {/* Featured Agents */}
//         <FeaturedAgents />
//       </div>
//     </div>
//   );
// }