import { Schema, model, Document, Types } from "mongoose";

export interface IMessage {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  property?: Types.ObjectId;
  text: string;
  read?: boolean;
  createdAt?: Date;
}

export interface IMessageModel extends IMessage, Document {}

const messageSchema = new Schema<IMessageModel>(
  {
    sender: { type: Types.ObjectId, ref: "User", required: true },
    receiver: { type: Types.ObjectId, ref: "User", required: true },
    property: { type: Types.ObjectId, ref: "Property" },
    text: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const MessageModel = model<IMessageModel>("Message", messageSchema);
