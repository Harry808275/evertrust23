'use client';

import { motion } from 'framer-motion';
import { useCartStore } from '@/lib/cartStore';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Bookmark, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useSavedStore } from '@/lib/savedStore';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems, clearCart } = useCartStore();
  const { items: savedItems, addSaved, removeSaved, clearSaved } = useSavedStore();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
  };

  const handleCheckout = async () => {
    if (!session) {
      // Redirect to sign in
      window.location.href = '/auth/signin';
      return;
    }

    console.log('Cart items before checkout:', items);

    setIsLoading(true);
    try {
      const checkoutItems = items.map(item => ({
        id: item.id,
        name: item.name,
        description: item.category,
        price: item.price, // Send original price string, let API handle parsing
        quantity: item.quantity,
        image: item.image || ''
      }));

      console.log('Sending checkout request with items:', checkoutItems);

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: checkoutItems,
        }),
      });

      console.log('Checkout response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Checkout API error:', errorData);
        
        if (response.status === 401) {
          alert('Please sign in to continue with checkout');
          window.location.href = '/auth/signin';
          return;
        } else if (response.status === 500) {
          alert('Checkout service is temporarily unavailable. Please try again later.');
        } else {
          throw new Error(errorData.error || 'Checkout failed');
        }
        return;
      }

      const data = await response.json();
      console.log('Checkout response data:', data);
      
      if (data.url) {
        console.log('Redirecting to checkout URL:', data.url);
        window.location.href = data.url;
      } else {
        console.error('No checkout URL in response:', data);
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setIsLoading(false);
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
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag size={40} className="text-gray-400" />
            </div>
            <h1 className="font-heading text-4xl font-light text-black mb-4 tracking-wide">
              Your Cart is Empty
            </h1>
            <p className="font-body text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start shopping to discover our collection.
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
          className="mb-12"
        >
          <h1 className="font-heading text-4xl md:text-5xl font-light text-black mb-4 tracking-wide">
            Shopping Cart
          </h1>
          <p className="font-body text-lg text-gray-600">
            {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              {items.map((item, index) => (
                <motion.div
                  key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-6"
                >
                  <div className="flex items-start space-x-6">
                    {/* Product Image */}
                    <div className="w-24 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                      <Image
                        src={item.image && item.image.trim() !== '' ? item.image : '/lv-trainer-front.avif'}
                        alt={item.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.src = '/lv-trainer-front.avif';
                        }}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading text-xl font-medium text-black mb-2">
                        {item.name}
                      </h3>
                      <p className="font-body text-gray-600 mb-2">
                        {item.category}
                      </p>
                      {(item.selectedSize || item.selectedColor) && (
                        <div className="flex space-x-4 mb-3">
                          {item.selectedSize && (
                            <span className="font-body text-sm text-gray-500">
                              Size: {item.selectedSize}
                            </span>
                          )}
                          {item.selectedColor && (
                            <span className="font-body text-sm text-gray-500">
                              Color: {item.selectedColor}
                            </span>
                          )}
                        </div>
                      )}
                      <p className="font-heading text-lg font-medium text-amber-600 mb-4">
                        {item.price}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center border border-gray-200 rounded-lg">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-gray-50 transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-4 py-2 font-body font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-50 transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700 transition-colors p-2"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          onClick={() => { addSaved(item, item.selectedSize, item.selectedColor, item.quantity); removeItem(item.id); }}
                          className="text-amber-600 hover:text-amber-700 transition-colors p-2 flex items-center gap-1"
                        >
                          <Bookmark size={16} />
                          <span className="hidden sm:inline font-body text-sm">Save</span>
                        </button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <p className="font-heading text-xl font-medium text-black">
                        ${(parseFloat(item.price.replace('$', '').replace(',', '')) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Clear Cart Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 pt-6 border-t border-gray-200"
            >
              <button
                onClick={clearCart}
                className="text-red-500 hover:text-red-700 font-body font-medium transition-colors"
              >
                Clear Cart
              </button>
            </motion.div>
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

              {/* Summary Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-body text-gray-600">Subtotal</span>
                  <span className="font-body font-medium">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body text-gray-600">Shipping</span>
                  <span className="font-body font-medium text-green-600">
                    {totalPrice >= 500 ? 'Free' : '$15.00'}
                  </span>
                </div>
                {totalPrice < 500 && (
                  <div className="text-sm text-gray-500">
                    Add ${(500 - totalPrice).toFixed(2)} more for free shipping
                  </div>
                )}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="font-heading text-lg font-medium text-black">Total</span>
                    <span className="font-heading text-lg font-medium text-black">
                      ${totalPrice >= 500 ? totalPrice.toFixed(2) : (totalPrice + 15).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full bg-black text-white py-4 px-8 font-body font-medium tracking-wider hover:bg-gray-800 transition-colors duration-300 uppercase rounded-lg flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>

              {/* Continue Shopping */}
              <div className="mt-4 text-center">
                <Link
                  href="/shop"
                  className="font-body text-gray-600 hover:text-black transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Saved for later */}
        {savedItems.length > 0 && (
          <div className="mt-12">
            <h2 className="font-heading text-2xl font-light text-black mb-4 tracking-wide">Saved for later</h2>
            <div className="space-y-4">
              {savedItems.map((s) => (
                <div key={`${s.id}-${s.selectedSize}-${s.selectedColor}`} className="flex items-center justify-between border border-gray-200 rounded-lg p-4">
                  <div>
                    <p className="font-heading text-lg text-black">{s.name}</p>
                    <p className="font-body text-gray-600 text-sm">{s.category}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-body text-amber-600 font-medium">{s.price}</span>
                    <button onClick={() => { useCartStore.getState().addItem(s, s.selectedSize, s.selectedColor); removeSaved(s.id); }} className="border-2 border-black text-black px-4 py-2 font-body text-sm hover:bg-black hover:text-white transition-colors rounded-lg">Move to cart</button>
                    <button onClick={() => removeSaved(s.id)} className="text-red-500 hover:text-red-700 p-2"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
              <div className="text-right">
                <button onClick={clearSaved} className="font-body text-gray-600 hover:text-black transition-colors text-sm">Clear saved</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
