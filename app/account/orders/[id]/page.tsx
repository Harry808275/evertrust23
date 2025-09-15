'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface OrderItem { name: string; image: string; quantity: number; price: number; }
interface Order { _id: string; items: OrderItem[]; totalPrice: number; status: string; createdAt?: string; externalOrderId?: string; trackingUrl?: string; }

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!orderId) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/orders/${orderId}`);
        if (!res.ok) throw new Error('Failed to load order');
        const data = await res.json();
        setOrder(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [orderId]);

  const printInvoice = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading text-4xl md:text-5xl font-light text-black tracking-wide">Order Details</h1>
          <Link href="/account" className="text-gray-600 hover:text-black font-body">Back to Account</Link>
        </div>

        {loading ? (
          <p className="font-body text-gray-600">Loading...</p>
        ) : error ? (
          <p className="font-body text-red-600">{error}</p>
        ) : !order ? (
          <p className="font-body text-gray-600">Order not found.</p>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="font-body text-gray-800">Order <span className="font-medium">#{order._id?.slice(-6)}</span></p>
              <p className="font-body text-gray-800">Status: <span className="font-medium capitalize">{order.status}</span></p>
            </div>
            {(order.trackingUrl || order.externalOrderId) && (
              <p className="font-body text-gray-700 mb-4">
                {order.trackingUrl ? (
                  <a href={order.trackingUrl} target="_blank" rel="noreferrer" className="text-amber-600 underline">Track shipment</a>
                ) : null}
                {order.externalOrderId && (
                  <span className="ml-2">ID: <span className="font-medium">{order.externalOrderId}</span></span>
                )}
              </p>
            )}
            <ul className="divide-y divide-gray-200 mb-4">
              {order.items.map((it, idx) => (
                <li key={idx} className="py-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
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
            <div className="flex items-center justify-between">
              <p className="font-heading text-lg text-black">Total</p>
              <p className="font-heading text-lg text-black">${order.totalPrice.toFixed(2)}</p>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={printInvoice} className="px-6 py-3 bg-black text-white rounded-lg">Print Invoice</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface OrderItem { name: string; image: string; quantity: number; price: number; }
interface Order { _id: string; items: OrderItem[]; totalPrice: number; status: string; createdAt?: string; externalOrderId?: string; trackingUrl?: string; }

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!orderId) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/orders/${orderId}`);
        if (!res.ok) throw new Error('Failed to load order');
        const data = await res.json();
        setOrder(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [orderId]);

  const printInvoice = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading text-4xl md:text-5xl font-light text-black tracking-wide">Order Details</h1>
          <Link href="/account" className="text-gray-600 hover:text-black font-body">Back to Account</Link>
        </div>

        {loading ? (
          <p className="font-body text-gray-600">Loading...</p>
        ) : error ? (
          <p className="font-body text-red-600">{error}</p>
        ) : !order ? (
          <p className="font-body text-gray-600">Order not found.</p>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="font-body text-gray-800">Order <span className="font-medium">#{order._id?.slice(-6)}</span></p>
              <p className="font-body text-gray-800">Status: <span className="font-medium capitalize">{order.status}</span></p>
            </div>
            {(order.trackingUrl || order.externalOrderId) && (
              <p className="font-body text-gray-700 mb-4">
                {order.trackingUrl ? (
                  <a href={order.trackingUrl} target="_blank" rel="noreferrer" className="text-amber-600 underline">Track shipment</a>
                ) : null}
                {order.externalOrderId && (
                  <span className="ml-2">ID: <span className="font-medium">{order.externalOrderId}</span></span>
                )}
              </p>
            )}
            <ul className="divide-y divide-gray-200 mb-4">
              {order.items.map((it, idx) => (
                <li key={idx} className="py-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
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
            <div className="flex items-center justify-between">
              <p className="font-heading text-lg text-black">Total</p>
              <p className="font-heading text-lg text-black">${order.totalPrice.toFixed(2)}</p>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={printInvoice} className="px-6 py-3 bg-black text-white rounded-lg">Print Invoice</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}




