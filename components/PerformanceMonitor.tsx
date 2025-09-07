'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Clock, 
  Zap, 
  Users, 
  Eye, 
  MousePointer,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

interface PerformanceMetrics {
  pageLoadTime: number;
  timeToInteractive: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  totalBlockingTime: number;
  userEngagement: {
    sessionDuration: number;
    pageViews: number;
    bounceRate: number;
    conversionRate: number;
  };
  errors: {
    count: number;
    types: string[];
    critical: boolean;
  };
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      startPerformanceMonitoring();
    }
  }, []);

  const startPerformanceMonitoring = () => {
    setIsMonitoring(true);
    
    // Monitor page load performance
    if ('performance' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            updateMetrics({
              pageLoadTime: navEntry.loadEventEnd - navEntry.loadEventStart,
              timeToInteractive: navEntry.domInteractive - navEntry.fetchStart,
              firstContentfulPaint: 0, // Will be updated by paint timing
              largestContentfulPaint: 0, // Will be updated by LCP
              cumulativeLayoutShift: 0, // Will be updated by CLS
              totalBlockingTime: 0, // Will be updated by TBT
              userEngagement: {
                sessionDuration: 0,
                pageViews: 0,
                bounceRate: 0,
                conversionRate: 0
              },
              errors: {
                count: 0,
                types: [],
                critical: false
              }
            });
          }
        });
      });

      observer.observe({ entryTypes: ['navigation'] });

      // Monitor paint timing
      if ('PerformanceObserver' in window) {
        const paintObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.name === 'first-contentful-paint') {
              setMetrics(prev => prev ? {
                ...prev,
                firstContentfulPaint: entry.startTime
              } : null);
            }
          });
        });

        paintObserver.observe({ entryTypes: ['paint'] });
      }

      // Monitor errors
      window.addEventListener('error', (event) => {
        setMetrics(prev => prev ? {
          ...prev,
          errors: {
            count: prev.errors.count + 1,
            types: [...new Set([...prev.errors.types, event.error?.name || 'Unknown'])],
            critical: event.error?.name === 'TypeError' || event.error?.name === 'ReferenceError'
          }
        } : null);
      });

      // Monitor user engagement
      let sessionStart = Date.now();
      let pageViews = 1;
      let hasInteracted = false;

      const trackEngagement = () => {
        if (!hasInteracted) {
          hasInteracted = true;
          const sessionDuration = Date.now() - sessionStart;
          
          setMetrics(prev => prev ? {
            ...prev,
            userEngagement: {
              sessionDuration,
              pageViews,
              bounceRate: hasInteracted ? 0 : 100,
              conversionRate: 0 // Will be updated by conversion tracking
            }
          } : null);
        }
      };

      // Track user interactions
      ['click', 'scroll', 'keypress', 'mousemove'].forEach(eventType => {
        document.addEventListener(eventType, trackEngagement, { once: true });
      });

      // Track page visibility changes
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          pageViews++;
        }
      });
    }
  };

  const updateMetrics = (newMetrics: Partial<PerformanceMetrics>) => {
    setMetrics(prev => prev ? { ...prev, ...newMetrics } : null);
  };

  const getPerformanceScore = () => {
    if (!metrics) return 0;
    
    let score = 100;
    
    // Deduct points for slow performance
    if (metrics.pageLoadTime > 3000) score -= 20;
    if (metrics.timeToInteractive > 5000) score -= 20;
    if (metrics.firstContentfulPaint > 2000) score -= 15;
    if (metrics.largestContentfulPaint > 4000) score -= 15;
    if (metrics.cumulativeLayoutShift > 0.1) score -= 10;
    if (metrics.totalBlockingTime > 300) score -= 10;
    
    // Deduct points for errors
    if (metrics.errors.count > 0) score -= 10;
    if (metrics.errors.critical) score -= 20;
    
    return Math.max(0, score);
  };

  const getPerformanceGrade = (score: number) => {
    if (score >= 90) return { grade: 'A', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 80) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (score >= 70) return { grade: 'C', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (score >= 60) return { grade: 'D', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { grade: 'F', color: 'text-red-600', bg: 'bg-red-100' };
  };

  if (!metrics) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <Activity className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Performance Monitor</h3>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing performance monitoring...</p>
        </div>
      </div>
    );
  }

  const score = getPerformanceScore();
  const grade = getPerformanceGrade(score);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Activity className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Performance Monitor</h3>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${grade.bg} ${grade.color}`}>
          Grade: {grade.grade} ({score}/100)
        </div>
      </div>

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Page Load</span>
          </div>
          <p className={`text-lg font-bold ${
            metrics.pageLoadTime > 3000 ? 'text-red-600' : 
            metrics.pageLoadTime > 2000 ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {metrics.pageLoadTime.toFixed(0)}ms
          </p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Time to Interactive</span>
          </div>
          <p className={`text-lg font-bold ${
            metrics.timeToInteractive > 5000 ? 'text-red-600' : 
            metrics.timeToInteractive > 3000 ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {metrics.timeToInteractive.toFixed(0)}ms
          </p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Eye className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">First Paint</span>
          </div>
          <p className={`text-lg font-bold ${
            metrics.firstContentfulPaint > 2000 ? 'text-red-600' : 
            metrics.firstContentfulPaint > 1500 ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {metrics.firstContentfulPaint.toFixed(0)}ms
          </p>
        </div>
      </div>

      {/* User Engagement */}
      <div className="mb-6">
        <h4 className="text-md font-semibold text-gray-900 mb-3">User Engagement</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {Math.round(metrics.userEngagement.sessionDuration / 1000)}s
            </p>
            <p className="text-xs text-gray-600">Session Duration</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {metrics.userEngagement.pageViews}
            </p>
            <p className="text-xs text-gray-600">Page Views</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {metrics.userEngagement.bounceRate.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-600">Bounce Rate</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-600">
              {metrics.userEngagement.conversionRate.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-600">Conversion</p>
          </div>
        </div>
      </div>

      {/* Error Monitoring */}
      {metrics.errors.count > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-semibold text-gray-900 mb-3">Error Monitoring</h4>
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-800">
                {metrics.errors.count} Error{metrics.errors.count !== 1 ? 's' : ''} Detected
              </span>
            </div>
            <div className="text-sm text-red-700">
              <p>Types: {metrics.errors.types.join(', ')}</p>
              {metrics.errors.critical && (
                <p className="font-medium mt-1">⚠️ Critical errors detected</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Optimization Recommendations */}
      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-3">Optimization Tips</h4>
        <div className="space-y-2">
          {metrics.pageLoadTime > 3000 && (
            <p className="text-sm text-amber-700">🐌 Page load time is slow. Consider optimizing images and reducing bundle size.</p>
          )}
          {metrics.timeToInteractive > 5000 && (
            <p className="text-sm text-amber-700">⏱️ Time to interactive is high. Optimize JavaScript execution and reduce blocking resources.</p>
          )}
          {metrics.errors.count > 0 && (
            <p className="text-sm text-red-700">🚨 Errors detected. Review console logs and fix JavaScript issues.</p>
          )}
          {score >= 90 && (
            <p className="text-sm text-green-700">✅ Excellent performance! Keep up the good work.</p>
          )}
        </div>
      </div>
    </div>
  );
}

