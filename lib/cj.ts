export interface CJImage {
  imgUrl: string;
}

export interface CJVariant {
  sku?: string;
  price?: number;
  inventory?: number;
}

export interface CJProduct {
  id: string;
  name: string;
  categoryName?: string;
  sellPrice?: number;
  description?: string;
  productImages?: CJImage[];
  variants?: CJVariant[];
}

export interface MappedProduct {
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
}

export function mapCjProductToLocal(product: CJProduct): MappedProduct {
  const price = product.sellPrice ?? product.variants?.[0]?.price ?? 0;
  const stock = product.variants?.reduce((sum, v) => sum + (v.inventory ?? 0), 0) ?? 0;
  const images = (product.productImages || [])
    .map(i => i.imgUrl)
    .filter(Boolean)
    .slice(0, 6);

  return {
    name: product.name,
    description: product.description || product.name,
    price: Math.max(0, Number(price)),
    images,
    category: product.categoryName || 'Accessories',
    stock: Math.max(0, Number(stock)),
  };
}

