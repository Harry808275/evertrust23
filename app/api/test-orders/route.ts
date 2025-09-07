import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET() {
  try {
    await dbConnect();
    
    // Get all orders
    const orders = await Order.find({}).sort({ createdAt: -1 });
    
    // Get order count
    const orderCount = await Order.countDocuments({});
    
    console.log(`Found ${orderCount} orders in database`);
    
    return NextResponse.json({
      success: true,
      orderCount,
      orders: orders.map(order => ({
        id: order._id,
        userId: order.userId,
        totalPrice: order.totalPrice,
        status: order.status,
        itemsCount: order.items.length,
        createdAt: order.createdAt
      }))
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders', details: error },
      { status: 500 }
    );
  }
}


