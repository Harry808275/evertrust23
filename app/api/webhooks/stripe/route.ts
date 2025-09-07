import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import mongoose from 'mongoose';

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  console.log('=== WEBHOOK RECEIVED ===');
  
  const body = await request.text();
  const headersList = await headers();
  const sig = headersList.get('stripe-signature');

  console.log('Webhook signature:', sig ? 'Present' : 'Missing');
  console.log('Webhook body length:', body.length);

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig!, endpointSecret);
    console.log('✅ Webhook signature verified successfully');
    console.log('📦 Webhook event type:', event.type);
    console.log('🆔 Event ID:', event.id);
  } catch (err: any) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  try {
    console.log('🔌 Connecting to database...');
    await dbConnect();
    console.log('✅ Database connected successfully');

    switch (event.type) {
      case 'checkout.session.completed': {
        const session: any = event.data.object;
        console.log('💰 Processing checkout.session.completed');
        console.log('📋 Session ID:', session.id);
        console.log('💳 Amount total:', session.amount_total);
        console.log('👤 Customer details:', session.customer_details);
        console.log('🏷️ Metadata:', session.metadata);

        // Build shipping address to match Order model
        const addr = session.customer_details?.address || {};
        const fullName = session.customer_details?.name || '';
        const [firstName, ...rest] = fullName.split(' ');

        // Parse items from metadata; ensure shape matches Order item schema
        const rawItems = JSON.parse(session.metadata?.items || '[]');
        console.log('📦 Parsed items from metadata:', rawItems);

        const items = rawItems.map((it: any) => ({
          productId: new mongoose.Types.ObjectId(), // Create a new ObjectId for now
          quantity: it.quantity || 1,
          price: typeof it.price === 'number' ? it.price : 0,
          name: it.name || '',
          image: it.image || '',
        }));

        // Convert userId to ObjectId if it exists
        let userId = null;
        if (session.metadata?.userId) {
          try {
            userId = new mongoose.Types.ObjectId(session.metadata.userId);
            console.log('👤 User ID converted successfully:', userId);
          } catch (error) {
            console.error('❌ Invalid userId format:', session.metadata.userId);
            // Create a dummy user ID for testing
            userId = new mongoose.Types.ObjectId();
            console.log('🆔 Created dummy user ID:', userId);
          }
        } else {
          // Create a dummy user ID for testing
          userId = new mongoose.Types.ObjectId();
          console.log('🆔 No userId in metadata, created dummy user ID:', userId);
        }

        const orderData = {
          userId: userId,
          items,
          totalPrice: (session.amount_total || 0) / 100,
          status: 'processing',
          customerEmail: session.customer_details?.email || '',
          customerPhone: session.customer_details?.phone || '',
          shippingAddress: {
            firstName: firstName || 'Test',
            lastName: rest.join(' ') || 'User',
            address: addr.line1 || '123 Test St',
            city: addr.city || 'Test City',
            state: addr.state || 'Test State',
            zipCode: addr.postal_code || '12345',
            country: addr.country || 'US',
          },
        };

        console.log('📝 Creating order with data:', JSON.stringify(orderData, null, 2));

        const order = await Order.create(orderData);
        console.log('✅ Order created successfully!');
        console.log('🆔 Order ID:', order._id);
        console.log('💰 Total Price:', orderData.totalPrice);
        console.log('📦 Items Count:', orderData.items.length);
        break;
      }

      case 'payment_intent.succeeded':
        console.log('💳 Payment succeeded:', (event as any).data.object.id);
        break;

      case 'payment_intent.payment_failed':
        console.log('❌ Payment failed:', (event as any).data.object.id);
        break;

      default:
        console.log(`⚠️ Unhandled event type: ${event.type}`);
    }

    console.log('✅ Webhook processed successfully');
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    console.error('❌ Error details:', JSON.stringify(error, null, 2));
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
