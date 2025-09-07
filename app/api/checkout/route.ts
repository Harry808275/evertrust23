import { NextRequest, NextResponse } from 'next/server';
import { stripe, formatAmountForStripe } from '@/lib/stripe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface CheckoutItem {
  id?: string;
  productId?: string;
  name: string;
  price: number | string;
  image?: string;
  quantity?: number;
  description?: string;
}

export async function POST(request: NextRequest) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Checkout API called');
    }
    
    // Check authentication
    let session;
    try {
      session = await getServerSession(authOptions);
      if (process.env.NODE_ENV !== 'production') {
        console.log('Session check result:', session ? 'Found' : 'Not found');
      }
    } catch (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json({ 
        error: 'Authentication service unavailable',
        details: 'Please try again later'
      }, { status: 500 });
    }

    if (!session?.user) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('No session found - user not authenticated');
      }
      return NextResponse.json({ 
        error: 'Authentication required',
        details: 'Please sign in to continue with checkout'
      }, { status: 401 });
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log('Session found for user:', session.user.email);
    }

    const { items, successUrl, cancelUrl } = await request.json() as {
      items: CheckoutItem[];
      successUrl?: string;
      cancelUrl?: string;
    };
    if (process.env.NODE_ENV !== 'production') {
      console.log('Received items count:', Array.isArray(items) ? items.length : 0);
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.log('Invalid items received');
      return NextResponse.json({ error: 'Invalid items' }, { status: 400 });
    }

    // Create line items for Stripe
    const lineItems = items.map((item: CheckoutItem) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Processing item id:', item.id || item.productId || 'unknown');
      }
      
      // Ensure price is a valid number
      let unitAmount: number;
      if (typeof item.price === 'string') {
        // Remove currency symbols and commas, then parse
        const cleanPrice = item.price.replace(/[$,]/g, '');
        unitAmount = parseFloat(cleanPrice);
        if (process.env.NODE_ENV !== 'production') {
          console.log(`Price parsing: "${item.price}" -> "${cleanPrice}" -> ${unitAmount}`);
        }
      } else if (typeof item.price === 'number') {
        unitAmount = item.price;
      } else {
        console.error('Invalid price format:', item.price);
        throw new Error(`Invalid price format for item ${item.name}: ${item.price}`);
      }

      if (isNaN(unitAmount) || unitAmount <= 0) {
        console.error('Invalid price value:', unitAmount);
        throw new Error(`Invalid price value for item ${item.name}: ${unitAmount}`);
      }

      const formattedAmount = formatAmountForStripe(unitAmount, 'USD');
      if (process.env.NODE_ENV !== 'production') {
        console.log(`Formatted amount for Stripe: ${unitAmount} -> ${formattedAmount}`);
      }

      // Only include absolute image URLs for Stripe product_data
      const imageUrl = item.image && /^https?:\/\//i.test(item.image) ? item.image : undefined;

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            description: item.description,
            images: imageUrl ? [imageUrl] : [],
          },
          unit_amount: formattedAmount,
        },
        quantity: item.quantity || 1,
      };
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log('Created line items count:', lineItems.length);
    }

    // Create Stripe checkout session
    const origin = request.headers.get('origin') || 'http://localhost:3000';
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl || `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${origin}/checkout/cancel`,
      customer_email: session.user.email || undefined,
      metadata: {
        userId: session.user.id,
        // Include the fields required by the Order model so the webhook can create an Order
        items: JSON.stringify(
          items.map((item: CheckoutItem) => ({
            productId: item.id || item.productId,
            name: item.name,
            price: item.price,
            image: item.image || '',
            quantity: item.quantity || 1,
          }))
        ),
      },
      // Collect shipping address so we can map it to Order.shippingAddress
      shipping_address_collection: { allowed_countries: ['US', 'CA'] },
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log('Stripe session created:', checkoutSession.id);
      console.log('Checkout URL:', checkoutSession.url);
    }

    if (!checkoutSession.url) {
      console.error('No checkout URL received from Stripe');
      return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
    }

    return NextResponse.json({ 
      sessionId: checkoutSession.id, 
      url: checkoutSession.url 
    });
  } catch (error) {
    console.error('Checkout error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: 'Checkout failed', details: errorMessage }, { status: 500 });
  }
}
