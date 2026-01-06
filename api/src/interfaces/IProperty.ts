export interface IProperty {
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
  
  export interface IPropertyQuery {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    city?: string;
    state?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }
  
  export interface IPropertyResponse {
    success: boolean;
    message?: string;
    data?: any;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }