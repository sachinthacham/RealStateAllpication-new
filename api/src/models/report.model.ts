import mongoose, { Schema, Types } from 'mongoose';

export type ReportTargetType = 'property' | 'user' | 'review';
export type ReportStatus = 'open' | 'in_review' | 'resolved' | 'rejected';

export interface IReport extends mongoose.Document {
  reporter: Types.ObjectId;
  targetType: ReportTargetType;
  targetId: Types.ObjectId;
  reason:
    | 'spam'
    | 'fraud'
    | 'misleading_information'
    | 'offensive_content'
    | 'duplicate_listing'
    | 'other';
  description?: string;
  status: ReportStatus;
  resolutionNote?: string;
  reviewedBy?: Types.ObjectId;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    reporter: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    targetType: {
      type: String,
      enum: ['property', 'user', 'review'],
      required: true,
    },
    targetId: { type: Schema.Types.ObjectId, required: true },
    reason: {
      type: String,
      enum: [
        'spam',
        'fraud',
        'misleading_information',
        'offensive_content',
        'duplicate_listing',
        'other',
      ],
      required: true,
    },
    description: { type: String, trim: true, maxlength: 1200 },
    status: {
      type: String,
      enum: ['open', 'in_review', 'resolved', 'rejected'],
      default: 'open',
    },
    resolutionNote: { type: String, trim: true, maxlength: 1200 },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

ReportSchema.index({ status: 1, createdAt: -1 });
ReportSchema.index({ targetType: 1, targetId: 1, createdAt: -1 });
ReportSchema.index({ reporter: 1, createdAt: -1 });

export default mongoose.model<IReport>('Report', ReportSchema);
