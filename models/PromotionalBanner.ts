import mongoose, { Schema, Document } from 'mongoose';

export interface IPromotionalBanner extends Document {
  title: string;
  subtitle?: string;
  description?: string;
  type: 'hero' | 'top_bar' | 'sidebar' | 'popup' | 'banner' | 'notification';
  position: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'full_width';
  priority: number; // Higher number = higher priority
  isActive: boolean;
  startDate: Date;
  endDate: Date;
  targetAudience: {
    userTypes?: string[]; // 'guest', 'logged_in', 'new_user', 'returning_user'
    userSegments?: string[]; // 'vip', 'premium', 'standard'
    locations?: string[]; // country codes
    devices?: string[]; // 'mobile', 'desktop', 'tablet'
    browsers?: string[]; // 'chrome', 'firefox', 'safari', etc.
  };
  displayRules: {
    showOnPages?: string[]; // page paths
    hideOnPages?: string[]; // page paths
    showAfterDelay?: number; // seconds
    showFrequency?: 'once' | 'daily' | 'weekly' | 'always';
    maxDisplays?: number; // per user
    minTimeBetweenDisplays?: number; // hours
  };
  content: {
    text?: string;
    buttonText?: string;
    buttonLink?: string;
    backgroundColor?: string;
    textColor?: string;
    buttonColor?: string;
    imageUrl?: string;
    videoUrl?: string;
    icon?: string;
  };
  tracking: {
    impressions: number;
    clicks: number;
    conversions: number;
    uniqueViews: number;
  };
  metadata?: {
    campaign?: string;
    createdBy?: string;
    notes?: string;
    tags?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const PromotionalBannerSchema = new Schema<IPromotionalBanner>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  subtitle: {
    type: String,
    trim: true,
    maxlength: 300
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  type: {
    type: String,
    required: true,
    enum: ['hero', 'top_bar', 'sidebar', 'popup', 'banner', 'notification']
  },
  position: {
    type: String,
    required: true,
    enum: ['top', 'bottom', 'left', 'right', 'center', 'full_width']
  },
  priority: {
    type: Number,
    default: 1,
    min: 1,
    max: 10
  },
  isActive: {
    type: Boolean,
    default: true
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  targetAudience: {
    userTypes: [{
      type: String,
      enum: ['guest', 'logged_in', 'new_user', 'returning_user']
    }],
    userSegments: [{
      type: String,
      enum: ['vip', 'premium', 'standard']
    }],
    locations: [{
      type: String,
      maxlength: 2 // country codes
    }],
    devices: [{
      type: String,
      enum: ['mobile', 'desktop', 'tablet']
    }],
    browsers: [{
      type: String
    }]
  },
  displayRules: {
    showOnPages: [{
      type: String
    }],
    hideOnPages: [{
      type: String
    }],
    showAfterDelay: {
      type: Number,
      min: 0
    },
    showFrequency: {
      type: String,
      enum: ['once', 'daily', 'weekly', 'always'],
      default: 'always'
    },
    maxDisplays: {
      type: Number,
      min: 1
    },
    minTimeBetweenDisplays: {
      type: Number,
      min: 0
    }
  },
  content: {
    text: {
      type: String,
      trim: true,
      maxlength: 1000
    },
    buttonText: {
      type: String,
      trim: true,
      maxlength: 50
    },
    buttonLink: {
      type: String,
      trim: true
    },
    backgroundColor: {
      type: String,
      trim: true
    },
    textColor: {
      type: String,
      trim: true
    },
    buttonColor: {
      type: String,
      trim: true
    },
    imageUrl: {
      type: String,
      trim: true
    },
    videoUrl: {
      type: String,
      trim: true
    },
    icon: {
      type: String,
      trim: true
    }
  },
  tracking: {
    impressions: {
      type: Number,
      default: 0,
      min: 0
    },
    clicks: {
      type: Number,
      default: 0,
      min: 0
    },
    conversions: {
      type: Number,
      default: 0,
      min:  0
    },
    uniqueViews: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  metadata: {
    campaign: {
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
    },
    tags: [{
      type: String,
      trim: true
    }]
  }
}, {
  timestamps: true
});

// Indexes for performance
PromotionalBannerSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
PromotionalBannerSchema.index({ type: 1, position: 1 });
PromotionalBannerSchema.index({ priority: -1 });

// Virtual for checking if banner is currently active
PromotionalBannerSchema.virtual('isCurrentlyActive').get(function() {
  const now = new Date();
  return this.isActive && now >= this.startDate && now <= this.endDate;
});

// Method to check if banner should be shown to user
PromotionalBannerSchema.methods.shouldShowToUser = function(userInfo: any, pagePath: string) {
  if (!this.isCurrentlyActive) return false;
  
  // Check target audience
  if (this.targetAudience.userTypes && this.targetAudience.userTypes.length > 0) {
    const userType = userInfo.isLoggedIn ? 'logged_in' : 'guest';
    if (!this.targetAudience.userTypes.includes(userType)) return false;
  }
  
  // Check display rules
  if (this.displayRules.showOnPages && this.displayRules.showOnPages.length > 0) {
    const shouldShow = this.displayRules.showOnPages.some(page => 
      pagePath.startsWith(page) || page === '*'
    );
    if (!shouldShow) return false;
  }
  
  if (this.displayRules.hideOnPages && this.displayRules.hideOnPages.length > 0) {
    const shouldHide = this.displayRules.hideOnPages.some(page => 
      pagePath.startsWith(page) || page === '*'
    );
    if (shouldHide) return false;
  }
  
  return true;
};

// Method to track impression
PromotionalBannerSchema.methods.trackImpression = function() {
  this.tracking.impressions += 1;
  return this.save();
};

// Method to track click
PromotionalBannerSchema.methods.trackClick = function() {
  this.tracking.clicks += 1;
  return this.save();
};

export default mongoose.models.PromotionalBanner || mongoose.model<IPromotionalBanner>('PromotionalBanner', PromotionalBannerSchema);

