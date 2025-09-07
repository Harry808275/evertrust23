'use client';

import { motion } from 'framer-motion';
import { CheckCircle, ArrowLeft, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/lib/cartStore';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function CheckoutSuccessPage() {
  const { clearCart } = useCartStore();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Clear cart after successful checkout
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Success Icon */}
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle size={48} className="text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="font-heading text-4xl font-light text-black mb-4 tracking-wide">
            Payment Successful!
          </h1>
          <p className="font-body text-lg text-gray-600 mb-8">
            Thank you for your purchase. Your order has been confirmed and you'll receive an email confirmation shortly.
          </p>

          {sessionId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-8">
              <p className="font-body text-sm text-gray-600">
                Order ID: <span className="font-mono font-medium">{sessionId}</span>
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center bg-black text-white px-8 py-4 font-body font-medium tracking-wider hover:bg-gray-800 transition-colors duration-300 uppercase rounded-lg"
            >
              <ShoppingBag size={20} className="mr-2" />
              Continue Shopping
            </Link>
            <Link
              href="/account"
              className="inline-flex items-center justify-center border-2 border-black text-black px-8 py-4 font-body font-medium tracking-wider hover:bg-black hover:text-white transition-colors duration-300 uppercase rounded-lg"
            >
              <ArrowLeft size={20} className="mr-2" />
              View Orders
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="font-heading text-xl font-medium text-black mb-4">
              What's Next?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div>
                <h4 className="font-body font-medium text-black mb-2">Order Confirmation</h4>
                <p className="font-body text-sm text-gray-600">
                  You'll receive an email confirmation with your order details and tracking information.
                </p>
              </div>
              <div>
                <h4 className="font-body font-medium text-black mb-2">Shipping Updates</h4>
                <p className="font-body text-sm text-gray-600">
                  We'll notify you when your order ships and provide tracking information.
                </p>
              </div>
              <div>
                <h4 className="font-body font-medium text-black mb-2">Customer Support</h4>
                <p className="font-body text-sm text-gray-600">
                  Need help? Contact our support team for any questions about your order.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}














