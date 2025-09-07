import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { name, email, password } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = new User({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: 'user', // Default role
    });

    await user.save();
    
    // Return success without sensitive data
    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating user:', error);
    // Duplicate key error (unique email)
    if (error?.code === 11000) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }
    // Mongoose validation errors
    if (error?.name === 'ValidationError') {
      const firstMessage = Object.values(error.errors)[0]?.message || 'Validation failed';
      return NextResponse.json(
        { error: firstMessage },
        { status: 400 }
      );
    }
    // Connection or unknown errors
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}


