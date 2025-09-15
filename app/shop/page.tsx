'use client';

import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';

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

export default function ShopPage() {
  const router = useRouter();
  const [category, setCategory] = useState<string>('All');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sort, setSort] = useState<string>('featured');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products?limit=24&page=1');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        const items: Product[] = Array.isArray(data) ? data : (data?.items ?? []);
        setProducts(items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Ensure page scrolls to top when navigating to shop
  useEffect(() => {
    // Scroll to top with smooth behavior
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Also ensure the page is properly positioned
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }, 100);
  }, []);

  const handleWishlistToggle = (productId: string) => {
    console.log(`Product ${productId} wishlist toggled`);
    // TODO: Implement wishlist functionality
  };

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let list = [...products];
    
    if (category !== 'All') {
      list = list.filter(p => p.category === category);
    }
    
    if (inStockOnly) {
      list = list.filter(p => p.inStock);
    }
    
    if (sort === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    }
    
    return list;
  }, [products, category, inStockOnly, sort]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-24">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center mb-12">
            <div className="h-12 bg-gray-200 rounded-lg w-80 mx-auto mb-6 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded-lg w-64 mx-auto animate-pulse"></div>
          </div>
          <ProductGridSkeleton count={12} compact={true} />
        </div>
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
      <div className="container mx-auto px-6 py-8 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
        <h1 className="font-heading text-5xl md:text-6xl font-light text-black mb-6 tracking-wide">
          Shop Collection
        </h1>
        <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto">
          Discover our curated selection of luxury home styling essentials and accessories
        </p>
      </motion.div>

      {/* Toolbar */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <select value={category} onChange={(e)=>setCategory(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg font-body text-gray-700 focus:border-amber-400 focus:outline-none">
            <option>All</option>
            <option>Bags</option>
            <option>Accessories</option>
            <option>Beauty</option>
            <option>Home</option>
            <option>Furniture</option>
            <option>Decor</option>
          </select>
          <label className="inline-flex items-center gap-2 font-body text-gray-700">
            <input type="checkbox" checked={inStockOnly} onChange={(e)=>setInStockOnly(e.target.checked)} className="rounded" />
            In stock only
          </label>
        </div>
        <div>
          <select value={sort} onChange={(e)=>setSort(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg font-body text-gray-700 focus:border-amber-400 focus:outline-none">
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Products Grid - exactly 4 per row on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6">
        {filteredAndSortedProducts.map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
          >
            <ProductCard
              id={product._id}
              name={product.name}
              price={`$${product.price.toLocaleString()}`}
              image={product.images[0] || '/lv-trainer-front.avif'}
              category={product.category}
              description={product.description}
              inStock={product.inStock}
              compact
              onWishlistToggle={handleWishlistToggle}
            />
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAndSortedProducts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <p className="font-body text-lg text-gray-500">
            {products.length === 0 
              ? "No products available at the moment." 
              : "No products match your current filters."}
          </p>
        </motion.div>
      )}
        </div>
      </div>
    );
  }
