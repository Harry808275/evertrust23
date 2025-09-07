'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import { ShoppingCart, User, Menu, X, LogOut, Shield } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import { useRecentStore } from '@/lib/recentStore';
import { useSavedStore } from '@/lib/savedStore';

export default function Navigation() {
  const { data: session, status } = useSession();
  const { items, getTotalItems } = useCartStore();
  const { recentIds } = useRecentStore();
  const { items: savedItems } = useSavedStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const handleNavigation = (href: string) => {
    setIsNavigating(true);
    // Reset navigation state after a short delay
    setTimeout(() => setIsNavigating(false), 100);
  };

  const handleSignOut = async () => {
    setIsNavigating(true);
    await signOut({ callbackUrl: '/' });
  };

  // Only show cart count after component mounts to prevent hydration mismatch
  const shouldShowCartCount = items.length > 0;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      {/* Navigation Loading Indicator */}
      {isNavigating && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500">
          <div className="h-full bg-amber-600 animate-pulse"></div>
        </div>
      )}
      
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-3 items-center py-6">
          {/* Left: Content links */}
          <div className="flex items-center gap-6">
            <Link 
              href="/shop" 
              onClick={() => handleNavigation('/shop')}
              className="font-body brand-text hover:text-gray-700 transition-colors duration-300 uppercase tracking-wider text-sm"
            >
              Shop
            </Link>
            <Link 
              href="/about" 
              onClick={() => handleNavigation('/about')}
              className="font-body brand-text hover:text-gray-700 transition-colors duration-300 uppercase tracking-wider text-sm"
            >
              About
            </Link>
            <Link 
              href="/contact" 
              onClick={() => handleNavigation('/contact')}
              className="font-body brand-text hover:text-gray-700 transition-colors duration-300 uppercase tracking-wider text-sm"
            >
              Contact
            </Link>
          </div>

          {/* Center: Brand */}
          <div className="flex items-center justify-center">
            <Link 
              href="/" 
              onClick={() => handleNavigation('/')}
              className="font-heading text-2xl font-light brand-text tracking-wider"
            >
              STYLE AT HOME
            </Link>
          </div>

          {/* Right: Account/Cart */}
          <div className="flex items-center justify-end gap-8">
            <Link 
              href="/cart" 
              onClick={() => handleNavigation('/cart')}
              className="font-body brand-text hover:text-gray-700 transition-colors duration-300 uppercase tracking-wider text-sm relative"
            >
              Cart
              {status === 'loading' ? (
                <span className="absolute -top-2 -right-2 bg-gray-300 text-gray-500 text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  ...
                </span>
              ) : shouldShowCartCount ? (
                <span className="absolute -top-2 -right-2 brand-badge text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {items.length}
                </span>
              ) : null}
            </Link>
            
            {status === 'loading' ? (
              <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                {session.user.role === 'admin' && (
                  <Link 
                    href="/admin" 
                    onClick={() => handleNavigation('/admin')}
                    className="font-body brand-accent hover:brand-accent-hover transition-colors duration-300 uppercase tracking-wider text-sm flex items-center space-x-1"
                  >
                    <Shield size={16} />
                    <span>Admin</span>
                  </Link>
                )}
                <div className="flex items-center space-x-2">
                  <User size={16} className="text-gray-600" />
                  <span className="font-body text-sm text-gray-700">{session.user.name}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="font-body text-gray-600 hover:text-black transition-colors duration-300 uppercase tracking-wider text-sm flex items-center space-x-1"
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link 
                href="/auth/signin" 
                onClick={() => handleNavigation('/auth/signin')}
                className="font-body brand-text hover:text-gray-700 transition-colors duration-300 uppercase tracking-wider text-sm"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
