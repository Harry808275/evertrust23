"use client";

import { useRef, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useCartStore } from "@/lib/cartStore";

export interface VideoHotspot {
  id: string;
  timeStart: number; // seconds
  timeEnd: number;   // seconds
  xPercent: number;  // 0-100
  yPercent: number;  // 0-100
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    inStock: boolean;
  };
}

interface ShoppableVideoProps {
  src: string;
  poster?: string;
  hotspots: VideoHotspot[];
  className?: string;
}

export default function ShoppableVideo({ src, poster, hotspots, className }: ShoppableVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const { addItem } = useCartStore();

  const visibleHotspots = useMemo(() => {
    return hotspots.filter(h => currentTime >= h.timeStart && currentTime <= h.timeEnd);
  }, [hotspots, currentTime]);

  const handleAddToCart = (hs: VideoHotspot) => {
    const priceLabel = `$${hs.product.price.toLocaleString()}`;
    addItem({
      id: hs.product.id,
      name: hs.product.name,
      price: priceLabel,
      image: hs.product.image,
      category: hs.product.category,
      inStock: hs.product.inStock,
    });
  };

  return (
    <div className={`relative ${className ?? ""}`}>
      <video
        ref={videoRef}
        className="w-full h-auto rounded-lg"
        src={src}
        poster={poster}
        controls
        onTimeUpdate={(e) => setCurrentTime((e.target as HTMLVideoElement).currentTime)}
      />

      {/* Hotspots */}
      {visibleHotspots.map((hs) => (
        <button
          key={hs.id}
          type="button"
          onClick={() => setActiveHotspotId(activeHotspotId === hs.id ? null : hs.id)}
          style={{ left: `${hs.xPercent}%`, top: `${hs.yPercent}%` }}
          className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
          aria-label={`Show ${hs.product.name}`}
        >
          <motion.span
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-5 h-5 rounded-full bg-amber-500 shadow-lg ring-2 ring-white/70 inline-block"
          />
        </button>
      ))}

      {/* Popovers */}
      {visibleHotspots.map((hs) => (
        <motion.div
          key={`${hs.id}-popover`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: activeHotspotId === hs.id ? 1 : 0, y: activeHotspotId === hs.id ? 0 : 8 }}
          transition={{ duration: 0.2 }}
          style={{ left: `${hs.xPercent}%`, top: `${hs.yPercent}%` }}
          className={`absolute z-20 -translate-x-1/2 mt-4 ${activeHotspotId === hs.id ? 'pointer-events-auto' : 'pointer-events-none'}`}
        >
          <div className="w-64 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
            <div className="flex gap-3 p-3">
              <img
                src={hs.product.image}
                alt={hs.product.name}
                className="w-16 h-16 object-cover rounded-md border border-gray-100"
              />
              <div className="flex-1">
                <p className="font-heading text-sm text-black">{hs.product.name}</p>
                <p className="font-body text-amber-600 text-sm">${hs.product.price.toLocaleString()}</p>
                <p className="font-body text-xs text-gray-500">{hs.product.category}</p>
              </div>
            </div>
            <div className="px-3 pb-3 flex gap-2">
              <button
                onClick={() => handleAddToCart(hs)}
                className="flex-1 py-2 bg-black text-white rounded-md font-body text-sm hover:bg-gray-800"
              >
                Add to cart
              </button>
              <a
                href={`/product/${hs.product.id}`}
                className="flex-1 py-2 bg-amber-500 text-black rounded-md font-body text-sm text-center hover:bg-amber-600"
              >
                View
              </a>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}










