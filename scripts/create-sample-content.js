import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
}

// Content Schema - Using the same structure as the actual Content model
const ContentSchema = new mongoose.Schema({
  type: { 
    type: String, 
    required: true,
    enum: ['hero', 'product-showcase', 'product-section', 'video-showcase', 'testimonial-grid', 'feature-highlight', 'gallery-showcase']
  },
  title: { type: String, required: true },
  subtitle: String,
  description: String,
  media: {
    type: { 
      type: String, 
      required: true,
      enum: ['video', 'image']
    },
    url: { type: String, default: '' },
    alt: { type: String, default: '' },
    poster: { type: String, default: '' }
  },
  buttonText: String,
  buttonLink: String,
  productSelection: {
    productIds: [{ type: String }],
    category: String,
    limit: { type: Number, default: 6 },
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
  },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  settings: {
    backgroundColor: { type: String, default: '#ffffff' },
    textColor: { type: String, default: '#000000' },
    overlayOpacity: { type: Number, default: 0.4, min: 0, max: 1 },
    layout: { 
      type: String, 
      default: 'default',
      enum: [
        'default', 'full-width-video', 'video-center', 'grid-2-columns', 'grid-3-columns', 
        'grid-4-columns', 'masonry-grid', 'carousel', 'hero-split', 'card-stack'
      ]
    },
    animation: { 
      type: String, 
      default: 'fade',
      enum: ['fade', 'slide', 'zoom', 'stagger-fade', 'slide-up', 'zoom-in', 'none']
    },
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
    cardStyle: { 
      type: String, 
      default: 'default',
      enum: ['default', 'elevated', 'minimal', 'bordered', 'glass']
    },
    showPrices: { type: Boolean, default: true },
    showCategories: { type: Boolean, default: true },
    showAvatars: { type: Boolean, default: true },
    showRatings: { type: Boolean, default: true },
    showIcons: { type: Boolean, default: true },
    showOverlays: { type: Boolean, default: true },
    videoStyle: { 
      type: String, 
      default: 'default',
      enum: ['default', 'cinematic', 'minimal', 'heroic']
    },
    showControls: { type: Boolean, default: true },
    autoplay: { type: Boolean, default: false },
    loop: { type: Boolean, default: true },
    iconStyle: { 
      type: String, 
      default: 'default',
      enum: ['default', 'outlined', 'filled', 'duotone', 'gradient']
    },
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
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Content = mongoose.model('Content', ContentSchema);

async function createSampleContent() {
  try {
    await connectDB();
    
    // Clear existing content
    await Content.deleteMany({});
    console.log('Cleared existing content');
    
    // Create sample content that will definitely work
    const sampleContent = [
      {
        type: 'hero',
        title: 'STYLE AT HOME',
        subtitle: 'Discover timeless elegance and sophisticated design for your living space',
        description: 'Experience luxury living with our curated collection of premium home decor and lifestyle products.',
        media: {
          type: 'video',
          url: '/lv-hero.mp4',
          alt: 'Style at Home Hero Video',
          poster: '/lv-trainer-front.avif'
        },
        buttonText: 'Shop Now',
        buttonLink: '/shop',
        isActive: true,
        order: 1,
        settings: {
          overlayOpacity: 0.4,
          textColor: '#ffffff',
          backgroundColor: '',
          animation: 'fade',
          layout: 'default',
          textAlignment: 'center',
          buttonStyle: 'primary'
        }
      },
      {
        type: 'product-section',
        title: 'Featured Collection',
        subtitle: 'Discover our latest luxury pieces',
        description: 'Curated selection of premium products for the discerning homeowner.',
        media: {
          type: 'image',
          url: '/lv-trainer-front.avif',
          alt: 'Featured Collection',
          poster: ''
        },
        buttonText: 'View All Products',
        buttonLink: '/shop',
        isActive: true,
        order: 2,
        productSelection: {
          productIds: [], // Will use all products
          category: '',
          limit: 4,
          sortBy: 'createdAt',
          sortOrder: 'desc',
          showOutOfStock: false,
          featuredOnly: false
        },
        settings: {
          overlayOpacity: 0.4,
          textColor: '#000000',
          backgroundColor: '#f8f9fa',
          animation: 'fade',
          layout: 'default',
          textAlignment: 'center',
          buttonStyle: 'primary',
          cardStyle: 'default',
          showPrices: true,
          showCategories: true
        }
      },
      {
        type: 'video-showcase',
        title: 'Luxury Living Experience',
        subtitle: 'See our products in action',
        description: 'Watch how our premium products transform your living space into a haven of elegance and comfort.',
        media: {
          type: 'video',
          url: '/lv-hero.mp4',
          alt: 'Luxury Living Video',
          poster: '/lv-trainer-front.avif'
        },
        buttonText: 'Learn More',
        buttonLink: '/about',
        isActive: true,
        order: 3,
        settings: {
          overlayOpacity: 0.3,
          textColor: '#ffffff',
          backgroundColor: '#1a1a1a',
          animation: 'fade',
          layout: 'default',
          textAlignment: 'center',
          buttonStyle: 'primary',
          videoStyle: 'default',
          showControls: true,
          autoplay: false,
          loop: true
        }
      }
    ];
    
    console.log('Creating sample content...');
    
    for (const content of sampleContent) {
      const newContent = new Content(content);
      await newContent.save();
      console.log(`✅ Created: ${content.title} (${content.type})`);
    }
    
    console.log('\n=== SAMPLE CONTENT CREATED ===');
    console.log('1. Hero Banner - Will show at the top of homepage');
    console.log('2. Product Section - Will show your products in a grid');
    console.log('3. Video Showcase - Will show a video section');
    
    console.log('\n=== NEXT STEPS ===');
    console.log('1. Go to: http://localhost:3000');
    console.log('2. Refresh the page');
    console.log('3. You should see the hero banner, product section, and video section');
    console.log('4. If products don\'t show in the product section, check that you have products in your database');
    
    // Check if products exist
    const ProductSchema = new mongoose.Schema({
      name: String,
      price: Number,
      images: [String],
      category: String,
      stock: Number,
      inStock: Boolean
    });
    const Product = mongoose.model('Product', ProductSchema);
    
    const productCount = await Product.countDocuments();
    console.log(`\n📦 Products in database: ${productCount}`);
    if (productCount === 0) {
      console.log('⚠️  No products found! The product section will be empty.');
      console.log('   Create some products in the admin panel first.');
    }
    
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
    
  } catch (error) {
    console.error('Error creating sample content:', error);
    process.exit(1);
  }
}

createSampleContent();
