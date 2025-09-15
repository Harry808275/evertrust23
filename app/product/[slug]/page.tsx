import { Metadata } from 'next';
import ProductDetailClient from './ProductDetailClient';
import { generateProductJsonLd } from '@/lib/structuredData';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { generateProductMetadata } from '@/lib/metadata';

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    await dbConnect();
    const product = await Product.findOne({ slug }).lean();
    
    if (!product) {
      return {
        title: 'Product Not Found',
        description: 'The requested product could not be found.',
      };
    }
    
    return generateProductMetadata(product);
  } catch (error) {
    console.error('Error generating product metadata:', error);
    return {
      title: 'Product',
      description: 'Product details',
    };
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  return <ProductDetailClient slug={slug} />;
}

