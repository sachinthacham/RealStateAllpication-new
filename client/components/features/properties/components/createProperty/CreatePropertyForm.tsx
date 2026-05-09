'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { propertySchema, type PropertyFormData } from '@/components/features/properties/schemas/property'; 
import { propertyApi } from '@/lib/api/properties'; // Correct import path
import { ProtectedRoute } from '@/components/features/auth/components/ProtectedRoute';
import { useRouter } from 'next/navigation';

const AMENITIES_LIST = [
  'Swimming Pool', 'Gym', 'Parking', 'Garden', 'Balcony', 
  'Air Conditioning', 'Heating', 'Fireplace', 'Security System', 'Elevator',
];

export default function CreatePropertyForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      type: 'apartment',
      status: 'for_sale',
      amenities: [],
      latitude: 0, 
      longitude: 0,
      // Address defaults
      address: {
        street: '', city: '', state: '', zipCode: '', country: ''
      }
    },
  });

  const selectedAmenities = watch('amenities');

  const handleAmenityToggle = (amenity: string) => {
    const current = selectedAmenities || [];
    if (current.includes(amenity)) {
      setValue('amenities', current.filter((a) => a !== amenity));
    } else {
      setValue('amenities', [...current, amenity]);
    }
  };

  const onSubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const formData = new FormData();
      
      // 1. Append Primitive Fields
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price", data.price.toString());
      formData.append("type", data.type);
      formData.append("status", data.status);
      formData.append("area", data.area.toString());
      formData.append("bedrooms", data.bedrooms.toString());
      formData.append("bathrooms", data.bathrooms.toString());
      if (data.yearBuilt) formData.append("yearBuilt", data.yearBuilt.toString());
      if (data.whatsappNumber) formData.append("whatsappNumber", data.whatsappNumber);
      if (data.emailContact) formData.append("emailContact", data.emailContact);

      // 2. Append Nested Objects
      // Backend should parse these using JSON.parse()
      formData.append("address", JSON.stringify(data.address)); 
      
      // Backend expects amenities as string[]
      // For FormData, we can append multiple times OR stringify.
      // Standard practice with Multer is often sending arrays as JSON strings 
      // OR appending 'amenities[]' multiple times. 
      // Here we use JSON string for safety with the previously established pattern.
      formData.append("amenities", JSON.stringify(data.amenities));
      
      // 3. Construct GeoJSON Location
      formData.append("location", JSON.stringify({
        type: "Point",
        coordinates: [data.longitude, data.latitude] // GeoJSON is [Lng, Lat]
      }));

      // 4. Handle File
      // data.image is a FileList because it comes from <input type="file" />
      if (data.image && data.image.length > 0) {
        // We append it as 'images' to match your Interface expectation (which implies plural)
        // even though we are uploading one file.
        formData.append("images", data.image[0]);
      }

      // 5. API Call
      await propertyApi.create(formData);

      alert('Property created successfully!');
      router.push('/user/listings');
      
    } catch (error: any) {
      console.error("Submission Error:", error);
      // The apiClient interceptor extracts the message, so error.message should be clean
      setServerError(error.message || "Failed to create property. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Styles
  const inputClass = "w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const labelClass = "block text-sm font-medium text-gray-700 mt-4";
  const errorClass = "text-red-500 text-xs mt-1";

  return (
    <ProtectedRoute>
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg my-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Property</h2>

      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded mb-4">
          {serverError}
        </div>
      )}

      {/* --- Basic Info --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className={labelClass}>Property Title</label>
          <input {...register('title')} className={inputClass} placeholder="e.g. Luxury Apartment" />
          {errors.title && <p className={errorClass}>{errors.title.message}</p>}
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Description</label>
          <textarea {...register('description')} rows={4} className={inputClass} />
          {errors.description && <p className={errorClass}>{errors.description.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Type</label>
          <select {...register('type')} className={inputClass}>
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Status</label>
          <select {...register('status')} className={inputClass}>
            <option value="for_sale">For Sale</option>
            <option value="for_rent">For Rent</option>
            <option value="sold">Sold</option>
            <option value="rented">Rented</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Price</label>
          <input type="number" {...register('price', { valueAsNumber: true })} className={inputClass} />
          {errors.price && <p className={errorClass}>{errors.price.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Area (sq ft)</label>
          <input type="number" {...register('area', { valueAsNumber: true })} className={inputClass} />
          {errors.area && <p className={errorClass}>{errors.area.message}</p>}
        </div>

        <div>
          <label className={labelClass}>WhatsApp Number (optional)</label>
          <input {...register('whatsappNumber')} className={inputClass} placeholder="+94771234567" />
        </div>

        <div>
          <label className={labelClass}>Public Contact Email (optional)</label>
          <input type="email" {...register('emailContact')} className={inputClass} placeholder="agent@example.com" />
          {errors.emailContact && <p className={errorClass}>{errors.emailContact.message}</p>}
        </div>
      </div>

      {/* --- Details --- */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div>
          <label className={labelClass}>Bedrooms</label>
          <input type="number" {...register('bedrooms', { valueAsNumber: true })} className={inputClass} />
          {errors.bedrooms && <p className={errorClass}>{errors.bedrooms.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Bathrooms</label>
          <input type="number" {...register('bathrooms', { valueAsNumber: true })} className={inputClass} />
          {errors.bathrooms && <p className={errorClass}>{errors.bathrooms.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Year Built</label>
          <input type="number" {...register('yearBuilt', { valueAsNumber: true })} className={inputClass} />
        </div>
      </div>

      <hr className="my-8 border-gray-200" />

      {/* --- Address Section --- */}
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Location Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className={labelClass}>Street Address</label>
          <input {...register('address.street')} className={inputClass} />
          {errors.address?.street && <p className={errorClass}>{errors.address.street.message}</p>}
        </div>
        <div>
          <label className={labelClass}>City</label>
          <input {...register('address.city')} className={inputClass} />
          {errors.address?.city && <p className={errorClass}>{errors.address.city.message}</p>}
        </div>
        <div>
          <label className={labelClass}>State/Province</label>
          <input {...register('address.state')} className={inputClass} />
           {errors.address?.state && <p className={errorClass}>{errors.address.state.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Zip Code</label>
          <input {...register('address.zipCode')} className={inputClass} />
           {errors.address?.zipCode && <p className={errorClass}>{errors.address.zipCode.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Country</label>
          <input {...register('address.country')} className={inputClass} />
           {errors.address?.country && <p className={errorClass}>{errors.address.country.message}</p>}
        </div>
      </div>

      {/* --- Coordinates --- */}
      <div className="grid grid-cols-2 gap-4 mt-4 bg-gray-50 p-4 rounded">
        <div>
          <label className={labelClass + " mt-0"}>Latitude</label>
          <input type="number" step="any" {...register('latitude', { valueAsNumber: true })} className={inputClass} />
          {errors.latitude && <p className={errorClass}>{errors.latitude.message}</p>}
        </div>
        <div>
          <label className={labelClass + " mt-0"}>Longitude</label>
          <input type="number" step="any" {...register('longitude', { valueAsNumber: true })} className={inputClass} />
          {errors.longitude && <p className={errorClass}>{errors.longitude.message}</p>}
        </div>
      </div>

      <hr className="my-8 border-gray-200" />

      {/* --- Amenities --- */}
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Amenities</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {AMENITIES_LIST.map((item) => (
          <label key={item} className="flex items-center space-x-2 cursor-pointer p-2 border rounded hover:bg-gray-50">
            <input
              type="checkbox"
              value={item}
              checked={(selectedAmenities || []).includes(item)}
              onChange={() => handleAmenityToggle(item)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{item}</span>
          </label>
        ))}
      </div>

      {/* --- File Upload --- */}
      <div className="mt-8">
        <label className={labelClass}>Property Image</label>
        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
          <div className="text-center">
            <input 
              type="file" 
              accept="image/*"
              // register returns { onChange, onBlur, name, ref }
              {...register("image")}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {/* Error handling for file input */}
            {errors.image && <p className={errorClass}>{errors.image.message as string}</p>}
          </div>
        </div>
      </div>

      {/* --- Submit --- */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full mt-8 p-3 text-white font-semibold rounded-lg transition-colors ${
          isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isSubmitting ? 'Creating Property...' : 'Create Property'}
      </button>
    </form>
    </ProtectedRoute>
  );
}