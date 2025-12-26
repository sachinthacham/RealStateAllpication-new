// app/page.tsx
import HomeSearchBar from '@/components/HomeSearchBar';
import FeaturedAgents from '@/components/FeaturedAgents';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Shield, Users, Target, Heart, 
  Home, Building, DollarSign, MapPin 
} from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Verified Listings",
      description: "Every property is personally verified"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "500+ Agents",
      description: "Network of certified professionals"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Smart Search",
      description: "Find your perfect home faster"
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Trusted Service",
      description: "14+ years of excellence"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-linear-to-r from-primary to-primary/90 text-primary-foreground pt-16 pb-24">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Find Your Perfect Property in Sri Lanka
            </h1>
            <p className="text-xl opacity-90 mb-8">
              Browse thousands of verified properties for sale and rent across all 25 districts
            </p>
          </div>

          {/* Search Bar */}
          <HomeSearchBar />
        </div>
      </section>

      {/* Features */}
      <section className="container px-4 -mt-12 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <div className="text-primary">{feature.icon}</div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <div className="container px-4 pb-12">
        {/* Featured Properties */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold">Featured Properties</h2>
              <p className="text-muted-foreground">Recently listed premium properties</p>
            </div>
            <Button variant="outline">View All Properties</Button>
          </div>
         
        </section>

        {/* Stats */}
        <section className="mb-16">
          <Card className="bg-linear-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
                  <div className="text-muted-foreground">Properties</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">500+</div>
                  <div className="text-muted-foreground">Agents</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">25+</div>
                  <div className="text-muted-foreground">Cities</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">14+</div>
                  <div className="text-muted-foreground">Years</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Featured Agents */}
        <FeaturedAgents />
      </div>
    </div>
  );
}