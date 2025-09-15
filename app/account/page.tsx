"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface OrderItem {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalPrice: number;
  status: string;
  createdAt?: string;
}

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) return;

    const loadOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/orders');
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Failed to load orders');
        }
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [session, status]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white pt-24 flex items-center justify-center">
        <p className="font-body text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-white pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="font-body text-gray-700 mb-4">Please sign in to view your account.</p>
          <Link href="/auth/signin" className="px-6 py-3 bg-black text-white rounded-lg">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="container mx-auto px-6 py-8">
        <h1 className="font-heading text-4xl md:text-5xl font-light text-black mb-8 tracking-wide">My Account</h1>

        {/* Quick nav */}
        <div className="flex gap-3 mb-6">
          <Link href="/account/addresses" className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">Addresses</Link>
          <Link href="/account/saved" className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">Saved</Link>
        </div>

        {/* Profile summary */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 mb-10">
          <p className="font-body text-gray-800"><span className="text-gray-500">Name:</span> {session.user?.name || '—'}</p>
          <p className="font-body text-gray-800"><span className="text-gray-500">Email:</span> {session.user?.email || '—'}</p>
        </div>

        {/* Orders */}
        <h2 className="font-heading text-2xl font-medium text-black mb-4">Recent Orders</h2>
        {loading ? (
          <p className="font-body text-gray-600">Loading orders...</p>
        ) : error ? (
          <p className="font-body text-red-600">{error}</p>
        ) : orders.length === 0 ? (
          <p className="font-body text-gray-600">You have no orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-body text-gray-700">Order <span className="font-medium">#{order._id.slice(-6)}</span></p>
                  <p className="font-body text-gray-700">Status: <span className="font-medium capitalize">{order.status}</span></p>
                </div>
                <ul className="divide-y divide-gray-200">
                  {order.items.map((it, idx) => (
                    <li key={idx} className="py-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                          {/* simple image; avoid next/image since API may return external URLs */}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={it.image || '/lv-trainer-front.avif'} alt={it.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-body text-gray-900">{it.name}</p>
                          <p className="font-body text-sm text-gray-600">Qty {it.quantity}</p>
                        </div>
                      </div>
                      <p className="font-body text-amber-600 font-medium">${it.price.toFixed(2)}</p>
                    </li>
                  ))}
                </ul>
                <div className="pt-3 border-t border-gray-200 text-right">
                  <p className="font-heading text-lg font-medium text-black">Total ${order.totalPrice.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
