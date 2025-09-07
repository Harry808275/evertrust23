import mongoose, { Schema, Document } from 'mongoose';

// Item Schema for dynamic content within sections
const ItemSchema = new Schema({
  id: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['product', 'testimonial', 'feature', 'gallery-item', 'card', 'banner']
  },
  title: { type: String, required: true },
  subtitle: { type: String },
  description: { type: String },
  image: { type: String },
  price: { type: Number },
  category: { type: String },
  link: { type: String },
  name: { type: String }, // for testimonials
  role: { type: String }, // for testimonials
  company: { type: String }, // for testimonials
  content: { type: String }, // for testimonials
  rating: { type: Number }, // for testimonials
  avatar: { type: String }, // for testimonials
  icon: { type: String }, // for features
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { _id: false });

// Media Schema for hero and video sections
const MediaSchema = new Schema({
  type: { 
    type: String, 
    required: true,
    enum: ['video', 'image']
  },
  url: { type: String, default: '' },
  alt: { type: String, default: '' },
  poster: { type: String, default: '' }
}, { _id: false });

// Settings Schema with advanced options
const SettingsSchema = new Schema({
  // Basic styling
  backgroundColor: { type: String, default: '#ffffff' },
  textColor: { type: String, default: '#000000' },
  overlayOpacity: { type: Number, default: 0.4, min: 0, max: 1 },
  
  // Layout options
  layout: { 
    type: String, 
    default: 'default',
    enum: [
      'default', 'full-width-video', 'video-center', 'grid-2-columns', 'grid-3-columns', 
      'grid-4-columns', 'masonry-grid', 'carousel', 'hero-split', 'card-stack'
    ]
  },
  
  // Animation and effects
  animation: { 
    type: String, 
    default: 'fade',
    enum: ['fade', 'slide', 'zoom', 'stagger-fade', 'slide-up', 'zoom-in', 'none']
  },
  
  // Text and button styling
  textAlignment: { 
    type: String, 
    default: 'left',
    enum: ['left', 'center', 'right', 'justify']
  },
  buttonStyle: { 
    type: String, 
    default: 'primary',
    enum: ['primary', 'secondary', 'outline', 'ghost', 'link']
  },
  
  // Card and item styling
  cardStyle: { 
    type: String, 
    default: 'default',
    enum: ['default', 'elevated', 'minimal', 'bordered', 'glass']
  },
  
  // Display options
  showPrices: { type: Boolean, default: true },
  showCategories: { type: Boolean, default: true },
  showAvatars: { type: Boolean, default: true },
  showRatings: { type: Boolean, default: true },
  showIcons: { type: Boolean, default: true },
  showOverlays: { type: Boolean, default: true },
  
  // Video specific settings
  videoStyle: { 
    type: String, 
    default: 'default',
    enum: ['default', 'cinematic', 'minimal', 'heroic']
  },
  showControls: { type: Boolean, default: true },
  autoplay: { type: Boolean, default: false },
  loop: { type: Boolean, default: true },
  
  // Icon styling
  iconStyle: { 
    type: String, 
    default: 'default',
    enum: ['default', 'outlined', 'filled', 'duotone', 'gradient']
  },
  
  // Image and hover effects
  imageStyle: { 
    type: String, 
    default: 'default',
    enum: ['default', 'rounded', 'circular', 'squared', 'polaroid']
  },
  hoverEffect: { 
    type: String, 
    default: 'none',
    enum: ['none', 'zoom', 'lift', 'glow', 'shimmer', 'tilt']
  }
}, { _id: false });

// Product Selection Schema for product-section type
const ProductSelectionSchema = new Schema({
  productIds: [{ type: String }], // Array of product IDs to include
  category: { type: String }, // Filter by category
  limit: { type: Number, default: 6 }, // Maximum number of products to show
  sortBy: { 
    type: String, 
    default: 'createdAt',
    enum: ['createdAt', 'name', 'price', 'category', 'popularity']
  },
  sortOrder: { 
    type: String, 
    default: 'desc',
    enum: ['asc', 'desc']
  },
  showOutOfStock: { type: Boolean, default: false },
  featuredOnly: { type: Boolean, default: false }
}, { _id: false });

// Main Content Schema
export interface IContent extends Document {
  type: 'hero' | 'product-showcase' | 'product-section' | 'video-showcase' | 'testimonial-grid' | 'feature-highlight' | 'gallery-showcase';
  title: string;
  subtitle?: string;
  description?: string;
  media?: {
    type: 'video' | 'image';
    url: string;
    alt?: string;
    poster?: string;
  };
  buttonText?: string;
  buttonLink?: string;
  isActive: boolean;
  order: number;
  layout: string;
  settings: {
    backgroundColor?: string;
    textColor?: string;
    overlayOpacity?: number;
    layout?: string;
    animation?: string;
    textAlignment?: string;
    buttonStyle?: string;
    cardStyle?: string;
    showPrices?: boolean;
    showCategories?: boolean;
    showAvatars?: boolean;
    showRatings?: boolean;
    showIcons?: boolean;
    showOverlays?: boolean;
    videoStyle?: string;
    showControls?: boolean;
    autoplay?: boolean;
    loop?: boolean;
    iconStyle?: string;
    imageStyle?: string;
    hoverEffect?: string;
  };
  items?: Array<{
    id: string;
    type: string;
    title: string;
    subtitle?: string;
    description?: string;
    image?: string;
    price?: number;
    category?: string;
    link?: string;
    name?: string;
    role?: string;
    company?: string;
    content?: string;
    rating?: number;
    avatar?: string;
    icon?: string;
    isActive: boolean;
    order: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const ContentSchema = new Schema<IContent>({
  type: { 
    type: String, 
    required: true,
    enum: ['hero', 'product-showcase', 'product-section', 'video-showcase', 'testimonial-grid', 'feature-highlight', 'gallery-showcase']
  },
  title: { type: String, required: true },
  subtitle: { type: String },
  description: { type: String },
  media: MediaSchema,
  buttonText: { type: String },
  buttonLink: { type: String },
  productSelection: ProductSelectionSchema, // For product-section type
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  layout: { type: String, default: 'default' },
  settings: { type: SettingsSchema, default: () => ({}) },
  items: [ItemSchema]
}, {
  timestamps: true
});

// Indexes for better performance
ContentSchema.index({ type: 1, isActive: 1 });
ContentSchema.index({ order: 1 });
ContentSchema.index({ 'items.isActive': 1 });

export default mongoose.models.Content || mongoose.model<IContent>('Content', ContentSchema);
