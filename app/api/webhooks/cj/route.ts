import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Order from '@/models/Order';
import { CJProduct, mapCjProductToLocal } from '@/lib/cj';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const payload = await request.json();

    // Handle product update events
    if (payload?.type === 'product.updated' && payload?.product) {
      const mapped = mapCjProductToLocal(payload.product as CJProduct);
      const doc = await Product.findOneAndUpdate(
        { name: mapped.name },
        { $set: mapped },
        { upsert: true, new: true }
      );
      return NextResponse.json({ success: true, productId: doc._id.toString() });
    }

    // Handle order status updates
    if (payload?.type === 'order.status' && payload?.orderId && payload?.status) {
      const order = await Order.findOneAndUpdate(
        { externalOrderId: payload.orderId },
        { $set: { status: payload.status } },
        { new: true }
      );
      return NextResponse.json({ success: true, orderId: order?._id?.toString() });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('CJ webhook failed:', error);
    return NextResponse.json({ error: 'CJ webhook error' }, { status: 500 });
  }
}




import Product from '@/models/Product';
import Order from '@/models/Order';
import { CJProduct, mapCjProductToLocal } from '@/lib/cj';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const payload = await request.json();

    // Handle product update events
    if (payload?.type === 'product.updated' && payload?.product) {
      const mapped = mapCjProductToLocal(payload.product as CJProduct);
      const doc = await Product.findOneAndUpdate(
        { name: mapped.name },
        { $set: mapped },
        { upsert: true, new: true }
      );
      return NextResponse.json({ success: true, productId: doc._id.toString() });
    }

    // Handle order status updates
    if (payload?.type === 'order.status' && payload?.orderId && payload?.status) {
      const order = await Order.findOneAndUpdate(
        { externalOrderId: payload.orderId },
        { $set: { status: payload.status } },
        { new: true }
      );
      return NextResponse.json({ success: true, orderId: order?._id?.toString() });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('CJ webhook failed:', error);
    return NextResponse.json({ error: 'CJ webhook error' }, { status: 500 });
  }
}





