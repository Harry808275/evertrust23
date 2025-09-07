'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="container mx-auto px-6 py-16 text-center">
        <h1 className="font-heading text-6xl font-light text-black mb-4">404</h1>
        <p className="font-body text-lg text-gray-600 mb-8">The page you’re looking for doesn’t exist.</p>
        <Link href="/" className="inline-block bg-black text-white px-6 py-3 font-body font-medium tracking-wider hover:bg-gray-800 transition-colors rounded-lg">
          Go Home
        </Link>
      </div>
    </div>
  );
}






