import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

// Define User schema (matching your NextAuth setup)
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

async function createUser() {
  try {
    console.log('🔧 Creating user account...');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: 'trollharry21@gmail.com' });
    if (existingUser) {
      console.log('⚠️  User already exists with this email');
      await mongoose.disconnect();
      return;
    }
    
    // Create new user
    const hashedPassword = await bcrypt.hash('your-password-here', 12);
    
    const newUser = new User({
      name: 'Admin User',
      email: 'trollharry21@gmail.com',
      password: hashedPassword,
      role: 'admin'
    });
    
    await newUser.save();
    console.log('✅ User created successfully!');
    console.log('📧 Email: trollharry21@gmail.com');
    console.log('🔑 Password: your-password-here');
    console.log('👤 Role: admin');
    console.log('\n💡 You can now sign in with these credentials');
    
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error creating user:', error.message);
  }
}

createUser();
