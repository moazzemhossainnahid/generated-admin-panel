'use client';

import { useEffect, useState } from 'react';
import { Tag } from 'lucide-react';
import CollectionList from '@/components/product-collection/CollectionList';
import { Collection, CollectionFilter } from '@/types/products';

// Mock data for demonstration
const mockCollections: Collection[] = [
  {
    id: 'col-1',
    name: 'New Arrival',
    slug: 'new-arrival',
    description: 'Shop our latest products and new arrivals.',
    status: 'active',
    isFeatured: true,
    createdAt: '2025-02-15T10:30:00Z',
    updatedAt: '2025-02-15T10:30:00Z'
  },
  {
    id: 'col-2',
    name: 'Best Sellers',
    slug: 'best-sellers',
    description: 'Our most popular products based on sales.',
    status: 'active',
    isFeatured: true,
    createdAt: '2025-02-16T11:45:00Z',
    updatedAt: '2025-02-16T11:45:00Z'
  },
  {
    id: 'col-3',
    name: 'Special Offers',
    slug: 'special-offers',
    description: 'Limited time deals and discounts.',
    status: 'inactive',
    isFeatured: false,
    createdAt: '2025-02-17T09:20:00Z',
    updatedAt: '2025-02-17T09:20:00Z'
  },
  {
    id: 'col-4',
    name: 'Featured Products',
    slug: 'featured-products',
    description: 'Curated selection of our best products.',
    status: 'active',
    isFeatured: true,
    createdAt: '2025-02-18T14:10:00Z',
    updatedAt: '2025-02-18T14:10:00Z'
  },
  {
    id: 'col-5',
    name: 'Seasonal Collection',
    slug: 'seasonal-collection',
    description: 'Products for the current season.',
    status: 'inactive',
    isFeatured: false,
    createdAt: '2025-02-19T16:30:00Z',
    updatedAt: '2025-02-19T16:30:00Z'
  },
  {
    id: 'col-6',
    name: 'Clearance',
    slug: 'clearance',
    description: 'Last chance items at great prices.',
    status: 'active',
    isFeatured: false,
    createdAt: '2025-02-20T08:15:00Z',
    updatedAt: '2025-02-20T08:15:00Z'
  },
  {
    id: 'col-7',
    name: 'Holiday Special',
    slug: 'holiday-special',
    description: 'Perfect items for holiday gifting.',
    status: 'inactive',
    isFeatured: true,
    createdAt: '2025-02-21T13:40:00Z',
    updatedAt: '2025-02-21T13:40:00Z'
  },
  {
    id: 'col-8',
    name: 'Trending Now',
    slug: 'trending-now',
    description: 'What\'s popular right now.',
    status: 'active',
    isFeatured: true,
    createdAt: '2025-02-22T11:25:00Z',
    updatedAt: '2025-02-22T11:25:00Z'
  }
];

export default function CollectionPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call with a delay
    const fetchData = async () => {
      try {
        // In a real app, you would fetch from your API
        // const response = await fetch('/api/collections');
        // const data = await response.json();
        
        // For now, use mock data
        setTimeout(() => {
          setCollections(mockCollections);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching collections:', error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Default filter
  const initialFilter: CollectionFilter = {
    search: '',
    status: 'all',
    page: 1,
    limit: 10
  };

  return (
    <div className="collections-page">
      <div className="collections-page__header mb-6">
        <h1 className="text-[#2B4F60] text-2xl font-semibold flex items-center">
          <Tag className="mr-2" size={24} />
          Product Collections
        </h1>
        <p className="text-[#49617E] mt-1">
          Manage your product collections and categories to organize your store
        </p>
      </div>
      
      {isLoading ? (
        <div className="collections-page__loading bg-white p-8 rounded-md text-center">
          <div className="animate-spin h-8 w-8 border-4 border-[#DCE8F8] border-t-[#007BF9] rounded-full mx-auto mb-4"></div>
          <p className="text-[#49617E]">Loading collections...</p>
        </div>
      ) : (
        <CollectionList 
          initialCollections={collections} 
          initialTotal={collections.length} 
          initialFilter={initialFilter}
        />
      )}
    </div>
  );
}