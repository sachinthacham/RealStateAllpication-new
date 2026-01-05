// app/about/page.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Shield, Trophy, Target, Heart } from 'lucide-react';

export default function AboutPage() {
  const features = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Verified Listings",
      description: "Every property is personally verified by our team to ensure authenticity."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Expert Agents",
      description: "Network of 500+ certified real estate professionals across Sri Lanka."
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Smart Matching",
      description: "AI-powered recommendations based on your preferences and behavior."
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Customer First",
      description: "24/7 support dedicated to helping you find your perfect home."
    }
  ];

  const milestones = [
    { year: "2010", title: "Founded", description: "Started with 3 agents in Colombo" },
    { year: "2014", title: "Expansion", description: "Expanded to 5 major cities" },
    { year: "2018", title: "Digital Platform", description: "Launched online platform" },
    { year: "2022", title: "10K+ Properties", description: "Reached 10,000 property listings" },
    { year: "2024", title: "Market Leader", description: "Largest real estate platform in SL" }
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="bg-linear-to-r from-primary to-primary/90 text-primary-foreground py-16 md:py-24">
        <div className="container px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About RealEstate.lk
            </h1>
            <p className="text-xl opacity-90">
              Sri Lanka's most trusted real estate platform, connecting thousands of buyers, 
              sellers, and agents since 2010.
            </p>
          </div>
        </div>
      </section>

      <div className="container px-4 py-12">
        {/* Our Story */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                Founded in 2010, RealEstate.lk began with a simple mission: to make finding 
                a home in Sri Lanka easier, faster, and more transparent. What started as a 
                small team of three passionate real estate professionals has grown into 
                Sri Lanka's largest property marketplace.
              </p>
              <p className="text-muted-foreground mb-4">
                Today, we serve thousands of customers every month across all 25 districts 
                of Sri Lanka. Our platform brings together cutting-edge technology with 
                deep local market knowledge to provide an exceptional real estate experience.
              </p>
            </div>
            <div className="relative">
              <Card>
                <CardContent className="p-8">
                  <div className="text-5xl font-bold text-primary mb-2">14+</div>
                  <div className="text-lg font-semibold mb-2">Years of Excellence</div>
                  <p className="text-muted-foreground">
                    Serving Sri Lankan families and businesses since 2010
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <div className="text-primary">{feature.icon}</div>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-8">
                <Trophy className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-muted-foreground">
                  To revolutionize Sri Lanka's real estate industry through transparency, 
                  technology, and trust. We aim to make every property transaction 
                  seamless, secure, and satisfying for all parties involved.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-8">
                <Target className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-muted-foreground">
                  To become the most trusted real estate platform in South Asia, 
                  recognized for innovation, integrity, and exceptional customer 
                  experiences that transform how people find their perfect homes.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Milestones */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary/20 hidden md:block"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row items-center ${
                    index % 2 === 0 ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  <div className="md:w-1/2 flex justify-center md:justify-start md:pr-8">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{milestone.year}</div>
                      <h3 className="text-xl font-semibold">{milestone.title}</h3>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="w-4 h-4 bg-primary rounded-full my-4 md:my-0"></div>
                  <div className="md:w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Leadership</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Nimal Perera", role: "CEO & Founder", bio: "20+ years in real estate" },
              { name: "Kamala Silva", role: "CTO", bio: "Tech innovation expert" },
              { name: "Rajith Fernando", role: "Head of Operations", bio: "15+ years experience" }
            ].map((member, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <div className="text-primary font-semibold mb-2">{member.role}</div>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Ready to Find Your Dream Home?</h2>
              <p className="text-muted-foreground mb-6">
                Join thousands of satisfied customers who found their perfect property with us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg">Browse Properties</Button>
                <Button variant="outline" size="lg">Become an Agent</Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}