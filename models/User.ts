import mongoose, { Document, Schema } from 'mongoose';

export interface IUserAddress {
  firstName: string;
  lastName: string;
  phone?: string;
  address: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'admin';
  addresses?: IUserAddress[];
  savedProductIds?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<IUserAddress>({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  phone: { type: String, trim: true },
  address: { type: String, required: true, trim: true },
  address2: { type: String, trim: true },
  city: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  zipCode: { type: String, required: true, trim: true },
  country: { type: String, required: true, trim: true },
  isDefault: { type: Boolean, default: false },
});

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    passwordHash: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    addresses: {
      type: [AddressSchema],
      default: [],
    },
    savedProductIds: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent multiple model initialization in development
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);