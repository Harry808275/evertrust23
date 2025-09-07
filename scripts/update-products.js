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

// Product Schema
const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  images: [String],
  category: String,
  stock: Number,
  inStock: Boolean,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', ProductSchema);

async function updateProducts() {
  try {
    await connectDB();
    
    const products = await Product.find({}).sort({ createdAt: -1 });
    
    console.log(`\nUpdating ${products.length} products...\n`);
    
    // Update each product with proper LV-style names and descriptions
    const updates = [
      {
        name: "Louis Vuitton Monogram Empreinte Leather Bag",
        description: "Timeless elegance meets modern sophistication in this premium monogram empreinte leather bag. Crafted with meticulous attention to detail, featuring the iconic LV monogram pattern embossed on supple leather. Perfect for both casual outings and formal occasions, this versatile piece offers ample storage while maintaining its refined aesthetic.",
        price: 211,
        category: "Bags",
        stock: 15,
        inStock: true
      },
      {
        name: "LV Classic Monogram Canvas Tote",
        description: "The epitome of luxury and functionality, this classic monogram canvas tote showcases the heritage of Louis Vuitton craftsmanship. Made from the signature coated canvas with natural cowhide leather trim, it features brass hardware and spacious interior perfect for daily essentials. A true investment piece that only gets better with age.",
        price: 2232,
        category: "Bags", 
        stock: 8,
        inStock: true
      },
      {
        name: "Louis Vuitton Damier Azur Crossbody",
        description: "Light and elegant, this Damier Azur crossbody bag embodies the perfect balance of style and practicality. The iconic checkered pattern in light blue and white creates a fresh, sophisticated look. Adjustable leather strap and secure closure make it ideal for hands-free convenience while maintaining the luxury aesthetic.",
        price: 1212,
        category: "Bags",
        stock: 12,
        inStock: true
      }
    ];
    
    for (let i = 0; i < products.length && i < updates.length; i++) {
      const product = products[i];
      const update = updates[i];
      
      // Keep the existing images but ensure they're properly formatted
      let updatedImages = product.images;
      
      // Fix local image paths to ensure they work
      updatedImages = updatedImages.map(img => {
        if (img.startsWith('/uploads/')) {
          return img; // Keep as is
        } else if (img.includes('pexels.com') || img.includes('unsplash.com')) {
          return img; // Keep external images
        } else {
          // If it's a broken path, use a fallback
          return '/lv-trainer-front.avif';
        }
      });
      
      // Update the product
      await Product.findByIdAndUpdate(product._id, {
        name: update.name,
        description: update.description,
        price: update.price,
        images: updatedImages,
        category: update.category,
        stock: update.stock,
        inStock: update.inStock,
        updatedAt: new Date()
      });
      
      console.log(`Updated: ${update.name}`);
      console.log(`   Price: $${update.price}`);
      console.log(`   Images: ${updatedImages.length} image(s)`);
      console.log('');
    }
    
    console.log('All products updated successfully!');
    
    // Show the updated products
    const updatedProducts = await Product.find({}).sort({ createdAt: -1 });
    console.log('\nUpdated products:\n');
    
    updatedProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Price: $${product.price}`);
      console.log(`   Category: ${product.category}`);
      console.log(`   Stock: ${product.stock}`);
      console.log(`   Images: ${product.images.length} image(s)`);
      if (product.images.length > 0) {
        console.log(`   First image: ${product.images[0]}`);
      }
      console.log('');
    });
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Error updating products:', error);
    process.exit(1);
  }
}

updateProducts();



















