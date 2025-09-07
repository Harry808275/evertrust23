import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Simple working seed content for now
const sampleContent = [
  {
    type: 'hero',
    title: 'STYLE AT HOME',
    subtitle: 'Discover timeless elegance and sophisticated design for your living space',
    description: 'Curated pieces that define luxury living and timeless style. Transform your home with our exclusive collection.',
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
      textColor: '#fbbf24',
      backgroundColor: '',
      animation: 'fade'
    }
  },
  {
    type: 'product-showcase',
    title: 'Featured Collection',
    subtitle: 'Curated Luxury Pieces',
    description: 'Discover our handpicked selection of premium products that define luxury living',
    isActive: true,
    order: 2,
    settings: {
      backgroundColor: '#f8f9fa',
      textColor: '#000000',
      animation: 'slide'
    }
  },
  {
    type: 'video-showcase',
    title: 'Luxury Living Experience',
    subtitle: 'See Our Products in Action',
    description: 'Experience the quality and craftsmanship of our collection through immersive video content',
    isActive: true,
    order: 3,
    settings: {
      backgroundColor: '#1a1a1a',
      textColor: '#ffffff',
      animation: 'zoom'
    },
    media: {
      type: 'video',
      url: '/lv-hero.mp4',
      alt: 'Luxury Living Video',
      poster: '/lv-trainer-interior.avif'
    },
    buttonText: 'Learn More',
    buttonLink: '/about'
  }
];

async function seedContent() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create a simple Content schema for seeding
    const ContentSchema = new mongoose.Schema({
      type: String,
      title: String,
      subtitle: String,
      description: String,
      media: {
        type: {
          type: String,
          enum: ['video', 'image']
        },
        url: String,
        alt: String,
        poster: String
      },
      buttonText: String,
      buttonLink: String,
      isActive: Boolean,
      order: Number,
      settings: {
        overlayOpacity: Number,
        textColor: String,
        backgroundColor: String,
        animation: String
      }
    }, {
      timestamps: true
    });

    const Content = mongoose.models.Content || mongoose.model('Content', ContentSchema);

    // Clear existing content
    await Content.deleteMany({});
    console.log('Cleared existing content');

    // Insert sample content
    const insertedContent = await Content.insertMany(sampleContent);
    console.log(`Inserted ${insertedContent.length} content items`);

    // Display inserted content
    insertedContent.forEach((item, index) => {
      console.log(`${index + 1}. ${item.type.toUpperCase()}: ${item.title}`);
    });

    console.log('\nContent seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding content:', error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the seeding function
seedContent();
