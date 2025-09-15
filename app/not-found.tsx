'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* 404 Illustration */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <div className="relative">
              <div className="text-9xl font-heading font-light text-gray-200 mb-4">404</div>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-32 h-32 border-2 border-amber-400 border-dashed rounded-full"
                />
              </div>
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <h1 className="font-heading text-4xl md:text-6xl font-light text-black mb-6 tracking-wide">
              Page Not Found
            </h1>
            <p className="font-body text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              The page you're looking for seems to have wandered off. Don't worry, 
              even the best collections have missing pieces.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
          >
            <Link
              href="/"
              className="flex items-center gap-3 bg-black text-white px-8 py-4 font-body font-medium tracking-wider hover:bg-gray-800 transition-colors duration-300 uppercase rounded-lg shadow-professional hover-lift"
            >
              <Home className="w-5 h-5" />
              Go Home
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-3 border-2 border-black text-black px-8 py-4 font-body font-medium tracking-wider hover:bg-black hover:text-white transition-colors duration-300 uppercase rounded-lg focus-ring"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
            
            <Link
              href="/shop"
              className="flex items-center gap-3 border-2 border-amber-400 text-amber-600 px-8 py-4 font-body font-medium tracking-wider hover:bg-amber-400 hover:text-white transition-colors duration-300 uppercase rounded-lg focus-ring"
            >
              <Search className="w-5 h-5" />
              Browse Products
            </Link>
          </motion.div>

          {/* Helpful Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-gray-50 rounded-xl p-8"
          >
            <h3 className="font-heading text-2xl font-medium text-black mb-6">
              Popular Pages
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                href="/shop"
                className="group p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <h4 className="font-heading text-lg font-medium text-black mb-2 group-hover:text-amber-600 transition-colors">
                  Shop All Products
                </h4>
                <p className="font-body text-sm text-gray-600">
                  Discover our complete collection of luxury items
                </p>
              </Link>
              
              <Link
                href="/account"
                className="group p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <h4 className="font-heading text-lg font-medium text-black mb-2 group-hover:text-amber-600 transition-colors">
                  Your Account
                </h4>
                <p className="font-body text-sm text-gray-600">
                  Manage your orders and account settings
                </p>
              </Link>
              
              <Link
                href="/contact"
                className="group p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <h4 className="font-heading text-lg font-medium text-black mb-2 group-hover:text-amber-600 transition-colors">
                  Contact Support
                </h4>
                <p className="font-body text-sm text-gray-600">
                  Get help from our customer service team
                </p>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}






