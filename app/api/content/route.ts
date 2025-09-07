import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Content from '@/models/Content';

// GET - Fetch all content
export async function GET(request: NextRequest) {
  try {
    console.log('Content API: Connecting to database...');
    await dbConnect();
    console.log('Content API: Database connected');
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const activeOnly = searchParams.get('activeOnly') === 'true';
    
    let query: any = {};
    
    if (type) {
      query.type = type;
    }
    
    if (activeOnly) {
      query.isActive = true;
    }
    
    console.log('Content API: Query:', query);
    
    const content = await Content.find(query)
      .sort({ order: 1, createdAt: -1 })
      .lean();
    
    console.log('Content API: Found', content.length, 'items');
    
    return NextResponse.json(content);
  } catch (error: any) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

// POST - Create new content
export async function POST(request: NextRequest) {
  try {
    console.log('=== POST /api/content ===');
    
    const session = await getServerSession(authOptions);
    console.log('Session:', session ? { user: session.user?.email, role: session.user?.role } : 'No session');
    
    if (!session || session.user?.role !== 'admin') {
      console.log('Unauthorized access attempt');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    console.log('Connecting to database...');
    await dbConnect();
    console.log('Database connected successfully');
    
    const body = await request.json();
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    // Validate required fields
    if (!body.type) {
      console.log('Missing type field');
      return NextResponse.json(
        { error: 'Content type is required' },
        { status: 400 }
      );
    }
    
    if (!body.title) {
      console.log('Missing title field');
      return NextResponse.json(
        { error: 'Content title is required' },
        { status: 400 }
      );
    }
    
    // Make media optional for now
    if (!body.media) {
      console.log('No media provided, setting default');
      body.media = {
        type: 'image',
        url: '',
        alt: '',
        poster: ''
      };
    } else {
      // Ensure media has all required fields
      if (!body.media.type) {
        body.media.type = 'image';
      }
      if (!body.media.url) {
        body.media.url = '';
      }
      if (!body.media.alt) {
        body.media.alt = '';
      }
      if (!body.media.poster) {
        body.media.poster = '';
      }
    }
    
    // Ensure settings has default values
    if (!body.settings) {
      console.log('No settings provided, setting defaults');
      body.settings = {
        overlayOpacity: 0.4,
        textColor: '#ffffff',
        backgroundColor: '',
        animation: 'fade',
        layout: 'default',
        textAlignment: 'left',
        buttonStyle: 'primary',
        cardStyle: 'default',
        showPrices: true,
        showCategories: true,
        showAvatars: true,
        showRatings: true,
        showIcons: true,
        showOverlays: true,
        videoStyle: 'default',
        showControls: true,
        autoplay: false,
        loop: true,
        iconStyle: 'default',
        imageStyle: 'default',
        hoverEffect: 'none'
      };
    }
    
    // Test the Content model with the data
    try {
      console.log('Testing Content model validation...');
      const testContent = new Content(body);
      await testContent.validate();
      console.log('Content model validation passed');
    } catch (validationError: any) {
      console.error('Content model validation failed:', validationError.message);
      return NextResponse.json(
        { error: 'Invalid content data', details: validationError.message },
        { status: 400 }
      );
    }
    
    console.log('Creating new content...');
    const content = new Content(body);
    await content.save();
    
    console.log('Content created successfully:', content._id);
    return NextResponse.json(content, { status: 201 });
  } catch (error: any) {
    console.error('=== ERROR IN POST /api/content ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error name:', error.name);
    console.error('Error stack:', error.stack);
    
    // Check if it's a validation error
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      console.error('Validation errors:', validationErrors);
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }
    
    // Check if it's a MongoDB connection error
    if (error.name === 'MongoServerSelectionError') {
      console.error('MongoDB connection error');
      return NextResponse.json(
        { error: 'Database connection failed', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create content', details: error.message },
      { status: 500 }
    );
  }
}
