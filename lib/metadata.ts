import { Metadata } from 'next';

export const defaultMetadata: Metadata = {
  title: {
    default: 'Style at Home - Luxury Fashion & Lifestyle',
    template: '%s | Style at Home'
  },
  description: 'Discover luxury fashion, accessories, and lifestyle products. Premium quality with exceptional design.',
  keywords: ['luxury fashion', 'designer clothing', 'accessories', 'lifestyle', 'premium products'],
  authors: [{ name: 'Style at Home' }],
  creator: 'Style at Home',
  publisher: 'Style at Home',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Style at Home - Luxury Fashion & Lifestyle',
    description: 'Discover luxury fashion, accessories, and lifestyle products. Premium quality with exceptional design.',
    siteName: 'Style at Home',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Style at Home - Luxury Fashion & Lifestyle',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Style at Home - Luxury Fashion & Lifestyle',
    description: 'Discover luxury fashion, accessories, and lifestyle products. Premium quality with exceptional design.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export function generateProductMetadata(product: any): Metadata {
  return {
    title: product.name,
    description: product.description || `Discover ${product.name} - Premium quality and exceptional design.`,
    openGraph: {
      title: product.name,
      description: product.description || `Discover ${product.name} - Premium quality and exceptional design.`,
      images: product.image ? [product.image] : ['/og-image.jpg'],
      type: 'product',
    },
    twitter: {
      title: product.name,
      description: product.description || `Discover ${product.name} - Premium quality and exceptional design.`,
      images: product.image ? [product.image] : ['/og-image.jpg'],
    },
  };
}

export function generateCategoryMetadata(category: string): Metadata {
  return {
    title: `${category} Collection`,
    description: `Explore our ${category} collection featuring premium quality products with exceptional design.`,
    openGraph: {
      title: `${category} Collection`,
      description: `Explore our ${category} collection featuring premium quality products with exceptional design.`,
    },
    twitter: {
      title: `${category} Collection`,
      description: `Explore our ${category} collection featuring premium quality products with exceptional design.`,
    },
  };
}
