import mongoose, { Schema, Document } from 'mongoose';

export interface IEmailCampaign extends Document {
  name: string;
  subject: string;
  type: 'newsletter' | 'promotional' | 'abandoned_cart' | 'welcome' | 'order_confirmation' | 'shipping_update' | 'birthday' | 'reengagement';
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'cancelled';
  template: {
    html: string;
    text?: string;
    variables?: string[]; // Available template variables
  };
  targetAudience: {
    userSegments?: string[]; // 'new', 'returning', 'vip', 'all'
    userTypes?: string[]; // 'guest', 'logged_in'
    locations?: string[]; // country codes
    purchaseHistory?: {
      minOrders?: number;
      maxOrders?: number;
      minSpent?: number;
      maxSpent?: number;
      lastPurchaseDays?: number;
    };
    customFilters?: {
      field: string;
      operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
      value: any;
    }[];
  };
  scheduling: {
    sendAt?: Date;
    timezone?: string;
    frequency?: 'once' | 'daily' | 'weekly' | 'monthly';
    endDate?: Date;
  };
  tracking: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    unsubscribed: number;
    bounced: number;
    complaints: number;
    revenue?: number;
  };
  settings: {
    fromName?: string;
    fromEmail?: string;
    replyTo?: string;
    trackOpens?: boolean;
    trackClicks?: boolean;
    trackRevenue?: boolean;
    allowUnsubscribe?: boolean;
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

const EmailCampaignSchema = new Schema<IEmailCampaign>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  type: {
    type: String,
    required: true,
    enum: ['newsletter', 'promotional', 'abandoned_cart', 'welcome', 'order_confirmation', 'shipping_update', 'birthday', 'reengagement']
  },
  status: {
    type: String,
    required: true,
    enum: ['draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled'],
    default: 'draft'
  },
  template: {
    html: {
      type: String,
      required: true
    },
    text: {
      type: String
    },
    variables: [{
      type: String
    }]
  },
  targetAudience: {
    userSegments: [{
      type: String,
      enum: ['new', 'returning', 'vip', 'all']
    }],
    userTypes: [{
      type: String,
      enum: ['guest', 'logged_in']
    }],
    locations: [{
      type: String,
      maxlength: 2
    }],
    purchaseHistory: {
      minOrders: {
        type: Number,
        min: 0
      },
      maxOrders: {
        type: Number,
        min: 0
      },
      minSpent: {
        type: Number,
        min: 0
      },
      maxSpent: {
        type: Number,
        min: 0
      },
      lastPurchaseDays: {
        type: Number,
        min: 0
      }
    },
    customFilters: [{
      field: {
        type: String,
        required: true
      },
      operator: {
        type: String,
        required: true,
        enum: ['equals', 'not_equals', 'contains', 'greater_than', 'less_than']
      },
      value: {
        type: Schema.Types.Mixed,
        required: true
      }
    }]
  },
  scheduling: {
    sendAt: {
      type: Date
    },
    timezone: {
      type: String,
      default: 'UTC'
    },
    frequency: {
      type: String,
      enum: ['once', 'daily', 'weekly', 'monthly']
    },
    endDate: {
      type: Date
    }
  },
  tracking: {
    sent: {
      type: Number,
      default: 0,
      min: 0
    },
    delivered: {
      type: Number,
      default: 0,
      min: 0
    },
    opened: {
      type: Number,
      default: 0,
      min: 0
    },
    clicked: {
      type: Number,
      default: 0,
      min: 0
    },
    unsubscribed: {
      type: Number,
      default: 0,
      min: 0
    },
    bounced: {
      type: Number,
      default: 0,
      min: 0
    },
    complaints: {
      type: Number,
      default: 0,
      min: 0
    },
    revenue: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  settings: {
    fromName: {
      type: String,
      trim: true
    },
    fromEmail: {
      type: String,
      trim: true
    },
    replyTo: {
      type: String,
      trim: true
    },
    trackOpens: {
      type: Boolean,
      default: true
    },
    trackClicks: {
      type: Boolean,
      default: true
    },
    trackRevenue: {
      type: Boolean,
      default: false
    },
    allowUnsubscribe: {
      type: Boolean,
      default: true
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
EmailCampaignSchema.index({ status: 1, 'scheduling.sendAt': 1 });
EmailCampaignSchema.index({ type: 1 });
EmailCampaignSchema.index({ 'metadata.campaign': 1 });

// Virtual for open rate
EmailCampaignSchema.virtual('openRate').get(function() {
  if (this.tracking.delivered === 0) return 0;
  return (this.tracking.opened / this.tracking.delivered) * 100;
});

// Virtual for click rate
EmailCampaignSchema.virtual('clickRate').get(function() {
  if (this.tracking.delivered === 0) return 0;
  return (this.tracking.clicked / this.tracking.delivered) * 100;
});

// Virtual for unsubscribe rate
EmailCampaignSchema.virtual('unsubscribeRate').get(function() {
  if (this.tracking.delivered === 0) return 0;
  return (this.tracking.unsubscribed / this.tracking.delivered) * 100;
});

// Method to check if campaign is ready to send
EmailCampaignSchema.methods.isReadyToSend = function() {
  const now = new Date();
  return this.status === 'scheduled' && 
         this.scheduling.sendAt && 
         this.scheduling.sendAt <= now;
};

// Method to get target audience count (would need to be implemented with actual user query)
EmailCampaignSchema.methods.getTargetAudienceCount = async function() {
  // This would query the User model based on targetAudience criteria
  // Implementation would depend on your User model structure
  return 0; // Placeholder
};

export default mongoose.models.EmailCampaign || mongoose.model<IEmailCampaign>('EmailCampaign', EmailCampaignSchema);

