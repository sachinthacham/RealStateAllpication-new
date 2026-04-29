import mongoose, { Schema, Types } from 'mongoose';

export type InquiryStatus = 'new' | 'contacted' | 'closed';

export interface IInquiry extends mongoose.Document {
  property: Types.ObjectId;
  requester: Types.ObjectId;
  agent: Types.ObjectId;
  message: string;
  contactEmail?: string;
  contactPhone?: string;
  status: InquiryStatus;
  statusNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    property: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    requester: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    agent: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true, trim: true, maxlength: 1500 },
    contactEmail: { type: String, trim: true, lowercase: true },
    contactPhone: { type: String, trim: true },
    status: {
      type: String,
      enum: ['new', 'contacted', 'closed'],
      default: 'new',
    },
    statusNote: { type: String, trim: true, maxlength: 800 },
  },
  { timestamps: true }
);

InquirySchema.index({ requester: 1, createdAt: -1 });
InquirySchema.index({ agent: 1, status: 1, createdAt: -1 });
InquirySchema.index({ property: 1, createdAt: -1 });

export default mongoose.model<IInquiry>('Inquiry', InquirySchema);
