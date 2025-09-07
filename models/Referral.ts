import mongoose, { Schema, Document } from 'mongoose';

export interface IReferral extends Document {
  referrerId: string; // User who made the referral
  referredId: string; // User who was referred
  referralCode: string; // Unique referral code
  status: 'pending' | 'completed' | 'expired' | 'cancelled';
  rewardType: 'discount' | 'credit' | 'points' | 'free_shipping';
  rewardValue: number; // Reward amount in cents or points
  rewardStatus: 'pending' | 'earned' | 'redeemed' | 'expired';
  conditions: {
    minimumOrderAmount?: number; // Minimum order amount to qualify
    maximumRewardAmount?: number; // Maximum reward amount
    expiryDays?: number; // Days until referral expires
    rewardExpiryDays?: number; // Days until reward expires
  };
  tracking: {
    signupDate?: Date; // When referred user signed up
    firstOrderDate?: Date; // When referred user made first order
    firstOrderAmount?: number; // Amount of first order
    totalOrders?: number; // Total orders by referred user
    totalSpent?: number; // Total amount spent by referred user
  };
  metadata?: {
    source?: string; // Where referral came from
    campaign?: string; // Marketing campaign
    notes?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ReferralSchema = new Schema<IReferral>({
  referrerId: {
    type: String,
    required: true,
    ref: 'User'
  },
  referredId: {
    type: String,
    required: true,
    ref: 'User'
  },
  referralCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'expired', 'cancelled'],
    default: 'pending'
  },
  rewardType: {
    type: String,
    required: true,
    enum: ['discount', 'credit', 'points', 'free_shipping']
  },
  rewardValue: {
    type: Number,
    required: true,
    min: 0
  },
  rewardStatus: {
    type: String,
    required: true,
    enum: ['pending', 'earned', 'redeemed', 'expired'],
    default: 'pending'
  },
  conditions: {
    minimumOrderAmount: {
      type: Number,
      min: 0
    },
    maximumRewardAmount: {
      type: Number,
      min: 0
    },
    expiryDays: {
      type: Number,
      default: 30,
      min: 1
    },
    rewardExpiryDays: {
      type: Number,
      default: 90,
      min: 1
    }
  },
  tracking: {
    signupDate: {
      type: Date
    },
    firstOrderDate: {
      type: Date
    },
    firstOrderAmount: {
      type: Number,
      min: 0
    },
    totalOrders: {
      type: Number,
      default: 0,
      min: 0
    },
    totalSpent: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  metadata: {
    source: {
      type: String,
      trim: true
    },
    campaign: {
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
ReferralSchema.index({ referrerId: 1 });
ReferralSchema.index({ referredId: 1 });
ReferralSchema.index({ referralCode: 1 });
ReferralSchema.index({ status: 1, rewardStatus: 1 });

// Virtual for checking if referral is expired
ReferralSchema.virtual('isExpired').get(function() {
  if (this.status === 'completed' || this.status === 'cancelled') return false;
  
  const expiryDate = new Date(this.createdAt);
  expiryDate.setDate(expiryDate.getDate() + (this.conditions.expiryDays || 30));
  
  return new Date() > expiryDate;
});

// Virtual for checking if reward is expired
ReferralSchema.virtual('isRewardExpired').get(function() {
  if (this.rewardStatus === 'redeemed' || this.rewardStatus === 'expired') return true;
  
  const rewardExpiryDate = new Date(this.tracking.firstOrderDate || this.createdAt);
  rewardExpiryDate.setDate(rewardExpiryDate.getDate() + (this.conditions.rewardExpiryDays || 90));
  
  return new Date() > rewardExpiryDate;
});

// Method to generate referral code
ReferralSchema.statics.generateReferralCode = function(userId: string) {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${userId.substring(0, 4).toUpperCase()}${timestamp}${random}`.toUpperCase();
};

// Method to check if referral is valid
ReferralSchema.methods.isValid = function() {
  return this.status === 'pending' && !this.isExpired;
};

// Method to complete referral
ReferralSchema.methods.completeReferral = function(orderAmount: number) {
  if (this.status !== 'pending') return false;
  
  // Check minimum order amount
  if (this.conditions.minimumOrderAmount && orderAmount < this.conditions.minimumOrderAmount) {
    return false;
  }
  
  this.status = 'completed';
  this.rewardStatus = 'earned';
  this.tracking.firstOrderDate = new Date();
  this.tracking.firstOrderAmount = orderAmount;
  this.tracking.totalOrders = 1;
  this.tracking.totalSpent = orderAmount;
  
  return true;
};

// Method to update tracking
ReferralSchema.methods.updateTracking = function(orderAmount: number) {
  this.tracking.totalOrders += 1;
  this.tracking.totalSpent += orderAmount;
  
  if (!this.tracking.firstOrderDate) {
    this.tracking.firstOrderDate = new Date();
    this.tracking.firstOrderAmount = orderAmount;
  }
  
  return this.save();
};

export default mongoose.models.Referral || mongoose.model<IReferral>('Referral', ReferralSchema);

