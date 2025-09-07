import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Lazy import to surface missing env errors here
    const { default: dbConnect } = await import('@/lib/mongodb');
    await dbConnect();
    return NextResponse.json({ status: 'ok' });
  } catch (err: any) {
    const message = err?.message || 'unknown error';
    return NextResponse.json({ status: 'error', message }, { status: 500 });
  }
}




