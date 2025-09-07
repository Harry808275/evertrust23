import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function GET() {
  try {
    console.log('Testing Stripe connection...');
    
    // Test Stripe connection by creating a simple test session
    const testSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Test Product',
              description: 'Test Description',
            },
            unit_amount: 1000, // $10.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:3000/checkout/success',
      cancel_url: 'http://localhost:3000/checkout/cancel',
    });

    console.log('Test session created successfully:', testSession.id);
    console.log('Test checkout URL:', testSession.url);

    return NextResponse.json({
      success: true,
      sessionId: testSession.id,
      url: testSession.url,
      message: 'Stripe is working correctly'
    });
  } catch (error) {
    console.error('Stripe test failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status: 500 });
  }
}
