import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Coupon from '@/models/Coupon';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const coupon = await Coupon.findById(params.id);
    
    if (!coupon) {
      return NextResponse.json(
        { error: 'Coupon not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(coupon);
  } catch (error) {
    console.error('Error fetching coupon:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coupon' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      isActive,
      applicableProducts,
      applicableCategories,
      excludedProducts,
      excludedCategories,
      customerSegments,
      conditions,
      metadata
    } = body;

    const coupon = await Coupon.findById(params.id);
    
    if (!coupon) {
      return NextResponse.json(
        { error: 'Coupon not found' },
        { status: 404 }
      );
    }

    // Validate type and value if provided
    if (type === 'percentage' && value !== undefined && (value < 0 || value > 100)) {
      return NextResponse.json(
        { error: 'Percentage value must be between 0 and 100' },
        { status: 400 }
      );
    }

    if (type === 'fixed' && value !== undefined && value < 0) {
      return NextResponse.json(
        { error: 'Fixed value must be positive' },
        { status: 400 }
      );
    }

    // Validate dates if provided
    if (validFrom && validUntil) {
      const startDate = new Date(validFrom);
      const endDate = new Date(validUntil);

      if (endDate <= startDate) {
        return NextResponse.json(
          { error: 'End date must be after start date' },
          { status: 400 }
        );
      }
    }

    // Update coupon
    const updateData: any = {};
    
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (type !== undefined) updateData.type = type;
    if (value !== undefined) updateData.value = value;
    if (minimumAmount !== undefined) updateData.minimumAmount = minimumAmount;
    if (maximumDiscount !== undefined) updateData.maximumDiscount = maximumDiscount;
    if (usageLimit !== undefined) updateData.usageLimit = usageLimit;
    if (userLimit !== undefined) updateData.userLimit = userLimit;
    if (validFrom !== undefined) updateData.validFrom = new Date(validFrom);
    if (validUntil !== undefined) updateData.validUntil = new Date(validUntil);
    if (isActive !== undefined) updateData.isActive = isActive;
    if (applicableProducts !== undefined) updateData.applicableProducts = applicableProducts;
    if (applicableCategories !== undefined) updateData.applicableCategories = applicableCategories;
    if (excludedProducts !== undefined) updateData.excludedProducts = excludedProducts;
    if (excludedCategories !== undefined) updateData.excludedCategories = excludedCategories;
    if (customerSegments !== undefined) updateData.customerSegments = customerSegments;
    if (conditions !== undefined) updateData.conditions = conditions;
    if (metadata !== undefined) updateData.metadata = { ...coupon.metadata, ...metadata };

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    return NextResponse.json(updatedCoupon);
  } catch (error) {
    console.error('Error updating coupon:', error);
    return NextResponse.json(
      { error: 'Failed to update coupon' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    const coupon = await Coupon.findById(params.id);
    
    if (!coupon) {
      return NextResponse.json(
        { error: 'Coupon not found' },
        { status: 404 }
      );
    }

    await Coupon.findByIdAndDelete(params.id);
    
    return NextResponse.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json(
      { error: 'Failed to delete coupon' },
      { status: 500 }
    );
  }
}

