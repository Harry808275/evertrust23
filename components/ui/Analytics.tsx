'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Performance monitoring
export function usePerformanceMonitoring() {
  useEffect(() => {
    // Monitor Core Web Vitals
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Largest Contentful Paint (LCP)
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log('LCP:', entry.startTime);
            // Send to analytics service
            sendAnalytics('web_vital', {
              metric: 'LCP',
              value: entry.startTime,
              url: window.location.pathname,
            });
          }
        }
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'first-input') {
            const fid = entry.processingStart - entry.startTime;
            console.log('FID:', fid);
            sendAnalytics('web_vital', {
              metric: 'FID',
              value: fid,
              url: window.location.pathname,
            });
          }
        }
      });

      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        console.log('CLS:', clsValue);
        sendAnalytics('web_vital', {
          metric: 'CLS',
          value: clsValue,
          url: window.location.pathname,
        });
      });

      clsObserver.observe({ entryTypes: ['layout-shift'] });

      return () => {
        observer.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
      };
    }
  }, []);
}

// Page view tracking
export function usePageTracking() {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      sendAnalytics('page_view', {
        url,
        timestamp: Date.now(),
        referrer: document.referrer,
      });
    };

    // Track initial page load
    handleRouteChange(window.location.pathname);

    // Track route changes (if using client-side routing)
    const handlePopState = () => {
      handleRouteChange(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [router]);
}

// User interaction tracking
export function useInteractionTracking() {
  useEffect(() => {
    const trackInteraction = (event: Event) => {
      const target = event.target as HTMLElement;
      const element = target.closest('[data-track]');
      
      if (element) {
        const trackData = element.getAttribute('data-track');
        const action = element.getAttribute('data-action') || 'click';
        
        try {
          const data = trackData ? JSON.parse(trackData) : {};
          sendAnalytics('interaction', {
            action,
            element: element.tagName.toLowerCase(),
            ...data,
            url: window.location.pathname,
          });
        } catch (error) {
          console.error('Error parsing track data:', error);
        }
      }
    };

    document.addEventListener('click', trackInteraction);
    document.addEventListener('submit', trackInteraction);

    return () => {
      document.removeEventListener('click', trackInteraction);
      document.removeEventListener('submit', trackInteraction);
    };
  }, []);
}

// Error tracking
export function useErrorTracking() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      sendAnalytics('error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        url: window.location.pathname,
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      sendAnalytics('unhandled_rejection', {
        reason: event.reason?.toString(),
        url: window.location.pathname,
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);
}

// Analytics helper functions
function sendAnalytics(eventType: string, data: Record<string, any>) {
  // In a real application, you would send this to your analytics service
  // For now, we'll just log it
  console.log(`Analytics: ${eventType}`, data);
  
  // Example: Send to Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventType, data);
  }
  
  // Example: Send to custom analytics endpoint
  if (process.env.NODE_ENV === 'production') {
    fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventType,
        data,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
      }),
    }).catch(error => {
      console.error('Failed to send analytics:', error);
    });
  }
}

// E-commerce tracking
export function trackPurchase(orderData: {
  transactionId: string;
  value: number;
  currency: string;
  items: Array<{
    itemId: string;
    itemName: string;
    category: string;
    quantity: number;
    price: number;
  }>;
}) {
  sendAnalytics('purchase', {
    transaction_id: orderData.transactionId,
    value: orderData.value,
    currency: orderData.currency,
    items: orderData.items,
  });
}

export function trackAddToCart(itemData: {
  itemId: string;
  itemName: string;
  category: string;
  price: number;
  quantity: number;
}) {
  sendAnalytics('add_to_cart', itemData);
}

export function trackViewItem(itemData: {
  itemId: string;
  itemName: string;
  category: string;
  price: number;
}) {
  sendAnalytics('view_item', itemData);
}

// Performance metrics
export function measurePerformance(name: string, fn: () => void) {
  const start = performance.now();
  fn();
  const end = performance.now();
  const duration = end - start;
  
  sendAnalytics('performance', {
    name,
    duration,
    url: window.location.pathname,
  });
  
  return duration;
}

// Custom hook that combines all tracking
export function useAnalytics() {
  usePerformanceMonitoring();
  usePageTracking();
  useInteractionTracking();
  useErrorTracking();
}

// Analytics Provider Component
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useAnalytics();
  return <>{children}</>;
}
