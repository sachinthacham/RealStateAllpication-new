export const SUBSCRIPTION_PLANS = {
    REGULAR: {
      name: 'Regular',
      price: 0,
      maxListings: 1,
      featuredListings: 0,
      supportPriority: 'low',
    },
    BUSINESS: {
      name: 'Business',
      price: 5000, 
      maxListings: 10,
      featuredListings: 3,
      supportPriority: 'medium',
    },
    PREMIUM: {
      name: 'Premium',
      price: 15000, // LKR
      maxListings: 1000, 
      featuredListings: 20,
      supportPriority: 'high',
    }
  };
  
  export type PlanType = 'REGULAR' | 'BUSINESS' | 'PREMIUM';