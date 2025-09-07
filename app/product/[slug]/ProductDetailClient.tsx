"use client";

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ShoppingBag, Star, Truck } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRecentStore } from '@/lib/recentStore';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  description: string;
  stock: number;
  inStock: boolean;
}

export default function ProductDetailClient({ slug }: { slug: string }) {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCartStore();
  const router = useRouter();

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${slug}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const [activeImage, setActiveImage] = useState<string>('/lv-trainer-front.avif');

  // Update active image when product loads
  useEffect(() => {
    if (product && product.images.length > 0 && product.images[0]) {
      setActiveImage(product.images[0]);
    } else {
      setActiveImage('/lv-trainer-front.avif');
    }
  }, [product]);

  // Record recently viewed
  const addRecent = useRecentStore((s) => s.addRecent);
  useEffect(() => {
    if (product?._id) addRecent(product._id);
  }, [product?._id, addRecent]);

  const handleAddToCart = () => {
    if (!product || !selectedSize || !selectedColor) {
      alert('Please select both size and color');
      return;
    }
    
    const cartProduct = {
      id: product._id,
      name: product.name,
      price: `$${product.price.toLocaleString()}`,
      image: product.images[0] || '/lv-trainer-front.avif',
      category: product.category,
      description: product.description,
      inStock: product.inStock,
    };
    
    addItem(cartProduct, selectedSize, selectedColor);
    router.replace('/cart');
  };

  const handleBuyNow = () => {
    if (!product || !selectedSize || !selectedColor) {
      alert('Please select both size and color');
      return;
    }
    
    const cartProduct = {
      id: product._id,
      name: product.name,
      price: `$${product.price.toLocaleString()}`,
      image: product.images[0] || '/lv-trainer-front.avif',
      category: product.category,
      description: product.description,
      inStock: product.inStock,
    };
    
    addItem(cartProduct, selectedSize, selectedColor);
    router.replace('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p className="font-body text-lg text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="font-body text-lg text-red-600 mb-4">
            {error || 'Product not found'}
          </p>
          <Link 
            href="/shop"
            className="px-6 py-2 bg-amber-400 text-white rounded-lg hover:bg-amber-500 transition-colors"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  // Default sizes and colors if not specified
  const sizes = ['Small', 'Medium', 'Large'];
  const colors = product.images.length > 1 ? product.images.map((_, i) => `Option ${i + 1}`) : ['Default'];

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="container mx-auto px-6">
        <motion.nav initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <a href="/" className="hover:text-amber-600 transition-colors">
                Home
              </a>
            </li>
            <li>/</li>
            <li>
              <a href="/shop" className="hover:text-amber-600 transition-colors">
                Shop
              </a>
            </li>
            <li>/</li>
            <li className="text-black">{product.name}</li>
          </ol>
        </motion.nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10 items-start">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="space-y-6">
            <div className="mx-auto w-full max-w-[520px] max-h-[60vh] aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                whileHover={{ scale: 1.02 }}
                className="w-full h-full cursor-zoom-in"
              >
                <img src={activeImage} alt="Product image" className="w-full h-full object-cover" />
              </motion.div>
            </div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2.5 max-w-[520px] mx-auto">
                {product.images
                  .filter(src => src && src.trim() !== '')
                  .map((src, index) => (
                  <motion.button
                    type="button"
                    key={index}
                    whileHover={{ scale: 1.03 }}
                    onClick={() => setActiveImage(src)}
                    className={`aspect-square bg-gray-100 rounded-lg cursor-pointer overflow-hidden transition-shadow ${
                      activeImage === src ? 'shadow-lg' : 'shadow-sm hover:shadow-md'
                    }`}
                    aria-pressed={activeImage === src}
                  >
                    <img src={src} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="space-y-6 px-4 lg:px-0 lg:sticky lg:top-24">
            <div>
              <p className="font-body text-sm text-amber-600 uppercase tracking-wider mb-2">{product.category}</p>
              <h1 className="font-heading text-3xl md:text-4xl font-light text-black mb-2 tracking-wide">{product.name}</h1>

              <div className="flex items-center space-x-3 mb-4">
                <span className="font-heading text-2xl font-medium text-amber-600">${product.price.toLocaleString()}</span>
              </div>

              <div className="flex items-center space-x-2 mb-4">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  product.inStock 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.inStock ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>
            </div>

            <div>
              <h3 className="font-heading text-lg font-medium text-black mb-2">Description</h3>
              <p className="font-body text-gray-600 leading-normal text-[15px]">{product.description}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="font-heading text-lg font-medium text-black mb-3 block">
                  Size <span className="text-red-500">*</span>
                </label>
                <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg font-body text-gray-700 focus:border-amber-400 focus:outline-none transition-colors">
                  <option value="">Select Size</option>
                  {sizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-heading text-lg font-medium text-black mb-3 block">
                  Color <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedColor}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedColor(value);
                    const idx = colors.indexOf(value);
                    if (idx >= 0 && product.images[idx] && product.images[idx].trim() !== '') {
                      setActiveImage(product.images[idx]);
                    }
                  }}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg font-body text-gray-700 focus:border-amber-400 focus:outline-none transition-colors"
                >
                  <option value="">Select Color</option>
                  {colors.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <motion.button
                onClick={handleAddToCart}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!selectedSize || !selectedColor || !product.inStock}
                className={`w-full py-3 px-6 font-body font-medium tracking-widest transition-all duration-300 uppercase rounded-lg flex items-center justify-center space-x-3 shadow-md ${
                  selectedSize && selectedColor && product.inStock
                    ? 'bg-gradient-to-r from-black via-gray-900 to-gray-800 text-white hover:shadow-lg hover:ring-2 hover:ring-amber-500/40'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <ShoppingBag size={20} />
                <span>Add to Cart</span>
              </motion.button>

              <motion.button
                onClick={handleBuyNow}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!selectedSize || !selectedColor || !product.inStock}
                className={`w-full py-3 px-6 font-body font-semibold tracking-widest transition-all duration-300 uppercase rounded-lg flex items-center justify-center space-x-3 border-2 ${
                  selectedSize && selectedColor && product.inStock
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black border-amber-600 hover:shadow-[0_0_0_4px_rgba(245,158,11,0.25)]'
                    : 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed'
                }`}
              >
                <span>Buy Now</span>
              </motion.button>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  <span className="font-body text-gray-600">100% Authentic</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  <span className="font-body text-gray-600">Free Shipping</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  <span className="font-body text-gray-600">30-Day Returns</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  <span className="font-body text-gray-600">Secure Payment</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-3 text-gray-600">
                <Truck size={20} />
                <span className="font-body">Free shipping on orders over $500</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
