import mongoose, { Schema, model, models, Document } from "mongoose";

// Define the TypeScript interface for the User model
export interface IUser extends Document {
  name: string;
  email: string;
  department: string;
  section: string;
  password: string;
  referralCode: string;
  emailCount?: number;
  ticketSold?: number;
  points?: number;
}

// Define the Mongoose schema
const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    section: { type: String, required: true },
    password: { type: String, required: true },
    referralCode: { type: String, required: true },
    emailCount: { type: Number, default: 0 },
    ticketSold: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Export the User model
const User = models.User || model<IUser>("User", userSchema);
export { User };
