import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getCjClient } from '@/lib/cjClient';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // For demo: sync by keyword, e.g., first word of product name
    const products = await Product.find({ externalSource: 'CJ' }).select('name price stock externalProductId externalSkus').limit(200).lean();
    const cj = getCjClient();
    let updated = 0;

    for (const p of products) {
      try {
        const keyword = p.externalProductId || p.name?.split(' ')?.[0] || p.name;
        const data = await cj.search({ keyword, page: 1, pageSize: 1 });
        const hit = data?.data?.data?.[0] || data?.data?.list?.[0];
        if (!hit) continue;
        const newPrice = Number(hit.sellPrice || hit.price || p.price);
        const newStock = Number(hit.inventory || hit.stock || p.stock);
        if (Number.isFinite(newPrice) && Number.isFinite(newStock)) {
          await Product.findByIdAndUpdate(p._id, { price: newPrice, stock: newStock, inStock: newStock > 0 });
          updated += 1;
        }
      } catch (e) {
        // Skip errors per-item to keep syncing
      }
    }

    return NextResponse.json({ success: true, updated });
  } catch (error) {
    console.error('CJ sync failed:', error);
    return NextResponse.json({ error: 'CJ sync error' }, { status: 500 });
  }
}




