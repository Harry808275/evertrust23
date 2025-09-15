'use client';

import { useEffect, useRef, useState } from 'react';

// Intersection Observer for lazy loading
export function useIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
) {
  const targetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(callback, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options,
    });

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [callback, options]);

  return targetRef;
}

// Debounce hook for performance
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Throttle hook for performance
export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef<number>(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
}

// Virtual scrolling hook
export function useVirtualScroll({
  itemHeight,
  containerHeight,
  itemCount,
  overscan = 5,
}: {
  itemHeight: number;
  containerHeight: number;
  itemCount: number;
  overscan?: number;
}) {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    itemCount - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = [];
  for (let i = startIndex; i <= endIndex; i++) {
    visibleItems.push({
      index: i,
      top: i * itemHeight,
    });
  }

  const totalHeight = itemCount * itemHeight;

  return {
    visibleItems,
    totalHeight,
    setScrollTop,
  };
}

// Memory usage monitoring
export function useMemoryMonitoring() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const checkMemory = () => {
        const memory = (performance as any).memory;
        if (memory) {
          const used = memory.usedJSHeapSize / 1024 / 1024; // MB
          const total = memory.totalJSHeapSize / 1024 / 1024; // MB
          const limit = memory.jsHeapSizeLimit / 1024 / 1024; // MB

          console.log(`Memory Usage: ${used.toFixed(2)}MB / ${total.toFixed(2)}MB (${limit.toFixed(2)}MB limit)`);

          // Warn if memory usage is high
          if (used / limit > 0.8) {
            console.warn('High memory usage detected!');
          }
        }
      };

      const interval = setInterval(checkMemory, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
    }
  }, []);
}

// Image preloading
export function useImagePreload(urls: string[]) {
  useEffect(() => {
    urls.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  }, [urls]);
}

// Resource hints
export function useResourceHints() {
  useEffect(() => {
    // Preconnect to external domains
    const domains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ];

    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      document.head.appendChild(link);
    });

    // Preload critical resources
    const criticalResources = [
      '/lv-hero.mp4',
      '/lv-trainer-front.avif',
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = resource.endsWith('.mp4') ? 'video' : 'image';
      document.head.appendChild(link);
    });
  }, []);
}

// Performance metrics collection
export function usePerformanceMetrics() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Navigation timing
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        const metrics = {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          firstPaint: 0,
          firstContentfulPaint: 0,
        };

        // First Paint and First Contentful Paint
        const paintEntries = performance.getEntriesByType('paint');
        paintEntries.forEach(entry => {
          if (entry.name === 'first-paint') {
            metrics.firstPaint = entry.startTime;
          } else if (entry.name === 'first-contentful-paint') {
            metrics.firstContentfulPaint = entry.startTime;
          }
        });

        console.log('Performance Metrics:', metrics);
        
        // Send to analytics
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'performance_metrics', metrics);
        }
      });
    }
  }, []);
}

// Bundle size optimization helper
export function useBundleOptimization() {
  useEffect(() => {
    // Monitor bundle size
    if (typeof window !== 'undefined') {
      const scripts = document.querySelectorAll('script[src]');
      let totalSize = 0;

      scripts.forEach(script => {
        const src = script.getAttribute('src');
        if (src && src.includes(window.location.origin)) {
          // This is a rough estimate - in production you'd want more accurate measurement
          totalSize += 50; // Estimated KB per script
        }
      });

      console.log(`Estimated bundle size: ${totalSize}KB`);
    }
  }, []);
}

import { useEffect, useRef, useState } from 'react';

// Intersection Observer for lazy loading
export function useIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
) {
  const targetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(callback, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options,
    });

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [callback, options]);

  return targetRef;
}

// Debounce hook for performance
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Throttle hook for performance
export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef<number>(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
}

// Virtual scrolling hook
export function useVirtualScroll({
  itemHeight,
  containerHeight,
  itemCount,
  overscan = 5,
}: {
  itemHeight: number;
  containerHeight: number;
  itemCount: number;
  overscan?: number;
}) {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    itemCount - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = [];
  for (let i = startIndex; i <= endIndex; i++) {
    visibleItems.push({
      index: i,
      top: i * itemHeight,
    });
  }

  const totalHeight = itemCount * itemHeight;

  return {
    visibleItems,
    totalHeight,
    setScrollTop,
  };
}

// Memory usage monitoring
export function useMemoryMonitoring() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const checkMemory = () => {
        const memory = (performance as any).memory;
        if (memory) {
          const used = memory.usedJSHeapSize / 1024 / 1024; // MB
          const total = memory.totalJSHeapSize / 1024 / 1024; // MB
          const limit = memory.jsHeapSizeLimit / 1024 / 1024; // MB

          console.log(`Memory Usage: ${used.toFixed(2)}MB / ${total.toFixed(2)}MB (${limit.toFixed(2)}MB limit)`);

          // Warn if memory usage is high
          if (used / limit > 0.8) {
            console.warn('High memory usage detected!');
          }
        }
      };

      const interval = setInterval(checkMemory, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
    }
  }, []);
}

// Image preloading
export function useImagePreload(urls: string[]) {
  useEffect(() => {
    urls.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  }, [urls]);
}

// Resource hints
export function useResourceHints() {
  useEffect(() => {
    // Preconnect to external domains
    const domains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ];

    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      document.head.appendChild(link);
    });

    // Preload critical resources
    const criticalResources = [
      '/lv-hero.mp4',
      '/lv-trainer-front.avif',
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = resource.endsWith('.mp4') ? 'video' : 'image';
      document.head.appendChild(link);
    });
  }, []);
}

// Performance metrics collection
export function usePerformanceMetrics() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Navigation timing
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        const metrics = {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          firstPaint: 0,
          firstContentfulPaint: 0,
        };

        // First Paint and First Contentful Paint
        const paintEntries = performance.getEntriesByType('paint');
        paintEntries.forEach(entry => {
          if (entry.name === 'first-paint') {
            metrics.firstPaint = entry.startTime;
          } else if (entry.name === 'first-contentful-paint') {
            metrics.firstContentfulPaint = entry.startTime;
          }
        });

        console.log('Performance Metrics:', metrics);
        
        // Send to analytics
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'performance_metrics', metrics);
        }
      });
    }
  }, []);
}

// Bundle size optimization helper
export function useBundleOptimization() {
  useEffect(() => {
    // Monitor bundle size
    if (typeof window !== 'undefined') {
      const scripts = document.querySelectorAll('script[src]');
      let totalSize = 0;

      scripts.forEach(script => {
        const src = script.getAttribute('src');
        if (src && src.includes(window.location.origin)) {
          // This is a rough estimate - in production you'd want more accurate measurement
          totalSize += 50; // Estimated KB per script
        }
      });

      console.log(`Estimated bundle size: ${totalSize}KB`);
    }
  }, []);
}


