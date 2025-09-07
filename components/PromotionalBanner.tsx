'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  type: 'hero' | 'top_bar' | 'sidebar' | 'popup' | 'banner' | 'notification';
  position: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'full_width';
  content: {
    text?: string;
    buttonText?: string;
    buttonLink?: string;
    backgroundColor?: string;
    textColor?: string;
    buttonColor?: string;
    imageUrl?: string;
    videoUrl?: string;
    icon?: string;
  };
  displayRules: {
    showAfterDelay?: number;
    showFrequency?: 'once' | 'daily' | 'weekly' | 'always';
    maxDisplays?: number;
  };
}

interface PromotionalBannerProps {
  type?: string;
  position?: string;
  pagePath?: string;
}

export default function PromotionalBanner({ 
  type, 
  position, 
  pagePath = '/' 
}: PromotionalBannerProps) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [visibleBanners, setVisibleBanners] = useState<Banner[]>([]);
  const [dismissedBanners, setDismissedBanners] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, [type, position, pagePath]);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (type) params.append('type', type);
      if (position) params.append('position', position);
      params.append('pagePath', pagePath);

      const response = await fetch(`/api/promotional-banners/active?${params}`);
      if (response.ok) {
        const data = await response.json();
        setBanners(data.banners || []);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (banners.length === 0) return;

    // Filter out dismissed banners
    const filteredBanners = banners.filter(banner => !dismissedBanners.has(banner._id));
    
    // Check display frequency rules
    const validBanners = filteredBanners.filter(banner => {
      const storageKey = `banner_${banner._id}_display`;
      const lastDisplay = localStorage.getItem(storageKey);
      const now = Date.now();
      
      if (!lastDisplay) return true;
      
      const lastDisplayTime = parseInt(lastDisplay);
      const timeDiff = now - lastDisplayTime;
      
      switch (banner.displayRules.showFrequency) {
        case 'once':
          return false; // Already shown once
        case 'daily':
          return timeDiff > 24 * 60 * 60 * 1000; // 24 hours
        case 'weekly':
          return timeDiff > 7 * 24 * 60 * 60 * 1000; // 7 days
        case 'always':
        default:
          return true;
      }
    });

    // Check max displays
    const finalBanners = validBanners.filter(banner => {
      if (!banner.displayRules.maxDisplays) return true;
      
      const displayCountKey = `banner_${banner._id}_count`;
      const displayCount = parseInt(localStorage.getItem(displayCountKey) || '0');
      
      return displayCount < banner.displayRules.maxDisplays;
    });

    setVisibleBanners(finalBanners);
  }, [banners, dismissedBanners]);

  const handleBannerClick = async (banner: Banner) => {
    // Track click
    try {
      await fetch('/api/promotional-banners/active', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bannerId: banner._id, action: 'click' })
      });
    } catch (error) {
      console.error('Error tracking banner click:', error);
    }

    // Update display count
    const displayCountKey = `banner_${banner._id}_count`;
    const currentCount = parseInt(localStorage.getItem(displayCountKey) || '0');
    localStorage.setItem(displayCountKey, (currentCount + 1).toString());
  };

  const handleBannerImpression = async (banner: Banner) => {
    // Track impression
    try {
      await fetch('/api/promotional-banners/active', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bannerId: banner._id, action: 'impression' })
      });
    } catch (error) {
      console.error('Error tracking banner impression:', error);
    }

    // Update last display time
    const storageKey = `banner_${banner._id}_display`;
    localStorage.setItem(storageKey, Date.now().toString());
  };

  const handleDismiss = (bannerId: string) => {
    setDismissedBanners(prev => new Set([...prev, bannerId]));
  };

  if (loading || visibleBanners.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      {visibleBanners.map((banner, index) => (
        <BannerComponent
          key={banner._id}
          banner={banner}
          index={index}
          onImpression={() => handleBannerImpression(banner)}
          onClick={() => handleBannerClick(banner)}
          onDismiss={() => handleDismiss(banner._id)}
        />
      ))}
    </AnimatePresence>
  );
}

interface BannerComponentProps {
  banner: Banner;
  index: number;
  onImpression: () => void;
  onClick: () => void;
  onDismiss: () => void;
}

function BannerComponent({ banner, index, onImpression, onClick, onDismiss }: BannerComponentProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Track impression when component mounts
    onImpression();
    
    // Handle show delay
    const delay = banner.displayRules.showAfterDelay || 0;
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [banner.displayRules.showAfterDelay, onImpression]);

  const getBannerStyles = () => {
    const baseStyles = {
      backgroundColor: banner.content.backgroundColor || '#f3f4f6',
      color: banner.content.textColor || '#1f2937',
    };

    switch (banner.type) {
      case 'top_bar':
        return {
          ...baseStyles,
          position: 'fixed' as const,
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: '12px 16px',
        };
      case 'popup':
        return {
          ...baseStyles,
          position: 'fixed' as const,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 50,
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxWidth: '400px',
          width: '90%',
        };
      case 'notification':
        return {
          ...baseStyles,
          position: 'fixed' as const,
          top: '20px',
          right: '20px',
          zIndex: 50,
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          maxWidth: '350px',
        };
      default:
        return baseStyles;
    }
  };

  const getAnimationProps = () => {
    switch (banner.type) {
      case 'top_bar':
        return {
          initial: { y: -100, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: -100, opacity: 0 },
          transition: { duration: 0.5, ease: "easeOut" }
        };
      case 'popup':
        return {
          initial: { scale: 0.8, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.8, opacity: 0 },
          transition: { duration: 0.3, ease: "easeOut" }
        };
      case 'notification':
        return {
          initial: { x: 400, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: 400, opacity: 0 },
          transition: { duration: 0.4, ease: "easeOut" }
        };
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.3 }
        };
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      {...getAnimationProps()}
      style={getBannerStyles()}
      className="relative"
    >
      {/* Close button for dismissible banners */}
      {(banner.type === 'popup' || banner.type === 'notification') && (
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
      )}

      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-heading text-lg font-medium mb-1">
            {banner.title}
          </h3>
          {banner.subtitle && (
            <p className="font-body text-sm opacity-90 mb-2">
              {banner.subtitle}
            </p>
          )}
          {banner.content.text && (
            <p className="font-body text-sm opacity-80">
              {banner.content.text}
            </p>
          )}
        </div>

        {banner.content.buttonText && banner.content.buttonLink && (
          <div className="ml-4">
            <Link
              href={banner.content.buttonLink}
              onClick={onClick}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-body font-medium transition-colors"
              style={{
                backgroundColor: banner.content.buttonColor || '#f59e0b',
                color: '#000000'
              }}
            >
              <span>{banner.content.buttonText}</span>
              <ExternalLink size={16} />
            </Link>
          </div>
        )}
      </div>

      {/* Background overlay for popup */}
      {banner.type === 'popup' && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onDismiss}
        />
      )}
    </motion.div>
  );
}

