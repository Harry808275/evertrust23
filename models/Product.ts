import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Product name cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    images: [{
      type: String,
      required: [true, 'At least one product image is required'],
    }],
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true,
      enum: ['Bags', 'Accessories', 'Home', 'Furniture', 'Decor'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for checking if product is in stock
ProductSchema.virtual('isInStock').get(function() {
  return this.stock > 0;
});

// Pre-save middleware to update inStock based on stock quantity
ProductSchema.pre('save', function(next) {
  this.inStock = this.stock > 0;
  next();
});

// Prevent multiple model initialization in development
export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

































