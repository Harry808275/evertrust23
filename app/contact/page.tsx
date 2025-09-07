'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function ContactPage() {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const formRef = useRef<HTMLDivElement | null>(null);

  const openEmailForm = () => {
    setShowEmailForm(true);
    // Smoothly scroll to the form when it becomes visible
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="container mx-auto px-6 pt-10 pb-8">
        {/* Breadcrumbs */}
        <nav className="font-body text-sm text-gray-500 mb-3" aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex gap-2">
            <li><a href="/" className="hover:text-black">Home</a></li>
            <li>/</li>
            <li className="text-black">Contact</li>
          </ol>
        </nav>
        {/* Intro */}
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="font-heading text-4xl md:text-5xl font-light text-black mb-3 tracking-wide">
          Contact Us
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.1 }} className="font-body text-base md:text-lg text-gray-700 leading-relaxed mb-4 max-w-3xl">
          We respond with care and precision. Whether you need styling advice, order support, or private client services, our team is here.
        </motion.p>
        {/* LV-style contact method cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-200 p-6 shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-shadow">
            <h3 className="font-heading text-xl text-black mb-3">CALL US</h3>
            <p className="font-body text-gray-700 mb-6">Our Client Advisors are here to help, providing information on your inquiries and advice on your purchases.</p>
            <ul className="font-body text-sm text-gray-600 mb-6 list-disc pl-5 space-y-1">
              <li>Monday–Friday: 9am – 8pm CT</li>
              <li>Saturday and Sunday: 10am – 7pm CT</li>
            </ul>
            <a href="tel:+1866" className="block w-full text-center border border-gray-300 px-6 py-3 hover:border-black transition-colors">+1.866.STYLE</a>
          </div>
          <div className="bg-white border border-gray-200 p-6 shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-shadow">
            <h3 className="font-heading text-xl text-black mb-3">CHAT WITH US</h3>
            <p className="font-body text-gray-700 mb-6">Live Chat Client Advisors are available to assist.</p>
            <ul className="font-body text-sm text-gray-600 mb-6 list-disc pl-5 space-y-1">
              <li>Monday–Friday: 9am – 8pm CT</li>
              <li>Saturday and Sunday: 10am – 7pm CT</li>
            </ul>
            <button type="button" className="w-full border border-gray-300 px-6 py-3 hover:border-black transition-colors disabled:opacity-60" disabled>
              Chat will be active soon
            </button>
          </div>
          <div className="bg-white border border-gray-200 p-6 shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-shadow">
            <h3 className="font-heading text-xl text-black mb-3">EMAIL US</h3>
            <p className="font-body text-gray-700 mb-6">Please allow us up to 24 hours to respond to your inquiry.</p>
            <button type="button" onClick={openEmailForm} className="w-full border border-gray-300 px-6 py-3 hover:border-black transition-colors">
              Send an Email
            </button>
          </div>
        </div>

        {/* Email form (revealed when user clicks Send an Email) */}
        {showEmailForm && (
        <div ref={formRef} className="bg-white border border-gray-200 p-5 md:p-8 shadow-[0_12px_36px_rgba(0,0,0,0.08)]">
          <form className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1">
              <label className="block font-body text-sm text-gray-600 mb-2">First Name</label>
              <input type="text" className="w-full px-3 py-2.5 bg-white border border-gray-200 focus:border-amber-500 outline-none" />
            </div>
            <div className="col-span-1">
              <label className="block font-body text-sm text-gray-600 mb-2">Last Name</label>
              <input type="text" className="w-full px-3 py-2.5 bg-white border border-gray-200 focus:border-amber-500 outline-none" />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block font-body text-sm text-gray-600 mb-2">Email</label>
              <input type="email" className="w-full px-3 py-2.5 bg-white border border-gray-200 focus:border-amber-500 outline-none" />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block font-body text-sm text-gray-600 mb-2">Subject</label>
              <input type="text" className="w-full px-3 py-2.5 bg-white border border-gray-200 focus:border-amber-500 outline-none" />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block font-body text-sm text-gray-600 mb-2">Message</label>
              <textarea rows={6} className="w-full px-3 py-2.5 bg-white border border-gray-200 focus:border-amber-500 outline-none" />
            </div>
            <div className="col-span-1 md:col-span-2 flex items-center justify-between">
              <label className="inline-flex items-center gap-3 text-gray-600 font-body text-sm">
                <input type="checkbox" className="w-4 h-4 border-gray-300" />
                Request a private consultation
              </label>
              <button type="submit" className="bg-black text-white px-6 py-2.5 font-body font-medium tracking-wider hover:bg-gray-800 transition-colors rounded-none">
                Send Message
              </button>
            </div>
          </form>
        </div>
        )}
      </div>
    </div>
  );
}


