import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { CJProduct, mapCjProductToLocal } from '@/lib/cj';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const payload: CJProduct = await request.json();

    const mapped = mapCjProductToLocal(payload);
    // Upsert by name as a simple heuristic (ideally use a persisted externalId)
    const doc = await Product.findOneAndUpdate(
      { name: mapped.name },
      { $set: mapped },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, id: doc._id.toString() });
  } catch (error) {
    console.error('CJ webhook failed:', error);
    return NextResponse.json({ error: 'CJ webhook error' }, { status: 500 });
  }
}


