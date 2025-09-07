import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Read connection string from environment
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set. Please add it to .env.local');
  process.exit(1);
}

async function testConnection() {
  try {
    console.log('🔍 Testing MongoDB Atlas connection...');
    console.log('📡 Connection string:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@'));
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully!');
    
    // Test database operations
    const testCollection = mongoose.connection.collection('test');
    await testCollection.insertOne({ 
      test: 'connection', 
      timestamp: new Date(),
      message: 'Database is working!'
    });
    console.log('✅ Database write test successful!');
    
    // Clean up
    await testCollection.deleteOne({ test: 'connection' });
    console.log('✅ Database cleanup successful!');
    
    await mongoose.disconnect();
    console.log('✅ Connection closed successfully!');
    console.log('🎉 MongoDB Atlas is working perfectly!');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('Error:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.log('\n🔧 Authentication Error - Possible solutions:');
      console.log('1. Check username "gadgets476" and password in MongoDB Atlas');
      console.log('2. Go to "Database Access" in Atlas and create/update the user');
      console.log('3. Make sure the user has "Read and write to any database" permissions');
    }
    
    if (error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND')) {
      console.log('\n🔧 Network Error - Possible solutions:');
      console.log('1. Check your internet connection');
      console.log('2. Go to "Network Access" in Atlas and click "Allow Access from Anywhere"');
      console.log('3. Add your current IP address to the whitelist');
    }
  }
}

testConnection();
