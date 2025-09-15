export function generateProductJsonLd(product: any) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const url = `${baseUrl}/product/${product.slug || product._id}`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.images?.filter(Boolean) || (product.image ? [product.image] : []),
    "sku": product.sku || product._id,
    "brand": { "@type": "Brand", "name": "Style at Home" },
    "offers": {
      "@type": "Offer",
      "url": url,
      "priceCurrency": "USD",
      "price": product.price,
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };
}

export function generateBreadcrumbJsonLd(parts: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": parts.map((p, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": p.name,
      "item": p.url
    }))
  };
}










