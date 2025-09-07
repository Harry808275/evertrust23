import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Coupon from '@/models/Coupon';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { code, orderAmount, products, userId } = body;

    if (!code) {
      return NextResponse.json(
        { error: 'Coupon code is required' },
        { status: 400 }
      );
    }

    // Find coupon by code
    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(),
      isActive: true 
    });

    if (!coupon) {
      return NextResponse.json(
        { 
          valid: false, 
          error: 'Invalid coupon code' 
        },
        { status: 200 }
      );
    }

    // Check if coupon is currently valid
    const now = new Date();
    if (now < coupon.validFrom || now > coupon.validUntil) {
      return NextResponse.json(
        { 
          valid: false, 
          error: 'Coupon has expired' 
        },
        { status: 200 }
      );
    }

    // Check usage limits
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json(
        { 
          valid: false, 
          error: 'Coupon usage limit exceeded' 
        },
        { status: 200 }
      );
    }

    // Check minimum order amount
    if (coupon.minimumAmount && orderAmount && orderAmount < coupon.minimumAmount) {
      return NextResponse.json(
        { 
          valid: false, 
          error: `Minimum order amount of $${(coupon.minimumAmount / 100).toFixed(2)} required` 
        },
        { status: 200 }
      );
    }

    // Check applicable products/categories
    if (products && products.length > 0) {
      // Check if any products are excluded
      if (coupon.excludedProducts && coupon.excludedProducts.length > 0) {
        const hasExcludedProducts = products.some((product: any) => 
          coupon.excludedProducts!.includes(product.id)
        );
        if (hasExcludedProducts) {
          return NextResponse.json(
            { 
              valid: false, 
              error: 'Coupon cannot be applied to items in your cart' 
            },
            { status: 200 }
          );
        }
      }

      // Check if any products are in excluded categories
      if (coupon.excludedCategories && coupon.excludedCategories.length > 0) {
        const hasExcludedCategories = products.some((product: any) => 
          coupon.excludedCategories!.includes(product.category)
        );
        if (hasExcludedCategories) {
          return NextResponse.json(
            { 
              valid: false, 
              error: 'Coupon cannot be applied to items in your cart' 
            },
            { status: 200 }
          );
        }
      }

      // Check if coupon applies to specific products
      if (coupon.applicableProducts && coupon.applicableProducts.length > 0) {
        const hasApplicableProducts = products.some((product: any) => 
          coupon.applicableProducts!.includes(product.id)
        );
        if (!hasApplicableProducts) {
          return NextResponse.json(
            { 
              valid: false, 
              error: 'Coupon cannot be applied to items in your cart' 
            },
            { status: 200 }
          );
        }
      }

      // Check if coupon applies to specific categories
      if (coupon.applicableCategories && coupon.applicableCategories.length > 0) {
        const hasApplicableCategories = products.some((product: any) => 
          coupon.applicableCategories!.includes(product.category)
        );
        if (!hasApplicableCategories) {
          return NextResponse.json(
            { 
              valid: false, 
              error: 'Coupon cannot be applied to items in your cart' 
            },
            { status: 200 }
          );
        }
      }
    }

    // Calculate discount amount
    const discountAmount = coupon.calculateDiscount(orderAmount || 0, products);

    // Get session for user-specific checks
    const session = await getServerSession(authOptions);
    
    // Check user-specific limits (if user is logged in)
    if (session?.user && coupon.userLimit) {
      // This would require tracking user coupon usage
      // For now, we'll skip this check
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon._id,
        code: coupon.code,
        name: coupon.name,
        type: coupon.type,
        value: coupon.value,
        discountAmount: discountAmount,
        minimumAmount: coupon.minimumAmount,
        maximumDiscount: coupon.maximumDiscount,
        description: coupon.description
      }
    });

  } catch (error) {
    console.error('Error validating coupon:', error);
    return NextResponse.json(
      { error: 'Failed to validate coupon' },
      { status: 500 }
    );
  }
}

