import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import mongoose from 'mongoose';

export async function POST() {
  try {
    await dbConnect();
    
    // Create a test order manually
    const testOrderData = {
      userId: new mongoose.Types.ObjectId(),
      items: [
        {
          productId: new mongoose.Types.ObjectId(),
          quantity: 1,
          price: 29.99,
          name: 'Test Product',
          image: 'https://via.placeholder.com/150',
        }
      ],
      totalPrice: 29.99,
      status: 'processing',
      shippingAddress: {
        firstName: 'Test',
        lastName: 'User',
        address: '123 Test St',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
        country: 'US',
      },
    };

    console.log('Creating test order with data:', testOrderData);

    const order = await Order.create(testOrderData);
    
    console.log('Test order created successfully:', {
      orderId: order._id,
      totalPrice: order.totalPrice,
    });

    return NextResponse.json({
      success: true,
      message: 'Test order created successfully',
      orderId: order._id,
      orderCount: await Order.countDocuments({})
    });
  } catch (error) {
    console.error('Error creating test order:', error);
    return NextResponse.json(
      { error: 'Failed to create test order', details: error },
      { status: 500 }
    );
  }
}


