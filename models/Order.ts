import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  name: string;
  image: string;
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  externalOrderId?: string; // CJ order id
  trackingUrl?: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  specialInstructions?: string;
  privacyInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative'],
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const OrderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [OrderItemSchema],
    totalPrice: {
      type: Number,
      required: true,
      min: [0, 'Total price cannot be negative'],
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    customerEmail: {
      type: String,
      trim: true,
      maxlength: [100, 'Email cannot be more than 100 characters'],
    },
    customerPhone: {
      type: String,
      trim: true,
      maxlength: [20, 'Phone number cannot be more than 20 characters'],
    },
    shippingAddress: {
      firstName: {
        type: String,
        required: true,
        trim: true,
      },
      lastName: {
        type: String,
        required: true,
        trim: true,
      },
      address: {
        type: String,
        required: true,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
      state: {
        type: String,
        required: true,
        trim: true,
      },
      zipCode: {
        type: String,
        required: true,
        trim: true,
      },
      country: {
        type: String,
        required: true,
        trim: true,
      },
    },
    specialInstructions: {
      type: String,
      trim: true,
      maxlength: [500, 'Special instructions cannot be more than 500 characters'],
    },
    externalOrderId: {
      type: String,
      index: true,
    },
    trackingUrl: {
      type: String,
      trim: true,
    },
    privacyInstructions: {
      type: String,
      trim: true,
      maxlength: [500, 'Privacy instructions cannot be more than 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent multiple model initialization in development
export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);









































