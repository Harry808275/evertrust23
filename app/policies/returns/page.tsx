'use client';

import Link from 'next/link';

export default function ReturnsPolicy() {
  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="container mx-auto px-6 py-20 max-w-4xl">
        {/* Breadcrumbs */}
        <nav className="font-body text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex gap-2">
            <li><Link href="/" className="hover:text-black">Home</Link></li>
            <li>/</li>
            <li><Link href="/policies/terms" className="hover:text-black">Policies</Link></li>
            <li>/</li>
            <li className="text-black">Returns</li>
          </ol>
        </nav>
        <h1 className="font-heading text-4xl font-light text-black mb-6 tracking-wide">Returns & Exchanges</h1>
        <p className="font-body text-gray-700 leading-relaxed mb-8">We want you to love your pieces. If something isn’t right, our return process is straightforward.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div>
            <h2 className="font-heading text-2xl font-light text-black mb-3 tracking-wide">Eligibility</h2>
            <ul className="font-body text-gray-700 leading-relaxed space-y-2 list-disc pl-6">
              <li>Within 30 days of delivery</li>
              <li>In original condition, unused, with tags and packaging</li>
              <li>Proof of purchase required</li>
            </ul>
          </div>
          <div>
            <h2 className="font-heading text-2xl font-light text-black mb-3 tracking-wide">Refunds</h2>
            <ul className="font-body text-gray-700 leading-relaxed space-y-2 list-disc pl-6">
              <li>Refunded to original payment method</li>
              <li>Allow 5–10 business days after receipt</li>
              <li>Shipping fees are non-refundable</li>
            </ul>
          </div>
        </div>
        <div className="space-y-4 font-body text-gray-700 leading-relaxed">
          <p>To start a return or exchange, contact support with your order number. We’ll share a prepaid label when applicable.</p>
          <p>For defective or damaged items, please attach photos so we can resolve promptly.</p>
        </div>
      </div>
    </div>
  );
}





