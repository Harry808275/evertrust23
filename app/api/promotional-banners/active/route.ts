import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PromotionalBanner from '@/models/PromotionalBanner';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || '';
    const position = searchParams.get('position') || '';
    const pagePath = searchParams.get('pagePath') || '/';
    
    // Build query for active banners
    const query: any = {
      isActive: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() }
    };
    
    if (type) {
      query.type = type;
    }
    
    if (position) {
      query.position = position;
    }
    
    // Get active banners
    const banners = await PromotionalBanner.find(query)
      .sort({ priority: -1, createdAt: -1 })
      .lean();
    
    // Filter banners based on display rules and target audience
    const filteredBanners = banners.filter(banner => {
      // Basic user info (would be enhanced with actual user data)
      const userInfo = {
        isLoggedIn: false, // This would come from session
        userType: 'guest',
        location: 'US', // This would come from request headers or user data
        device: 'desktop' // This would be detected from user agent
      };
      
      return banner.shouldShowToUser(userInfo, pagePath);
    });
    
    return NextResponse.json({
      banners: filteredBanners
    });
  } catch (error) {
    console.error('Error fetching active promotional banners:', error);
    return NextResponse.json(
      { error: 'Failed to fetch active promotional banners' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { bannerId, action } = body; // action: 'impression' | 'click'
    
    if (!bannerId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields: bannerId, action' },
        { status: 400 }
      );
    }
    
    const banner = await PromotionalBanner.findById(bannerId);
    
    if (!banner) {
      return NextResponse.json(
        { error: 'Banner not found' },
        { status: 404 }
      );
    }
    
    // Track the action
    if (action === 'impression') {
      await banner.trackImpression();
    } else if (action === 'click') {
      await banner.trackClick();
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking banner action:', error);
    return NextResponse.json(
      { error: 'Failed to track banner action' },
      { status: 500 }
    );
  }
}

