import mongoose, { Schema, Types } from 'mongoose';

export type VisitStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'rescheduled'
  | 'completed'
  | 'cancelled';

export interface IVisit extends mongoose.Document {
  property: Types.ObjectId;
  requester: Types.ObjectId;
  agent: Types.ObjectId;
  requestedStartAt: Date;
  requestedEndAt: Date;
  scheduledStartAt?: Date;
  scheduledEndAt?: Date;
  status: VisitStatus;
  requesterNote?: string;
  agentNote?: string;
  decisionReason?: string;
  cancelledBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const VisitSchema = new Schema<IVisit>(
  {
    property: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    requester: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    agent: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    requestedStartAt: { type: Date, required: true },
    requestedEndAt: { type: Date, required: true },
    scheduledStartAt: { type: Date },
    scheduledEndAt: { type: Date },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'rescheduled', 'completed', 'cancelled'],
      default: 'pending',
    },
    requesterNote: { type: String, trim: true, maxlength: 1200 },
    agentNote: { type: String, trim: true, maxlength: 1200 },
    decisionReason: { type: String, trim: true, maxlength: 800 },
    cancelledBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

VisitSchema.index({ requester: 1, createdAt: -1 });
VisitSchema.index({ agent: 1, status: 1, createdAt: -1 });
VisitSchema.index({ property: 1, status: 1, createdAt: -1 });
VisitSchema.index({ agent: 1, scheduledStartAt: 1, scheduledEndAt: 1 });

export default mongoose.model<IVisit>('Visit', VisitSchema);
