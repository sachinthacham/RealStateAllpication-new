import mongoose, { Schema, Types } from 'mongoose';

export interface IChatThread extends mongoose.Document {
  participants: Types.ObjectId[];
  property?: Types.ObjectId;
  lastMessage?: string;
  lastMessageAt?: Date;
  isEscalated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ChatThreadSchema = new Schema<IChatThread>(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    property: { type: Schema.Types.ObjectId, ref: 'Property' },
    lastMessage: { type: String },
    lastMessageAt: { type: Date },
    isEscalated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ChatThreadSchema.index({ participants: 1, updatedAt: -1 });

export default mongoose.model<IChatThread>('ChatThread', ChatThreadSchema);
