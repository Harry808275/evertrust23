import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    // Test MongoDB connection
    await dbConnect();
    
    // Check if users exist
    const userCount = await User.countDocuments();
    const users = await User.find({}).select('-passwordHash').limit(5);
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful',
      userCount,
      users,
      env: {
        hasMongoUri: !!process.env.MONGODB_URI,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      }
    });
  } catch (error: any) {
    console.error('Debug auth error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      env: {
        hasMongoUri: !!process.env.MONGODB_URI,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      }
    }, { status: 500 });
  }
}
