import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PromotionalBanner from '@/models/PromotionalBanner';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';
    const isActive = searchParams.get('isActive');
    const position = searchParams.get('position') || '';
    
    // Build query
    const query: any = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subtitle: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (type) {
      query.type = type;
    }
    
    if (position) {
      query.position = position;
    }
    
    if (isActive !== null && isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    
    // Get total count
    const total = await PromotionalBanner.countDocuments(query);
    
    // Get banners with pagination
    const banners = await PromotionalBanner.find(query)
      .sort({ priority: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    
    return NextResponse.json({
      banners,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching promotional banners:', error);
    return NextResponse.json(
      { error: 'Failed to fetch promotional banners' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    await dbConnect();
    
    const body = await request.json();
    const {
      title,
      subtitle,
      description,
      type,
      position,
      priority,
      startDate,
      endDate,
      targetAudience,
      displayRules,
      content,
      metadata
    } = body;

    // Validate required fields
    if (!title || !type || !position) {
      return NextResponse.json(
        { error: 'Missing required fields: title, type, position' },
        { status: 400 }
      );
    }

    // Validate dates
    const now = new Date();
    const start = startDate ? new Date(startDate) : now;
    const end = new Date(endDate);

    if (end <= start) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    const banner = new PromotionalBanner({
      title,
      subtitle,
      description,
      type,
      position,
      priority: priority || 1,
      startDate: start,
      endDate: end,
      targetAudience: targetAudience || {},
      displayRules: displayRules || {},
      content: content || {},
      metadata: {
        ...metadata,
        createdBy: session.user.email
      }
    });

    await banner.save();
    
    return NextResponse.json(banner, { status: 201 });
  } catch (error) {
    console.error('Error creating promotional banner:', error);
    return NextResponse.json(
      { error: 'Failed to create promotional banner' },
      { status: 500 }
    );
  }
}

