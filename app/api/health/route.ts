import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { stripe } from '@/lib/stripe';

export async function GET() {
  const checks: Record<string, { ok: boolean; error?: string }> = {};

  // Database check
  try {
    if (mongoose.connection.readyState === 0) {
      const uri = process.env.MONGODB_URI as string;
      await mongoose.connect(uri, { dbName: process.env.MONGODB_DB || undefined });
    }
    await mongoose.connection.db?.admin().ping();
    checks.db = { ok: true };
  } catch (error: any) {
    checks.db = { ok: false, error: error?.message || 'db error' };
  }

  // Stripe check (lightweight)
  try {
    if (!process.env.STRIPE_SECRET_KEY) throw new Error('Missing STRIPE_SECRET_KEY');
    // Accessing imported client is enough to verify construction
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    stripe;
    checks.stripe = { ok: true };
  } catch (error: any) {
    checks.stripe = { ok: false, error: error?.message || 'stripe error' };
  }

  const ok = Object.values(checks).every(item => item.ok);
  return NextResponse.json({ ok, checks }, { status: ok ? 200 : 503 });
}




