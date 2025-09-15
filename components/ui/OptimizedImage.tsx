'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  className?: string; // kept for backward compatibility, applied to image
  imgClassName?: string; // preferred: applied to the <Image>
  wrapperClassName?: string; // applied to the wrapping div
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  sizes,
  className = '',
  imgClassName,
  wrapperClassName = '',
  priority = false,
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  // Generate a simple blur placeholder if none provided
  const defaultBlurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';

  if (hasError) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <div className="text-gray-400 text-sm">Image unavailable</div>
      </div>
    );
  }

  // When using fill, ensure the wrapper stretches to its parent bounds
  const wrapperSizing = fill ? 'absolute inset-0 w-full h-full' : '';

  return (
    <div className={`relative overflow-hidden ${wrapperSizing} ${wrapperClassName}`}>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gray-200 animate-pulse"
        />
      )}
      
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        sizes={sizes}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL || defaultBlurDataURL}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${imgClassName || className}`}
      />
    </div>
  );
}

// Specialized components for common use cases
export function ProductImage({
  src,
  alt,
  className = '',
  ...props
}: Omit<OptimizedImageProps, 'fill' | 'sizes'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      imgClassName={`object-cover ${className}`}
      wrapperClassName="absolute inset-0 w-full h-full"
      quality={90}
      placeholder="blur"
      {...props}
    />
  );
}

export function HeroImage({
  src,
  alt,
  className = '',
  ...props
}: Omit<OptimizedImageProps, 'fill' | 'sizes'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      sizes="100vw"
      className={`object-cover ${className}`}
      priority
      quality={95}
      placeholder="blur"
      {...props}
    />
  );
}
