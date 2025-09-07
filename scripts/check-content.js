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

// Content Schema
const ContentSchema = new mongoose.Schema({
  type: String,
  title: String,
  subtitle: String,
  description: String,
  media: {
    type: String,
    url: String,
    alt: String,
    poster: String
  },
  buttonText: String,
  buttonLink: String,
  isActive: Boolean,
  order: Number,
  settings: Object,
  productSelection: Object,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Content = mongoose.model('Content', ContentSchema);

async function checkContent() {
  try {
    await connectDB();
    
    const allContent = await Content.find({}).sort({ createdAt: -1 });
    const activeContent = await Content.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    
    console.log(`\n=== CONTENT DATABASE STATUS ===`);
    console.log(`Total content items: ${allContent.length}`);
    console.log(`Active content items: ${activeContent.length}`);
    
    if (allContent.length === 0) {
      console.log('\n❌ No content found in database!');
      console.log('You need to create content in the admin panel first.');
    } else {
      console.log('\n=== ALL CONTENT ITEMS ===');
      allContent.forEach((item, index) => {
        console.log(`\n${index + 1}. ${item.title || 'Untitled'}`);
        console.log(`   Type: ${item.type}`);
        console.log(`   Active: ${item.isActive ? '✅ Yes' : '❌ No'}`);
        console.log(`   Order: ${item.order || 0}`);
        console.log(`   Created: ${item.createdAt.toLocaleDateString()}`);
        if (item.media?.url) {
          console.log(`   Media: ${item.media.url}`);
        }
      });
      
      console.log('\n=== ACTIVE CONTENT (SHOWS ON WEBSITE) ===');
      if (activeContent.length === 0) {
        console.log('❌ No active content found!');
        console.log('Content must be marked as "Active" to show on the website.');
      } else {
        activeContent.forEach((item, index) => {
          console.log(`\n${index + 1}. ${item.title || 'Untitled'}`);
          console.log(`   Type: ${item.type}`);
          console.log(`   Order: ${item.order || 0}`);
        });
      }
    }
    
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
    
  } catch (error) {
    console.error('Error checking content:', error);
    process.exit(1);
  }
}

checkContent();



















