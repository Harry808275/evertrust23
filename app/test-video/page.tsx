import ShoppableVideo, { VideoHotspot } from "@/components/ShoppableVideo";

export default function TestVideoPage() {
  const hotspots: VideoHotspot[] = [
    {
      id: "bag-1",
      timeStart: 1,
      timeEnd: 12,
      xPercent: 30,
      yPercent: 60,
      product: {
        id: "675f00000000000000000001",
        name: "Classic Monogram Bag",
        price: 2800,
        image: "/lv-trainer-front.avif",
        category: "Bags",
        inStock: true,
      },
    },
    {
      id: "sunglasses-1",
      timeStart: 8,
      timeEnd: 22,
      xPercent: 65,
      yPercent: 40,
      product: {
        id: "675f00000000000000000002",
        name: "Designer Sunglasses",
        price: 380,
        image: "/lv-frog-side.avif",
        category: "Accessories",
        inStock: true,
      },
    },
  ];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="max-w-5xl mx-auto p-8 w-full">
        <h1 className="text-white text-3xl mb-8 text-center">Shoppable Video Demo</h1>

        <div className="space-y-8">
          <div>
            <h2 className="text-white text-xl mb-4">Interactive Hotspots</h2>
            <ShoppableVideo
              src="/lv-hero.mp4"
              hotspots={hotspots}
              className="rounded-xl overflow-hidden"
            />
          </div>

          <div>
            <h2 className="text-white text-xl mb-4">Video File Info</h2>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-white">File: /lv-hero.mp4</p>
              <p className="text-white">Format: MP4</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
