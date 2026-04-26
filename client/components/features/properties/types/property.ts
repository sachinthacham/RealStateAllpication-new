export interface Property {
  _id: string;
  title: string;
  description: string;
  type: 'house' | 'apartment' | 'condo' | 'land' | 'commercial';
  status: 'for_sale' | 'for_rent' | 'sold' | 'rented';
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  yearBuilt?: number;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  amenities: string[];
  images: string[];
  agent:
    | string
    | {
        _id: string;
        name: string;
        email: string;
        phone?: string;
        profileImage?: string;
      };
  createdBy: any;
  averageRating?: number;
  numReviews?: number;
  moderationStatus?: 'pending' | 'approved' | 'rejected';
  moderationNotes?: string;
  whatsappNumber?: string;
  emailContact?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FilterState {
  type: 'buy' | 'rent';
  city: string;
  minPrice: string;
  maxPrice: string;
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  priceRange: [number, number];
}