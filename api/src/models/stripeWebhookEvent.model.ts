import mongoose, { Schema } from 'mongoose';

export interface IStripeWebhookEvent extends mongoose.Document {
  eventId: string;
  eventType: string;
  processedAt: Date;
}

const StripeWebhookEventSchema = new Schema<IStripeWebhookEvent>(
  {
    eventId: { type: String, required: true, unique: true, index: true },
    eventType: { type: String, required: true },
    processedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IStripeWebhookEvent>('StripeWebhookEvent', StripeWebhookEventSchema);
