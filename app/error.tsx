'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Optionally report error
    // console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="container mx-auto px-6 py-16 text-center">
        <h1 className="font-heading text-4xl md:text-5xl font-light text-black mb-4">Something went wrong</h1>
        <p className="font-body text-lg text-gray-600 mb-8">An unexpected error occurred. You can try again or go back home.</p>
        <div className="flex items-center justify-center gap-4">
          <button onClick={reset} className="bg-black text-white px-6 py-3 font-body font-medium tracking-wider hover:bg-gray-800 transition-colors rounded-lg">
            Try again
          </button>
          <Link href="/" className="border-2 border-black text-black px-6 py-3 font-body font-medium tracking-wider hover:bg-black hover:text-white transition-colors rounded-lg">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}






