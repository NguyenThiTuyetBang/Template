import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  role: "user" | "ai";
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    role: {
      type: String,
      enum: ["user", "ai"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  },
);

const Message = mongoose.model<IMessage>("Message", messageSchema);

export default Message;
