import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import CartItem from '@/models/CartItem';
import Product from '@/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const orders = await Order.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .populate('items.productId', 'name image');
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
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

    await dbConnect();
    
    const body = await request.json();
    const { 
      items, 
      totalPrice, 
      shippingAddress, 
      specialInstructions, 
      privacyInstructions 
    } = body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    if (!totalPrice || typeof totalPrice !== 'number' || totalPrice <= 0) {
      return NextResponse.json(
        { error: 'Valid total price is required' },
        { status: 400 }
      );
    }

    if (!shippingAddress) {
      return NextResponse.json(
        { error: 'Shipping address is required' },
        { status: 400 }
      );
    }

    // Validate shipping address fields
    const requiredAddressFields = ['firstName', 'lastName', 'address', 'city', 'state', 'zipCode', 'country'];
    for (const field of requiredAddressFields) {
      if (!shippingAddress[field]) {
        return NextResponse.json(
          { error: `Shipping address ${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate items and check stock
    for (const item of items) {
      if (!item.productId || !item.quantity || !item.price || !item.name || !item.image) {
        return NextResponse.json(
          { error: 'Invalid item data' },
          { status: 400 }
        );
      }

      // Check if product exists and has sufficient stock
      const product = await Product.findById(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.name} not found` },
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${item.name}. Available: ${product.stock}` },
          { status: 400 }
        );
      }
    }

    // Create order
    const order = new Order({
      userId: session.user.id,
      items,
      totalPrice,
      shippingAddress,
      specialInstructions,
      privacyInstructions,
      status: 'pending',
    });

    await order.save();

    // Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Clear user's cart items
    await CartItem.deleteMany({ userId: session.user.id });
    
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

































