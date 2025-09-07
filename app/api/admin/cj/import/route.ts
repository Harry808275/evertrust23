import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { CJProduct, mapCjProductToLocal } from '@/lib/cj';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    const products: CJProduct[] = Array.isArray(body) ? body : (body?.products ?? []);
    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: 'No CJ products provided' }, { status: 400 });
    }

    const created: string[] = [];
    for (const cj of products) {
      const mapped = mapCjProductToLocal(cj);
      const doc = new Product(mapped);
      await doc.save();
      created.push(doc._id.toString());
    }

    return NextResponse.json({ success: true, createdCount: created.length, ids: created });
  } catch (error) {
    console.error('CJ import failed:', error);
    return NextResponse.json({ error: 'Failed to import CJ products' }, { status: 500 });
  }
}


