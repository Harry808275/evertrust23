'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useCartStore } from '@/lib/cartStore';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Lock, Shield, Truck, CreditCard, Tag, X } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const router = useRouter();
  const totalPrice = getTotalPrice();
  const shippingCost = totalPrice >= 500 ? 0 : 15;
  
  // Calculate discount
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const subtotalAfterDiscount = totalPrice - discountAmount;
  const finalTotal = subtotalAfterDiscount + shippingCost;

  const [formData, setFormData] = useState({
    // Shipping Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    
    // Payment Information
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    
    // Special Fields
    specialInstructions: '',
    privacyInstructions: '', // Unique feature for Style at Home
    
    // Checkout Options
    saveInfo: false,
    subscribeNewsletter: false
  });

  const [isProcessing, setIsProcessing] = useState(false);
  
  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCouponValidation = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setIsValidatingCoupon(true);
    setCouponError('');

    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: couponCode.trim(),
          orderAmount: totalPrice * 100, // Convert to cents
          products: items.map(item => ({
            id: item.id,
            category: item.category,
            price: parseFloat(item.price.replace('$', '').replace(',', '')) * 100
          }))
        }),
      });

      const data = await response.json();

      if (data.valid) {
        setAppliedCoupon(data.coupon);
        setCouponCode('');
        setCouponError('');
      } else {
        setCouponError(data.error || 'Invalid coupon code');
      }
    } catch (error) {
      console.error('Coupon validation error:', error);
      setCouponError('Failed to validate coupon. Please try again.');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Prepare items for Stripe
      const stripeItems = items.map(item => ({
        id: item.id,
        name: item.name,
        price: parseFloat(item.price.replace('$', '').replace(',', '')),
        image: item.image,
        quantity: item.quantity,
        description: item.description || '',
      }));

      // Call Stripe checkout API
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: stripeItems,
          // Include session id placeholder so success page can read it
          successUrl: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/checkout/cancel`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Checkout failed');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert(`Payment error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-24">
        <div className="container mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="font-heading text-4xl font-light text-black mb-4 tracking-wide">
              Checkout
            </h1>
            <p className="font-body text-lg text-gray-600 mb-8">
              Your cart is empty. Add some items to proceed to checkout.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-black text-white px-8 py-4 font-body font-medium tracking-wider hover:bg-gray-800 transition-colors duration-300 uppercase rounded-lg"
            >
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link
            href="/cart"
            className="inline-flex items-center text-gray-600 hover:text-black transition-colors mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Cart
          </Link>
          <h1 className="font-heading text-4xl md:text-5xl font-light text-black mb-4 tracking-wide">
            Checkout
          </h1>
        </motion.div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-12">
            {/* Shipping Information */}
            <motion.section
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Truck size={24} className="text-amber-600" />
                <h2 className="font-heading text-2xl font-medium text-black tracking-wide">
                  Shipping Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="font-body font-medium text-black mb-2 block">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg font-body text-gray-700 focus:border-amber-400 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="font-body font-medium text-black mb-2 block">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg font-body text-gray-700 focus:border-amber-400 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="font-body font-medium text-black mb-2 block">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg font-body text-gray-700 focus:border-amber-400 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="font-body font-medium text-black mb-2 block">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg font-body text-gray-700 focus:border-amber-400 focus:outline-none transition-colors"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="font-body font-medium text-black mb-2 block">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg font-body text-gray-700 focus:border-amber-400 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="font-body font-medium text-black mb-2 block">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg font-body text-gray-700 focus:border-amber-400 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="font-body font-medium text-black mb-2 block">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg font-body text-gray-700 focus:border-amber-400 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="font-body font-medium text-black mb-2 block">
                    ZIP Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg font-body text-gray-700 focus:border-amber-400 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="font-body font-medium text-black mb-2 block">
                    Country
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg font-body text-gray-700 focus:border-amber-400 focus:outline-none transition-colors"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
              </div>
            </motion.section>

            {/* Special Instructions - Unique to Style at Home */}
            <motion.section
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Shield size={24} className="text-amber-600" />
                <h2 className="font-heading text-2xl font-medium text-black tracking-wide">
                  Special Instructions
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="font-body font-medium text-black mb-2 block">
                    Special Privacy Instructions
                    <span className="text-sm text-gray-500 ml-2">
                      (Unique to Style at Home - Tell us how to handle your order discreetly)
                    </span>
                  </label>
                  <textarea
                    name="privacyInstructions"
                    value={formData.privacyInstructions}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="e.g., 'Please deliver in plain packaging', 'Leave at back door', 'Call before delivery', 'No branding on package'"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg font-body text-gray-700 focus:border-amber-400 focus:outline-none transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="font-body font-medium text-black mb-2 block">
                    Additional Delivery Instructions
                  </label>
                  <textarea
                    name="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Any other special requests or delivery preferences..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg font-body text-gray-700 focus:border-amber-400 focus:outline-none transition-colors resize-none"
                  />
                </div>
              </div>
            </motion.section>

            {/* Payment Information */}
            <motion.section
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-6"
            >
              <div className="flex items-center space-x-3 mb-6">
                <CreditCard size={24} className="text-amber-600" />
                <h2 className="font-heading text-2xl font-medium text-black tracking-wide">
                  Payment Information
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="font-body font-medium text-black mb-2 block">
                    Card Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    required
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg font-body text-gray-700 focus:border-amber-400 focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="font-body font-medium text-black mb-2 block">
                      Expiry Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      required
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg font-body text-gray-700 focus:border-amber-400 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="font-body font-medium text-black mb-2 block">
                      CVV <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      required
                      placeholder="123"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg font-body text-gray-700 focus:border-amber-400 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="font-body font-medium text-black mb-2 block">
                      Cardholder Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cardholderName"
                      value={formData.cardholderName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg font-body text-gray-700 focus:border-amber-400 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Coupon Code Section */}
            <motion.section
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="space-y-6"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Tag size={24} className="text-amber-600" />
                <h2 className="font-heading text-2xl font-medium text-black tracking-wide">
                  Promotional Code
                </h2>
              </div>

              {!appliedCoupon ? (
                <div className="space-y-4">
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-lg font-body text-gray-700 focus:border-amber-400 focus:outline-none transition-colors"
                      onKeyPress={(e) => e.key === 'Enter' && handleCouponValidation()}
                    />
                    <button
                      type="button"
                      onClick={handleCouponValidation}
                      disabled={isValidatingCoupon || !couponCode.trim()}
                      className={`px-6 py-3 font-body font-medium tracking-wider transition-colors duration-300 uppercase rounded-lg ${
                        isValidatingCoupon || !couponCode.trim()
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-amber-400 text-black hover:bg-amber-300'
                      }`}
                    >
                      {isValidatingCoupon ? 'Validating...' : 'Apply'}
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-red-600 text-sm font-body">{couponError}</p>
                  )}
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Tag size={16} className="text-green-600" />
                      </div>
                      <div>
                        <p className="font-body font-medium text-green-800">
                          {appliedCoupon.name} ({appliedCoupon.code})
                        </p>
                        <p className="font-body text-sm text-green-600">
                          {appliedCoupon.type === 'percentage' 
                            ? `${appliedCoupon.value}% off`
                            : `$${(appliedCoupon.discountAmount / 100).toFixed(2)} off`
                          }
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-green-600 hover:text-green-800 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              )}
            </motion.section>

            {/* Additional Options */}
            <motion.section
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="saveInfo"
                    checked={formData.saveInfo}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-400"
                  />
                  <span className="font-body text-gray-700">Save shipping information for future orders</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="subscribeNewsletter"
                    checked={formData.subscribeNewsletter}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-400"
                  />
                  <span className="font-body text-gray-700">Subscribe to our newsletter for exclusive offers</span>
                </label>
              </div>
            </motion.section>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-gray-50 rounded-lg p-6 sticky top-32">
              <h2 className="font-heading text-2xl font-medium text-black mb-6 tracking-wide">
                Order Summary
              </h2>

              {/* Items List */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex justify-between items-center">
                    <div className="flex-1 min-w-0">
                      <p className="font-body font-medium text-black truncate">{item.name}</p>
                      <p className="font-body text-sm text-gray-600">
                        Qty: {item.quantity}
                        {item.selectedSize && ` • Size: ${item.selectedSize}`}
                        {item.selectedColor && ` • Color: ${item.selectedColor}`}
                      </p>
                    </div>
                    <span className="font-body font-medium ml-4">
                      ${(parseFloat(item.price.replace('$', '').replace(',', '')) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Summary Details */}
              <div className="space-y-4 mb-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="font-body text-gray-600">Subtotal</span>
                  <span className="font-body font-medium">${totalPrice.toFixed(2)}</span>
                </div>
                
                {appliedCoupon && (
                  <div className="flex justify-between">
                    <span className="font-body text-gray-600">
                      Discount ({appliedCoupon.code})
                    </span>
                    <span className="font-body font-medium text-green-600">
                      -${(discountAmount / 100).toFixed(2)}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="font-body text-gray-600">Shipping</span>
                  <span className="font-body font-medium text-green-600">
                    {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="font-heading text-lg font-medium text-black">Total</span>
                    <span className="font-heading text-lg font-medium text-black">
                      ${finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="flex items-center space-x-3 text-sm text-gray-600 mb-6 p-4 bg-white rounded-lg">
                <Lock size={16} className="text-green-600" />
                <span>Your payment information is secure and encrypted</span>
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className={`w-full py-4 px-8 font-body font-medium tracking-wider transition-colors duration-300 uppercase rounded-lg flex items-center justify-center space-x-3 ${
                  isProcessing
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Lock size={20} />
                    <span>Place Order</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
