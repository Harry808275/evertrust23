'use client';

import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular' | 'card';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave';
}

export default function Skeleton({ 
  className = '', 
  variant = 'rectangular', 
  width, 
  height,
  animation = 'pulse'
}: SkeletonProps) {
  const baseClasses = 'bg-gray-200 rounded';
  
  const variantClasses = {
    text: 'h-4 rounded-full',
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
    card: 'rounded-lg shadow-sm'
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]'
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    />
  );
}

// Pre-built skeleton components for common use cases
export function ProductCardSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <div className="group">
      <div className={`relative bg-gray-100 ${compact ? 'aspect-square mb-3' : 'aspect-[3/4] mb-4'} overflow-hidden rounded-lg shadow-sm`}>
        <Skeleton variant="rectangular" className="w-full h-full" />
      </div>
      <div className="text-center">
        <Skeleton variant="text" width="60%" className="mx-auto mb-2" />
        <Skeleton variant="text" width="80%" className="mx-auto mb-1" />
        <Skeleton variant="text" width="40%" className="mx-auto" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8, compact = false }: { count?: number; compact?: boolean }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8`}>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        >
          <ProductCardSkeleton compact={compact} />
        </motion.div>
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative h-screen bg-gray-200 flex items-center justify-center overflow-hidden">
      <Skeleton variant="rectangular" className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 bg-black/40" />
      <div className="text-center z-10">
        <Skeleton variant="text" width="400px" height="80px" className="mx-auto mb-8" />
        <Skeleton variant="text" width="600px" height="32px" className="mx-auto mb-12" />
        <Skeleton variant="rectangular" width="200px" height="56px" className="mx-auto rounded-none" />
      </div>
    </div>
  );
}











