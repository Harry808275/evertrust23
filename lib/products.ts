export interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
  description?: string;
  inStock: boolean;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Classic Monogram Bag",
    price: "$2,800",
    image: "/lv-trainer-front.avif",
    category: "Bags",
    description: "Timeless monogram canvas with leather trim",
    inStock: true
  },
  {
    id: 2,
    name: "Leather Wallet",
    price: "$650",
    image: "/lv-trainer-side.avif",
    category: "Accessories",
    description: "Premium leather with multiple card slots",
    inStock: true
  },
  {
    id: 3,
    name: "Silk Scarf",
    price: "$420",
    image: "/lv-frog-front.avif",
    category: "Accessories",
    description: "100% silk with hand-rolled edges",
    inStock: true
  },
  {
    id: 4,
    name: "Designer Sunglasses",
    price: "$380",
    image: "/lv-frog-side.avif",
    category: "Accessories",
    description: "Classic aviator style with gold accents",
    inStock: false
  },
  {
    id: 5,
    name: "Leather Belt",
    price: "$280",
    image: "/lv-trainer-back.avif",
    category: "Accessories",
    description: "Genuine leather with brass buckle",
    inStock: true
  },
  {
    id: 6,
    name: "Signature Perfume",
    price: "$180",
    image: "/lv-trainer-interior.avif",
    category: "Beauty",
    description: "Exclusive fragrance blend",
    inStock: true
  }
];

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

export const getProductById = (id: number): Product | undefined => {
  return products.find(product => product.id === id);
};
