import mongoose, { Schema, Document } from 'mongoose';

const PropertySchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['house', 'apartment', 'condo', 'land', 'commercial'], 
      required: true 
    },
    status: { 
      type: String, 
      enum: ['for_sale', 'for_rent', 'sold', 'rented'], 
      default: 'for_sale' 
    },
    price: { type: Number, required: true, min: 0 },
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    area: { type: Number, required: true },
    yearBuilt: Number,
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },
    amenities: [String],
    images: [String],
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0, min: 0 },
    moderationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved',
    },
    moderationNotes: { type: String, default: '' },
    whatsappNumber: { type: String, default: '' },
    emailContact: { type: String, default: '' },
    agent: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

PropertySchema.index({ location: '2dsphere' });
PropertySchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Property', PropertySchema);