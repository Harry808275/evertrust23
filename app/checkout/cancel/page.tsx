'use client';

import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Cancel Icon */}
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <XCircle size={48} className="text-red-600" />
          </div>

          {/* Cancel Message */}
          <h1 className="font-heading text-4xl font-light text-black mb-4 tracking-wide">
            Payment Cancelled
          </h1>
          <p className="font-body text-lg text-gray-600 mb-8">
            Your payment was cancelled. No charges were made to your account. Your items are still in your cart.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/cart"
              className="inline-flex items-center justify-center bg-black text-white px-8 py-4 font-body font-medium tracking-wider hover:bg-gray-800 transition-colors duration-300 uppercase rounded-lg"
            >
              <ShoppingBag size={20} className="mr-2" />
              Return to Cart
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center border-2 border-black text-black px-8 py-4 font-body font-medium tracking-wider hover:bg-black hover:text-white transition-colors duration-300 uppercase rounded-lg"
            >
              <ArrowLeft size={20} className="mr-2" />
              Continue Shopping
            </Link>
          </div>

          {/* Help Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="font-heading text-xl font-medium text-black mb-4">
              Need Help?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="font-body font-medium text-black mb-2">Payment Issues</h4>
                <p className="font-body text-sm text-gray-600">
                  If you're having trouble with payment, please contact our support team for assistance.
                </p>
              </div>
              <div>
                <h4 className="font-body font-medium text-black mb-2">Order Questions</h4>
                <p className="font-body text-sm text-gray-600">
                  Have questions about your order? We're here to help with any concerns.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
