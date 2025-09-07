'use client';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="container mx-auto px-6 py-20 max-w-4xl">
        {/* Breadcrumbs */}
        <nav className="font-body text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex gap-2">
            <li><a href="/" className="hover:text-black">Home</a></li>
            <li>/</li>
            <li className="text-black">Policies</li>
          </ol>
        </nav>
        <h1 className="font-heading text-4xl font-light text-black mb-6 tracking-wide">Terms of Service</h1>
        <div className="space-y-8 font-body text-gray-700 leading-relaxed">
          <section>
            <h2 className="font-heading text-2xl font-light text-black mb-3 tracking-wide">Use of Site</h2>
            <p>By accessing Style at Home, you agree to use the site for lawful purposes and respect intellectual property of all content and imagery.</p>
          </section>
          <section>
            <h2 className="font-heading text-2xl font-light text-black mb-3 tracking-wide">Orders</h2>
            <p>All orders are subject to availability and confirmation of payment. We reserve the right to refuse or cancel orders at our discretion.</p>
          </section>
          <section>
            <h2 className="font-heading text-2xl font-light text-black mb-3 tracking-wide">Liability</h2>
            <p>We are not liable for indirect or incidental damages arising from the use of our products or site. Your statutory rights remain unaffected.</p>
          </section>
          <section>
            <h2 className="font-heading text-2xl font-light text-black mb-3 tracking-wide">Changes</h2>
            <p>Policies and terms may be updated periodically. Continued use of the site constitutes acceptance of the updated terms.</p>
          </section>
        </div>
      </div>
    </div>
  );
}



