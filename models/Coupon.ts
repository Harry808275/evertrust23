import mongoose, { Schema, Document } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  name: string;
  description?: string;
  type: 'percentage' | 'fixed' | 'free_shipping' | 'buy_x_get_y';
  value: number; // percentage (0-100) or fixed amount in cents
  minimumAmount?: number; // minimum order amount in cents
  maximumDiscount?: number; // maximum discount amount in cents (for percentage)
  usageLimit?: number; // total usage limit
  usageCount: number; // current usage count
  userLimit?: number; // usage limit per user
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
  applicableProducts?: string[]; // product IDs
  applicableCategories?: string[]; // category names
  excludedProducts?: string[]; // excluded product IDs
  excludedCategories?: string[]; // excluded category names
  customerSegments?: string[]; // 'new', 'returning', 'vip', etc.
  conditions?: {
    firstTimeOnly?: boolean;
    minimumQuantity?: number;
    maximumQuantity?: number;
    specificProducts?: string[];
    specificCategories?: string[];
  };
  metadata?: {
    campaign?: string;
    source?: string;
    createdBy?: string;
    notes?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  type: {
    type: String,
    required: true,
    enum: ['percentage', 'fixed', 'free_shipping', 'buy_x_get_y']
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  minimumAmount: {
    type: Number,
    min: 0
  },
  maximumDiscount: {
    type: Number,
    min: 0
  },
  usageLimit: {
    type: Number,
    min: 1
  },
  usageCount: {
    type: Number,
    default: 0,
    min: 0
  },
  userLimit: {
    type: Number,
    min: 1
  },
  validFrom: {
    type: Date,
    required: true,
    default: Date.now
  },
  validUntil: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  applicableProducts: [{
    type: String
  }],
  applicableCategories: [{
    type: String
  }],
  excludedProducts: [{
    type: String
  }],
  excludedCategories: [{
    type: String
  }],
  customerSegments: [{
    type: String,
    enum: ['new', 'returning', 'vip', 'all']
  }],
  conditions: {
    firstTimeOnly: {
      type: Boolean,
      default: false
    },
    minimumQuantity: {
      type: Number,
      min: 1
    },
    maximumQuantity: {
      type: Number,
      min: 1
    },
    specificProducts: [{
      type: String
    }],
    specificCategories: [{
      type: String
    }]
  },
  metadata: {
    campaign: {
      type: String,
      trim: true
    },
    source: {
      type: String,
      trim: true
    },
    createdBy: {
      type: String,
      trim: true
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 1000
    }
  }
}, {
  timestamps: true
});

// Indexes for performance
CouponSchema.index({ code: 1 });
CouponSchema.index({ isActive: 1, validFrom: 1, validUntil: 1 });
CouponSchema.index({ type: 1 });

// Virtual for checking if coupon is valid
CouponSchema.virtual('isValid').get(function() {
  const now = new Date();
  return this.isActive && 
         now >= this.validFrom && 
         now <= this.validUntil &&
         (!this.usageLimit || this.usageCount < this.usageLimit);
});

// Method to check if coupon can be used
CouponSchema.methods.canBeUsed = function(userId?: string, orderAmount?: number, products?: any[]) {
  if (!this.isValid) return false;
  
  // Check minimum amount
  if (this.minimumAmount && orderAmount && orderAmount < this.minimumAmount) {
    return false;
  }
  
  // Check usage limit
  if (this.usageLimit && this.usageCount >= this.usageLimit) {
    return false;
  }
  
  return true;
};

// Method to calculate discount
CouponSchema.methods.calculateDiscount = function(orderAmount: number, products?: any[]) {
  if (!this.canBeUsed(undefined, orderAmount, products)) {
    return 0;
  }
  
  let discount = 0;
  
  switch (this.type) {
    case 'percentage':
      discount = (orderAmount * this.value) / 100;
      if (this.maximumDiscount && discount > this.maximumDiscount) {
        discount = this.maximumDiscount;
      }
      break;
    case 'fixed':
      discount = this.value;
      break;
    case 'free_shipping':
      // This would be handled separately in shipping calculation
      discount = 0;
      break;
    case 'buy_x_get_y':
      // This would need more complex logic based on products
      discount = 0;
      break;
  }
  
  return Math.min(discount, orderAmount); // Can't discount more than order amount
};

export default mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema);

