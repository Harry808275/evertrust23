'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSavedStore } from '@/lib/savedStore';

export default function SavedPage() {
  const { data: session } = useSession();
  const { items, removeSaved, clearSaved, setItemsFromServer } = useSavedStore() as any;

  // Sync with server when signed in
  useEffect(() => {
    const sync = async () => {
      if (!session) return;
      try {
        const res = await fetch('/api/account/saved');
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data?.products)) {
          setItemsFromServer(data.products);
        }
      } catch {}
    };
    sync();
  }, [session, setItemsFromServer]);

  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading text-4xl md:text-5xl font-light text-black tracking-wide">Saved Items</h1>
          <Link href="/account" className="text-gray-600 hover:text-black font-body">Back to Account</Link>
        </div>

        {items.length === 0 ? (
          <p className="font-body text-gray-600">No saved items yet.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
              {items.map((p) => (
                <div key={p.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image || '/lv-trainer-front.avif'} alt={p.name} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <p className="font-body text-gray-900 truncate">{p.name}</p>
                    <p className="font-body text-amber-600 font-medium">{p.price}</p>
                    <div className="mt-3 flex gap-2">
                      <Link href={`/product/${p.id}`} className="px-4 py-2 bg-black text-white rounded-lg">View</Link>
                      <button onClick={() => removeSaved(p.id)} className="px-4 py-2 bg-gray-200 text-black rounded-lg">Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={clearSaved} className="px-6 py-3 bg-red-600 text-white rounded-lg">Clear All</button>
          </>
        )}
      </div>
    </div>
  );
}



import Link from 'next/link';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSavedStore } from '@/lib/savedStore';

export default function SavedPage() {
  const { data: session } = useSession();
  const { items, removeSaved, clearSaved, setItemsFromServer } = useSavedStore() as any;

  // Sync with server when signed in
  useEffect(() => {
    const sync = async () => {
      if (!session) return;
      try {
        const res = await fetch('/api/account/saved');
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data?.products)) {
          setItemsFromServer(data.products);
        }
      } catch {}
    };
    sync();
  }, [session, setItemsFromServer]);

  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading text-4xl md:text-5xl font-light text-black tracking-wide">Saved Items</h1>
          <Link href="/account" className="text-gray-600 hover:text-black font-body">Back to Account</Link>
        </div>

        {items.length === 0 ? (
          <p className="font-body text-gray-600">No saved items yet.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
              {items.map((p) => (
                <div key={p.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image || '/lv-trainer-front.avif'} alt={p.name} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <p className="font-body text-gray-900 truncate">{p.name}</p>
                    <p className="font-body text-amber-600 font-medium">{p.price}</p>
                    <div className="mt-3 flex gap-2">
                      <Link href={`/product/${p.id}`} className="px-4 py-2 bg-black text-white rounded-lg">View</Link>
                      <button onClick={() => removeSaved(p.id)} className="px-4 py-2 bg-gray-200 text-black rounded-lg">Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={clearSaved} className="px-6 py-3 bg-red-600 text-white rounded-lg">Clear All</button>
          </>
        )}
      </div>
    </div>
  );
}




