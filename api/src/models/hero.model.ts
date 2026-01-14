import mongoose, { Document, Schema } from 'mongoose';

export interface IHero extends Document {
  sectionId: string;
  title: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const heroSchema = new Schema<IHero>(
  {
    sectionId: {
      type: String,
      default: 'homepage_hero',
      unique: true,
      select: false, // Internal logic only
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Hero = mongoose.model<IHero>('Hero', heroSchema);