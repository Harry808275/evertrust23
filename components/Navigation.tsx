'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import { ShoppingCart, User, Menu, X, LogOut, Shield, ChevronDown } from 'lucide-react';
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
  const [isAtTop, setIsAtTop] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Toggle transparent navbar at top, solid after scrolling
  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY <= 10);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest?.('#user-menu-trigger') && !target.closest?.('#user-menu-dropdown')) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
      isAtTop ? 'bg-transparent border-transparent' : 'bg-white/90 border-b border-gray-200 backdrop-blur'
    }`}>
      {/* Navigation Loading Indicator */}
      {isNavigating && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500">
          <div className="h-full bg-amber-600 animate-pulse"></div>
        </div>
      )}
      
      <div className="container mx-auto px-6">
        <div className={`grid grid-cols-3 items-center py-6 transition-colors duration-300`}>
          {/* Left: Content links */}
          <div className="flex items-center gap-6">
            <Link 
              href="/shop" 
              onClick={() => handleNavigation('/shop')}
              className={`font-body brand-text hover:text-gray-700 transition-colors duration-300 uppercase tracking-wider text-sm`}
            >
              Shop
            </Link>
            <Link 
              href="/about" 
              onClick={() => handleNavigation('/about')}
              className={`font-body brand-text hover:text-gray-700 transition-colors duration-300 uppercase tracking-wider text-sm`}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              onClick={() => handleNavigation('/contact')}
              className={`font-body brand-text hover:text-gray-700 transition-colors duration-300 uppercase tracking-wider text-sm`}
            >
              Contact
            </Link>
          </div>

          {/* Center: Brand */}
          <div className="flex items-center justify-center">
            <Link 
              href="/" 
              onClick={() => handleNavigation('/')}
              className={`font-heading text-2xl font-light brand-text tracking-wider transition-colors`}
            >
              STYLE AT HOME
            </Link>
          </div>

          {/* Right: Account/Cart */}
          <div className="flex items-center justify-end gap-8">
            <Link 
              href="/cart" 
              onClick={() => handleNavigation('/cart')}
              className={`font-body brand-text hover:text-gray-700 transition-colors duration-300 uppercase tracking-wider text-sm relative`}
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
              <div className="relative">
                <button
                  id="user-menu-trigger"
                  onClick={() => setIsUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-haspopup="menu"
                  aria-expanded={isUserMenuOpen}
                >
                  <User size={18} className="text-gray-700" />
                  <span className="font-body text-sm text-gray-700 hidden md:inline">
                    {session.user.name || 'Account'}
                  </span>
                  <ChevronDown size={16} className="text-gray-500" />
                </button>

                {isUserMenuOpen && (
                  <div
                    id="user-menu-dropdown"
                    className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-professional border border-gray-100 py-2 z-50"
                    role="menu"
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-heading text-sm text-black">{session.user.name}</p>
                      <p className="font-body text-xs text-gray-500 truncate">{session.user.email}</p>
                    </div>

                {session.user.role === 'admin' && (
                  <Link 
                    href="/admin" 
                        onClick={() => { setIsUserMenuOpen(false); handleNavigation('/admin'); }}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        role="menuitem"
                  >
                    <Shield size={16} />
                        Admin Dashboard
                  </Link>
                )}

                    <Link
                      href="/account"
                      onClick={() => { setIsUserMenuOpen(false); handleNavigation('/account'); }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      role="menuitem"
                    >
                      Account
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => { setIsUserMenuOpen(false); handleNavigation('/orders'); }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      role="menuitem"
                    >
                      Orders
                    </Link>
                <button
                  onClick={handleSignOut}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      role="menuitem"
                >
                  <LogOut size={16} />
                      Sign Out
                </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                href="/auth/signin" 
                onClick={() => handleNavigation('/auth/signin')}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Sign In"
              >
                <User size={18} className="text-gray-700" />
                <span className="font-body text-sm text-gray-700 hidden md:inline">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
