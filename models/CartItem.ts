import mongoose, { Document, Schema } from 'mongoose';

export interface ICartItem extends Document {
  userId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
      default: 1,
    },
    selectedSize: {
      type: String,
      trim: true,
    },
    selectedColor: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure unique cart items per user and product combination
CartItemSchema.index({ userId: 1, productId: 1, selectedSize: 1, selectedColor: 1 }, { unique: true });

// Prevent multiple model initialization in development
export default mongoose.models.CartItem || mongoose.model<ICartItem>('CartItem', CartItemSchema);

































