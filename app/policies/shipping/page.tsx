'use client';

export default function ShippingPolicy() {
  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="container mx-auto px-6 py-20 max-w-4xl">
        {/* Breadcrumbs */}
        <nav className="font-body text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex gap-2">
            <li><a href="/" className="hover:text-black">Home</a></li>
            <li>/</li>
            <li><a href="/policies/terms" className="hover:text-black">Policies</a></li>
            <li>/</li>
            <li className="text-black">Shipping</li>
          </ol>
        </nav>
        <h1 className="font-heading text-4xl font-light text-black mb-6 tracking-wide">Shipping Policy</h1>
        <p className="font-body text-gray-700 leading-relaxed mb-8">We ship worldwide with reliable carriers. Delivery windows are estimated below and confirmed at checkout.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div>
            <h2 className="font-heading text-2xl font-light text-black mb-3 tracking-wide">Domestic</h2>
            <ul className="font-body text-gray-700 leading-relaxed space-y-2 list-disc pl-6">
              <li>Standard: 3–5 business days</li>
              <li>Express: 1–2 business days</li>
              <li>Free shipping on orders over $500</li>
            </ul>
          </div>
          <div>
            <h2 className="font-heading text-2xl font-light text-black mb-3 tracking-wide">International</h2>
            <ul className="font-body text-gray-700 leading-relaxed space-y-2 list-disc pl-6">
              <li>Standard: 5–10 business days</li>
              <li>Express: 3–5 business days</li>
              <li>Duties and taxes calculated at checkout when supported</li>
            </ul>
          </div>
        </div>
        <div className="space-y-4 font-body text-gray-700 leading-relaxed">
          <p>Orders are processed within 1–3 business days. You will receive tracking details by email as soon as your order ships.</p>
          <p>Please ensure your shipping information is accurate. We are unable to reroute parcels once dispatched.</p>
        </div>
      </div>
    </div>
  );
}



