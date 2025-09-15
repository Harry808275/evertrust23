'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="container mx-auto px-6 py-20 max-w-5xl">
        {/* Breadcrumbs */}
        <nav className="font-body text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex gap-2">
            <li><Link href="/" className="hover:text-black">Home</Link></li>
            <li>/</li>
            <li className="text-black">About</li>
          </ol>
        </nav>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-12">
          <h1 className="font-heading text-5xl md:text-6xl font-light text-black tracking-wide mb-6">
            A House of Considered Luxury
          </h1>
          <p className="font-body text-lg md:text-xl text-gray-700 leading-relaxed">
            Style at Home is an ode to quiet confidence. We curate enduring pieces that elevate the everyday—crafted with intention, designed to last, and presented with restraint.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="md:col-span-7">
            <h2 className="font-heading text-3xl font-light text-black mb-4 tracking-wide">Our House</h2>
            <p className="font-body text-gray-700 leading-relaxed mb-4">
              We believe true luxury is felt in texture, weight, and silence. Every decision—materials, finishes, forms—serves a single purpose: to bring calm and clarity into your space.
            </p>
            <p className="font-body text-gray-700 leading-relaxed">
              Our edit is intentionally minimal. We select makers who share our values of precision and integrity, and who understand that refinement is the art of subtraction.
            </p>
          </motion.div>
          <motion.aside initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="md:col-span-5 bg-black text-white p-6 md:p-8">
            <p className="font-heading text-xl md:text-2xl font-light tracking-wide">
              “Luxury is the quiet assurance that nothing was left to chance.”
            </p>
          </motion.aside>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h3 className="font-heading text-2xl font-light text-black mb-3 tracking-wide">Commitment to Craft</h3>
            <p className="font-body text-gray-700 leading-relaxed">We partner with workshops that practice time-honored techniques—hand-finishing, saddle stitching, precision casting—so each piece bears the mark of human expertise.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
            <h3 className="font-heading text-2xl font-light text-black mb-3 tracking-wide">Material Standards</h3>
            <p className="font-body text-gray-700 leading-relaxed">We source full-grain leathers, fine-grained woods, and archival textiles. We prioritize traceability and select finishes that age with grace rather than degrade.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
            <h3 className="font-heading text-2xl font-light text-black mb-3 tracking-wide">Responsible Luxury</h3>
            <p className="font-body text-gray-700 leading-relaxed">Fewer, better things. We design for longevity and repair, encourage mindful purchasing, and work to minimize waste across our supply chain.</p>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="border-t border-gray-200 pt-10">
          <h2 className="font-heading text-3xl font-light text-black mb-4 tracking-wide">Our Promise</h2>
          <ul className="font-body text-gray-700 leading-relaxed space-y-3 list-disc pl-6">
            <li>Pieces selected for design integrity and enduring quality</li>
            <li>Clear provenance and materials you can trust</li>
            <li>Editorial guidance to help you build with intention</li>
            <li>Service that is discreet, precise, and personal</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}



