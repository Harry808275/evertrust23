'use client';

import Link from 'next/link';

export default function PrivacyPolicy() {
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
            <li className="text-black">Privacy</li>
          </ol>
        </nav>
        <h1 className="font-heading text-4xl font-light text-black mb-6 tracking-wide">Privacy Policy</h1>
        <p className="font-body text-gray-700 leading-relaxed mb-8">We handle your data with the same care we bring to our products—minimal, secure, and purposeful.</p>
        <div className="space-y-8">
          <section>
            <h2 className="font-heading text-2xl font-light text-black mb-3 tracking-wide">What We Collect</h2>
            <ul className="font-body text-gray-700 leading-relaxed space-y-2 list-disc pl-6">
              <li>Account details: name, email</li>
              <li>Order details: shipping address, items purchased</li>
              <li>Usage analytics to improve experience</li>
            </ul>
          </section>
          <section>
            <h2 className="font-heading text-2xl font-light text-black mb-3 tracking-wide">How We Use It</h2>
            <ul className="font-body text-gray-700 leading-relaxed space-y-2 list-disc pl-6">
              <li>Fulfil orders and provide support</li>
              <li>Improve site performance and content</li>
              <li>Optional updates with your consent</li>
            </ul>
          </section>
          <section>
            <h2 className="font-heading text-2xl font-light text-black mb-3 tracking-wide">Your Rights</h2>
            <ul className="font-body text-gray-700 leading-relaxed space-y-2 list-disc pl-6">
              <li>Access, correct, or delete your data</li>
              <li>Opt out of non-essential communications</li>
              <li>Data portability upon request</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}





