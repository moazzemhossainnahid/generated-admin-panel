'use client';

import { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import ProductList from '@/components/products/ProductList';
import { Product, ProductFilter } from '@/types/products';

// Mock data for demonstration
const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Christmas gift stickers',
    slug: 'christmas-gift-stickers',
    regularPrice: 50.00,
    featuredImage: '/images/christmas-sticker-1.jpg',
    categories: [{ id: 'cat-1', name: 'Invitation Card' }],
    tags: [{ id: 'tag-1', name: 'Christmas' }],
    collections: [{ id: 'col-1', name: 'New Arrival' }],
    labels: [{ id: 'label-1', name: 'New', type: 'new' }],
    status: 'published',
    isFeatured: true,
    createdAt: '2025-02-18T10:30:00Z',
    updatedAt: '2025-02-18T10:30:00Z'
  },
  {
    id: 'prod-2',
    name: 'Christmas gift stickers',
    slug: 'christmas-gift-stickers-2',
    regularPrice: 50.00,
    featuredImage: '/images/christmas-sticker-2.jpg',
    categories: [{ id: 'cat-1', name: 'Invitation Card' }],
    tags: [{ id: 'tag-1', name: 'Christmas' }],
    collections: [],
    labels: [],
    status: 'draft',
    isFeatured: false,
    createdAt: '2025-02-18T11:30:00Z',
    updatedAt: '2025-02-18T11:30:00Z'
  },
  {
    id: 'prod-3',
    name: 'Christmas gift stickers',
    slug: 'christmas-gift-stickers-3',
    regularPrice: 50.00,
    featuredImage: '/images/christmas-sticker-1.jpg',
    categories: [{ id: 'cat-1', name: 'Invitation Card' }],
    tags: [{ id: 'tag-1', name: 'Christmas' }],
    collections: [{ id: 'col-1', name: 'New Arrival' }],
    labels: [{ id: 'label-1', name: 'New', type: 'new' }],
    status: 'published',
    isFeatured: true,
    createdAt: '2025-02-18T12:30:00Z',
    updatedAt: '2025-02-18T12:30:00Z'
  },
  {
    id: 'prod-4',
    name: 'Christmas gift stickers',
    slug: 'christmas-gift-stickers-4',
    regularPrice: 50.00,
    featuredImage: '/images/christmas-sticker-2.jpg',
    categories: [{ id: 'cat-1', name: 'Invitation Card' }],
    tags: [{ id: 'tag-1', name: 'Christmas' }],
    collections: [],
    labels: [],
    status: 'draft',
    isFeatured: false,
    createdAt: '2025-02-18T13:30:00Z',
    updatedAt: '2025-02-18T13:30:00Z'
  },
  {
    id: 'prod-5',
    name: 'Christmas gift stickers',
    slug: 'christmas-gift-stickers-5',
    regularPrice: 50.00,
    featuredImage: '/images/christmas-sticker-1.jpg',
    categories: [{ id: 'cat-1', name: 'Invitation Card' }],
    tags: [{ id: 'tag-1', name: 'Christmas' }],
    collections: [{ id: 'col-1', name: 'New Arrival' }],
    labels: [{ id: 'label-1', name: 'New', type: 'new' }],
    status: 'published',
    isFeatured: true,
    createdAt: '2025-02-18T14:30:00Z',
    updatedAt: '2025-02-18T14:30:00Z'
  },
  {
    id: 'prod-6',
    name: 'Christmas gift stickers',
    slug: 'christmas-gift-stickers-6',
    regularPrice: 50.00,
    featuredImage: '/images/christmas-sticker-2.jpg',
    categories: [{ id: 'cat-1', name: 'Invitation Card' }],
    tags: [{ id: 'tag-1', name: 'Christmas' }],
    collections: [],
    labels: [],
    status: 'draft',
    isFeatured: false,
    createdAt: '2025-02-18T15:30:00Z',
    updatedAt: '2025-02-18T15:30:00Z'
  },
  {
    id: 'prod-7',
    name: 'Christmas gift stickers',
    slug: 'christmas-gift-stickers-7',
    regularPrice: 50.00,
    featuredImage: '/images/christmas-sticker-1.jpg',
    categories: [{ id: 'cat-1', name: 'Invitation Card' }],
    tags: [{ id: 'tag-1', name: 'Christmas' }],
    collections: [{ id: 'col-1', name: 'New Arrival' }],
    labels: [{ id: 'label-1', name: 'New', type: 'new' }],
    status: 'published',
    isFeatured: true,
    createdAt: '2025-02-18T16:30:00Z',
    updatedAt: '2025-02-18T16:30:00Z'
  },
  {
    id: 'prod-8',
    name: 'Christmas gift stickers',
    slug: 'christmas-gift-stickers-8',
    regularPrice: 50.00,
    featuredImage: '/images/christmas-sticker-2.jpg',
    categories: [{ id: 'cat-1', name: 'Invitation Card' }],
    tags: [{ id: 'tag-1', name: 'Christmas' }],
    collections: [],
    labels: [],
    status: 'trash',
    isFeatured: false,
    createdAt: '2025-02-18T17:30:00Z',
    updatedAt: '2025-02-18T17:30:00Z'
  },
  {
    id: 'prod-9',
    name: 'Christmas gift stickers',
    slug: 'christmas-gift-stickers-9',
    regularPrice: 50.00,
    featuredImage: '/images/christmas-sticker-1.jpg',
    categories: [{ id: 'cat-1', name: 'Invitation Card' }],
    tags: [{ id: 'tag-1', name: 'Christmas' }],
    collections: [{ id: 'col-1', name: 'New Arrival' }],
    labels: [{ id: 'label-1', name: 'New', type: 'new' }],
    status: 'published',
    isFeatured: true,
    createdAt: '2025-02-18T18:30:00Z',
    updatedAt: '2025-02-18T18:30:00Z'
  },
  {
    id: 'prod-10',
    name: 'Christmas gift stickers',
    slug: 'christmas-gift-stickers-10',
    regularPrice: 50.00,
    featuredImage: '/images/christmas-sticker-2.jpg',
    categories: [{ id: 'cat-1', name: 'Invitation Card' }],
    tags: [{ id: 'tag-1', name: 'Christmas' }],
    collections: [],
    labels: [],
    status: 'trash',
    isFeatured: false,
    createdAt: '2025-02-18T19:30:00Z',
    updatedAt: '2025-02-18T19:30:00Z'
  }
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call with a delay
    const fetchData = async () => {
      try {
        // In a real app, you would fetch from your API
        // const response = await fetch('/api/products');
        // const data = await response.json();
        
        // For now, use mock data
        setTimeout(() => {
          setProducts(mockProducts);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching products:', error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Default filter
  const initialFilter: ProductFilter = {
    status: 'all',
    search: '',
    page: 1,
    limit: 10
  };

  return (
    <div className="products-page">
      <div className="products-page__header mb-6">
        <h1 className="text-[#2B4F60] text-2xl font-semibold flex items-center">
          <ShoppingCart className="mr-2" size={24} />
          Products
        </h1>
        <p className="text-[#49617E] mt-1">
          Manage your products, check inventory, and track performance
        </p>
      </div>
      
      {isLoading ? (
        <div className="products-page__loading bg-white p-8 rounded-md text-center">
          <div className="animate-spin h-8 w-8 border-4 border-[#DCE8F8] border-t-[#007BF9] rounded-full mx-auto mb-4"></div>
          <p className="text-[#49617E]">Loading products...</p>
        </div>
      ) : (
        <ProductList 
          initialProducts={products} 
          initialTotal={products.length} 
          initialFilter={initialFilter}
        />
      )}
    </div>
  );
}