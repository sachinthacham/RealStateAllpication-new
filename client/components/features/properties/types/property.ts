export interface Property {
  _id: string;
  title: string;
  description: string;
  type: 'house' | 'apartment';
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
  agent: string; // Populated or ID
  createdBy: any;
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