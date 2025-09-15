'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { ProductImage } from '@/components/ui/OptimizedImage';
import { useToastHelpers } from '@/components/ui/Toast';

interface ProductCardProps {
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
  description?: string;
  inStock?: boolean;
  onWishlistToggle?: (id: string) => void;
  compact?: boolean;
}

export default function ProductCard({ 
  id, 
  name, 
  price, 
  image, 
  category, 
  description,
  inStock = true,
  onWishlistToggle,
  compact = false,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { success, error } = useToastHelpers();
  const router = useRouter();

  // Validate image URL and provide fallback
  const validImage = image && image.trim() !== '' ? image : '/lv-trainer-front.avif';

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newWishlistState = !isWishlisted;
    setIsWishlisted(newWishlistState);
    onWishlistToggle?.(id);
    
    // Show toast notification
    if (newWishlistState) {
      success('Added to wishlist', `${name} has been added to your wishlist`);
    } else {
      success('Removed from wishlist', `${name} has been removed from your wishlist`);
    }
  };

  const productHref = `/product/${id}`;

  return (
    <Link href={productHref} className="block group" onMouseEnter={() => router.prefetch(productHref)}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="group"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Product Image Container */}
        <div className={`relative bg-gray-100 ${compact ? 'aspect-square' : 'aspect-[3/4]'} ${compact ? 'mb-3' : 'mb-4'} overflow-hidden rounded-lg shadow-professional group-hover:shadow-professional-lg transition-all duration-300 hover-lift`}>
          {/* Absolutely position inner image to ensure it fills card */}
          <div className="absolute inset-0">
            <ProductImage
              src={validImage}
              alt={name}
              className="group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Hover Effects */}
          <motion.div
            animate={{
              scale: isHovered ? 1.05 : 1,
              opacity: isHovered ? 0.9 : 1,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-0"
          />
          
          {/* Wishlist Button */}
          <motion.button
            onClick={handleWishlistToggle}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: isHovered ? 1 : 0.7, 
              scale: isHovered ? 1 : 0.9 
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute ${compact ? 'top-2 right-2 p-1.5' : 'top-4 right-4 p-2'} bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors z-10`}
          >
            <Heart 
              size={compact ? 16 : 20} 
              className={`transition-colors ${
                isWishlisted 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-gray-600 hover:text-red-500'
              }`}
            />
          </motion.button>

          {/* Stock Status Badge */}
          {!inStock && (
            <div className="absolute top-4 left-4 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
              Out of Stock
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="text-center">
          <p className={`font-body ${compact ? 'text-xs' : 'text-sm'} text-gray-500 uppercase tracking-wider ${compact ? 'mb-1' : 'mb-2'}`}>
            {category}
          </p>
          <h3 className={`font-heading ${compact ? 'text-base' : 'text-lg'} font-medium text-black mb-1 group-hover:text-gray-700 transition-colors line-clamp-2`}>
            {name}
          </h3>
          <p className={`font-body ${compact ? 'text-sm' : 'text-base'} font-medium text-amber-600`}>
            {price}
          </p>
          {description && !compact && (
            <p className="font-body text-sm text-gray-600 mt-2 line-clamp-2">
              {description}
            </p>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
