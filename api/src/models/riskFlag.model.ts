import mongoose, { Schema, Types } from 'mongoose';

export interface IRiskFlag extends mongoose.Document {
  targetType: 'user' | 'property' | 'review';
  targetId: Types.ObjectId;
  score: number;
  reasons: string[];
  status: 'open' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}

const RiskFlagSchema = new Schema<IRiskFlag>(
  {
    targetType: { type: String, enum: ['user', 'property', 'review'], required: true },
    targetId: { type: Schema.Types.ObjectId, required: true },
    score: { type: Number, required: true, min: 0 },
    reasons: [{ type: String }],
    status: { type: String, enum: ['open', 'resolved'], default: 'open' },
  },
  { timestamps: true }
);

RiskFlagSchema.index({ status: 1, createdAt: -1 });
RiskFlagSchema.index({ targetType: 1, targetId: 1, createdAt: -1 });

export default mongoose.model<IRiskFlag>('RiskFlag', RiskFlagSchema);
