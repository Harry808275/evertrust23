'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { useEffect, useState } from 'react';
import { useRecentStore } from '@/lib/recentStore';
import { ProductGridSkeleton, HeroSkeleton } from '@/components/ui/Skeleton';

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

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { recentIds } = useRecentStore();

  // Fetch recent products
  useEffect(() => {
    const fetchRecentProducts = async () => {
      if (recentIds.length === 0) return;
      
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const productsData = await response.json();
          const allProducts: Product[] = Array.isArray(productsData) ? productsData : (productsData?.items ?? []);
          
          // Filter products that are in recentIds
          const recent = allProducts.filter(product => recentIds.includes(product._id));
          setRecentProducts(recent);
        }
      } catch (err) {
        console.error('Error fetching recent products:', err);
      }
    };

    fetchRecentProducts();
  }, [recentIds]);

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products?limit=12&page=1');
        
        if (response.ok) {
          const productsData = await response.json();
          const items: Product[] = Array.isArray(productsData) ? productsData : (productsData?.items ?? []);
          console.log('Products fetched:', items.length);
          setProducts(items);
        } else {
          console.error('Products response not ok:', response.status);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-24">
        <HeroSkeleton />
        <section className="py-24 px-6 bg-gray-50">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <div className="h-12 bg-gray-200 rounded-lg w-96 mx-auto mb-6 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded-lg w-80 mx-auto animate-pulse"></div>
            </div>
            <ProductGridSkeleton count={8} />
        </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="font-body text-lg text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-amber-400 text-white rounded-lg hover:bg-amber-500 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen bg-black flex items-center justify-center overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/lv-hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src="/lv-hero.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        <div className="absolute inset-0 bg-black/40" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center z-10"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="font-heading text-6xl md:text-8xl font-light text-amber-400 mb-8 tracking-wider"
          >
            STYLE AT HOME
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            className="font-body text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto px-6"
          >
            Discover timeless elegance and sophisticated design for your living space
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9, ease: "easeOut" }}
          >
            <Link
              href="/shop"
              className="inline-block bg-amber-400 text-black px-12 py-4 font-body font-medium tracking-wider hover:bg-amber-300 transition-colors duration-300 uppercase"
            >
              Shop Now
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Products Section */}
      {products.length > 0 ? (
        <section className="py-24 px-6 bg-gray-50">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-heading text-4xl md:text-5xl font-light text-black mb-6 tracking-wide">
                Featured Products
              </h2>
              <p className="font-body text-lg text-gray-600 max-w-2xl mx-auto">
                Discover our curated collection of premium products
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.slice(0, 8).map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                  viewport={{ once: true }}
                >
                  <ProductCard
                    id={product._id}
                    name={product.name}
                    price={`$${product.price.toFixed(2)}`}
                    image={(product.images && product.images[0]) || ''}
                    category={product.category}
                    inStock={product.inStock}
                  />
                </motion.div>
              ))}
            </div>

            {products.length > 8 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true }}
                className="text-center mt-12"
              >
                <Link
                  href="/shop"
                  className="inline-block bg-black text-white px-10 py-4 font-body font-medium tracking-wider hover:bg-gray-800 transition-colors duration-300 uppercase rounded-lg"
                >
                  View All Products
                </Link>
              </motion.div>
            )}
          </div>
        </section>
      ) : !loading && (
        <section className="py-24 px-6 bg-gray-50">
          <div className="container mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="font-heading text-4xl md:text-5xl font-light text-black mb-6 tracking-wide">
                No Products Available
              </h2>
              <p className="font-body text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                We're currently setting up our product catalog. Please check back soon!
              </p>
              <Link
                href="/shop"
                className="inline-block bg-black text-white px-10 py-4 font-body font-medium tracking-wider hover:bg-gray-800 transition-colors duration-300 uppercase rounded-lg"
              >
                Visit Shop
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* View All Products Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
          <div className="relative w-full h-[60vh] overflow-hidden rounded-xl">
            <video
              className="absolute inset-0 w-full h-full object-cover"
              src="/lv-hero.mp4"
              autoPlay
              muted
              loop
              playsInline
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Link
                href="/shop"
                className="inline-block bg-white text-black px-10 py-4 font-body tracking-wider uppercase rounded-full shadow-md hover:shadow-lg transition"
              >
                View All Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Viewed Section */}
      {recentProducts.length > 0 && (
        <section className="py-24 px-6 bg-white">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-heading text-4xl md:text-5xl font-light text-black mb-6 tracking-wide">
                Recently Viewed
              </h2>
              <p className="font-body text-lg text-gray-600 max-w-2xl mx-auto">
                Continue exploring products you've recently viewed
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {recentProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                  viewport={{ once: true }}
                >
                  <ProductCard
                    id={product._id}
                    name={product.name}
                    price={`$${product.price.toFixed(2)}`}
                    image={(product.images && product.images[0]) || ''}
                    category={product.category}
                    inStock={product.inStock}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-black text-white border-t border-gray-800 py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="lg:col-span-2">
              <h3 className="font-heading text-3xl font-light text-white mb-6 tracking-wide">
                STYLE AT HOME
              </h3>
              <p className="font-body text-gray-300 mb-6 max-w-md leading-relaxed">
                Discover timeless elegance and sophisticated design for your living space. Curated pieces that define luxury living.
              </p>
            </div>
            <div>
              <h4 className="font-heading text-lg font-medium text-white mb-6 tracking-wide">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link href="/shop" className="font-body text-gray-300 hover:text-amber-400 transition-colors duration-300">Shop All</Link></li>
                <li><Link href="/about" className="font-body text-gray-300 hover:text-amber-400 transition-colors duration-300">About</Link></li>
                <li><Link href="/contact" className="font-body text-gray-300 hover:text-amber-400 transition-colors duration-300">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading text-lg font-medium text-white mb-6 tracking-wide">Customer Service</h4>
              <ul className="space-y-3">
                <li><Link href="/contact" className="font-body text-gray-300 hover:text-amber-400 transition-colors duration-300">Contact Us</Link></li>
                <li><Link href="/shop" className="font-body text-gray-300 hover:text-amber-400 transition-colors duration-300">Shop</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center">
            <p className="font-body text-gray-400 text-sm">
              © 2024 Style at Home. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}