'use client';

import { useEffect, useState } from 'react';
import { Tag } from 'lucide-react';
import TagList from '@/components/product-tags/TagList';
import { ProductTag } from '@/types/products';

// Mock data for demonstration
const mockTags: ProductTag[] = [
  {
    id: 'tag-1',
    name: 'New',
    slug: 'new',
    createdAt: '2025-02-15T10:30:00Z',
    updatedAt: '2025-02-15T10:30:00Z'
  },
  {
    id: 'tag-2',
    name: 'Bestseller',
    slug: 'bestseller',
    createdAt: '2025-02-16T11:45:00Z',
    updatedAt: '2025-02-16T11:45:00Z'
  },
  {
    id: 'tag-3',
    name: 'Sale',
    slug: 'sale',
    createdAt: '2025-02-17T09:20:00Z',
    updatedAt: '2025-02-17T09:20:00Z'
  },
  {
    id: 'tag-4',
    name: 'Christmas',
    slug: 'christmas',
    createdAt: '2025-02-18T14:10:00Z',
    updatedAt: '2025-02-18T14:10:00Z'
  },
  {
    id: 'tag-5',
    name: 'Valentine',
    slug: 'valentine',
    createdAt: '2025-02-19T16:30:00Z',
    updatedAt: '2025-02-19T16:30:00Z'
  },
  {
    id: 'tag-6',
    name: 'Easter',
    slug: 'easter',
    createdAt: '2025-02-20T08:15:00Z',
    updatedAt: '2025-02-20T08:15:00Z'
  },
  {
    id: 'tag-7',
    name: 'Halloween',
    slug: 'halloween',
    createdAt: '2025-02-21T13:40:00Z',
    updatedAt: '2025-02-21T13:40:00Z'
  },
  {
    id: 'tag-8',
    name: 'Premium',
    slug: 'premium',
    createdAt: '2025-02-22T11:25:00Z',
    updatedAt: '2025-02-22T11:25:00Z'
  }
];

export default function ProductTagsPage() {
  const [tags, setTags] = useState<ProductTag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call with a delay
    const fetchData = async () => {
      try {
        // In a real app, you would fetch from your API
        // const response = await fetch('/api/product-tags');
        // const data = await response.json();
        
        // For now, use mock data
        setTimeout(() => {
          setTags(mockTags);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching tags:', error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="product-tags-page">
      <div className="product-tags-page__header mb-6">
        <h1 className="text-[#2B4F60] text-2xl font-semibold flex items-center">
          <Tag className="mr-2" size={24} />
          Product Tags
        </h1>
        <p className="text-[#49617E] mt-1">
          Manage your product tags and categorize your products for better navigation
        </p>
      </div>
      
      {isLoading ? (
        <div className="product-tags-page__loading bg-white p-8 rounded-md text-center">
          <div className="animate-spin h-8 w-8 border-4 border-[#DCE8F8] border-t-[#007BF9] rounded-full mx-auto mb-4"></div>
          <p className="text-[#49617E]">Loading tags...</p>
        </div>
      ) : (
        <TagList 
          initialTags={tags} 
          initialTotal={tags.length} 
        />
      )}
    </div>
  );
}