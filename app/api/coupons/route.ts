import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Coupon from '@/models/Coupon';
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
    
    // Build query
    const query: any = {};
    
    if (search) {
      query.$or = [
        { code: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (type) {
      query.type = type;
    }
    
    if (isActive !== null && isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    
    // Get total count
    const total = await Coupon.countDocuments(query);
    
    // Get coupons with pagination
    const coupons = await Coupon.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    
    return NextResponse.json({
      coupons,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coupons' },
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
      code,
      name,
      description,
      type,
      value,
      minimumAmount,
      maximumDiscount,
      usageLimit,
      userLimit,
      validFrom,
      validUntil,
      applicableProducts,
      applicableCategories,
      excludedProducts,
      excludedCategories,
      customerSegments,
      conditions,
      metadata
    } = body;

    // Validate required fields
    if (!code || !name || !type || value === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: code, name, type, value' },
        { status: 400 }
      );
    }

    // Validate coupon code format
    if (!/^[A-Z0-9_-]+$/.test(code)) {
      return NextResponse.json(
        { error: 'Coupon code must contain only uppercase letters, numbers, hyphens, and underscores' },
        { status: 400 }
      );
    }

    // Validate type and value
    if (type === 'percentage' && (value < 0 || value > 100)) {
      return NextResponse.json(
        { error: 'Percentage value must be between 0 and 100' },
        { status: 400 }
      );
    }

    if (type === 'fixed' && value < 0) {
      return NextResponse.json(
        { error: 'Fixed value must be positive' },
        { status: 400 }
      );
    }

    // Validate dates
    const now = new Date();
    const startDate = validFrom ? new Date(validFrom) : now;
    const endDate = new Date(validUntil);

    if (endDate <= startDate) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return NextResponse.json(
        { error: 'Coupon code already exists' },
        { status: 400 }
      );
    }

    const coupon = new Coupon({
      code: code.toUpperCase(),
      name,
      description,
      type,
      value,
      minimumAmount,
      maximumDiscount,
      usageLimit,
      userLimit,
      validFrom: startDate,
      validUntil: endDate,
      applicableProducts,
      applicableCategories,
      excludedProducts,
      excludedCategories,
      customerSegments,
      conditions,
      metadata: {
        ...metadata,
        createdBy: session.user.email
      }
    });

    await coupon.save();
    
    return NextResponse.json(coupon, { status: 201 });
  } catch (error) {
    console.error('Error creating coupon:', error);
    return NextResponse.json(
      { error: 'Failed to create coupon' },
      { status: 500 }
    );
  }
}

