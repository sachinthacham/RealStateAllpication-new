import mongoose, { Schema, Types } from 'mongoose';

export type SavedSearchFrequency = 'instant' | 'daily' | 'weekly';

export interface ISavedSearch extends mongoose.Document {
  user: Types.ObjectId;
  name: string;
  filters: Record<string, unknown>;
  isAlertEnabled: boolean;
  frequency: SavedSearchFrequency;
  isActive: boolean;
  lastRunAt?: Date;
  lastAlertAt?: Date;
  lastResultCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const SavedSearchSchema = new Schema<ISavedSearch>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    filters: { type: Schema.Types.Mixed, required: true, default: {} },
    isAlertEnabled: { type: Boolean, default: true },
    frequency: {
      type: String,
      enum: ['instant', 'daily', 'weekly'],
      default: 'daily',
    },
    isActive: { type: Boolean, default: true },
    lastRunAt: { type: Date },
    lastAlertAt: { type: Date },
    lastResultCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

SavedSearchSchema.index({ user: 1, isActive: 1, createdAt: -1 });
SavedSearchSchema.index({ user: 1, name: 1 }, { unique: true });
SavedSearchSchema.index({ isAlertEnabled: 1, frequency: 1, isActive: 1 });

export default mongoose.model<ISavedSearch>('SavedSearch', SavedSearchSchema);
