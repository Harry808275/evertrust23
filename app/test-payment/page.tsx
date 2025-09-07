'use client';

import { useState } from 'react';
import { getStripe } from '@/lib/stripe';

export default function TestPaymentPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const testItems = [
    {
      id: 'test-product-1',
      name: 'Test Product 1',
      price: 9.99,
      description: 'This is a test product for payment testing',
      image: 'https://via.placeholder.com/150',
      quantity: 1
    },
    {
      id: 'test-product-2', 
      name: 'Test Product 2',
      price: 19.99,
      description: 'Another test product for payment testing',
      image: 'https://via.placeholder.com/150',
      quantity: 2
    }
  ];

  const handleTestPayment = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: testItems,
          successUrl: `${window.location.origin}/checkout/success`,
          cancelUrl: `${window.location.origin}/checkout/cancel`,
        }),
      });

      const { sessionId, url, error } = await response.json();

      if (error) {
        setMessage(`Error: ${error}`);
        return;
      }

      if (url) {
        // Redirect to Stripe Checkout
        window.location.href = url;
      } else if (sessionId) {
        // Alternative: redirect to Stripe Checkout using session ID
        const stripe = await getStripe();
        if (stripe) {
          const { error } = await stripe.redirectToCheckout({ sessionId });
          if (error) {
            setMessage(`Stripe error: ${error.message}`);
          }
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      setMessage('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Test Payment
          </h1>
          
          <div className="space-y-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-700">Test Items:</h2>
            {testItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <p className="font-bold text-green-600">${item.price}</p>
              </div>
            ))}
            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">Total:</span>
                <span className="font-bold text-xl text-green-600">
                  ${testItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleTestPayment}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Processing...' : 'Test Payment with Stripe'}
          </button>

          {message && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {message}
            </div>
          )}

          <div className="mt-6 text-sm text-gray-600">
            <p className="text-center">
              This will redirect you to Stripe Checkout for testing.
              <br />
              Use test card: 4242 4242 4242 4242
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}




