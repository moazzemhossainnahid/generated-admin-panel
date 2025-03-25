'use client';

import { useEffect, useState } from 'react';
import { Tag } from 'lucide-react';
import LabelList from '@/components/product-label/LabelList';
import { ProductLabel } from '@/types/products';

// Mock data for demonstration
const mockLabels: ProductLabel[] = [
  {
    id: 'label-1',
    name: 'New',
    color: '#F85464',
    status: 'active',
    isFeatured: true,
    createdAt: '2025-02-15T10:30:00Z',
    updatedAt: '2025-02-15T10:30:00Z'
  },
  {
    id: 'label-2',
    name: 'Sale',
    color: '#30BF89',
    status: 'active',
    isFeatured: true,
    createdAt: '2025-02-16T11:45:00Z',
    updatedAt: '2025-02-16T11:45:00Z'
  },
  {
    id: 'label-3',
    name: 'Hot',
    color: '#FFB02C',
    status: 'active',
    isFeatured: false,
    createdAt: '2025-02-17T09:20:00Z',
    updatedAt: '2025-02-17T09:20:00Z'
  },
  {
    id: 'label-4',
    name: 'Trending',
    color: '#007BF9',
    status: 'active',
    isFeatured: false,
    createdAt: '2025-02-18T14:10:00Z',
    updatedAt: '2025-02-18T14:10:00Z'
  },
  {
    id: 'label-5',
    name: 'Limited Edition',
    color: '#5C59E8',
    status: 'inactive',
    isFeatured: false,
    createdAt: '2025-02-19T16:30:00Z',
    updatedAt: '2025-02-19T16:30:00Z'
  },
  {
    id: 'label-6',
    name: 'Best Seller',
    color: '#E46A11',
    status: 'active',
    isFeatured: true,
    createdAt: '2025-02-20T08:15:00Z',
    updatedAt: '2025-02-20T08:15:00Z'
  }
];

export default function ProductLabelsPage() {
  const [labels, setLabels] = useState<ProductLabel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call with a delay
    const fetchData = async () => {
      try {
        // In a real app, you would fetch from your API
        // const response = await fetch('/api/product-labels');
        // const data = await response.json();
        
        // For now, use mock data
        setTimeout(() => {
          setLabels(mockLabels);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching labels:', error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="product-labels-page">
      <div className="product-labels-page__header mb-6">
        <h1 className="text-[#2B4F60] text-2xl font-semibold flex items-center">
          <Tag className="mr-2" size={24} />
          Product Labels
        </h1>
        <p className="text-[#49617E] mt-1">
          Manage your product labels to categorize and highlight your products
        </p>
      </div>
      
      {isLoading ? (
        <div className="product-labels-page__loading bg-white p-8 rounded-md text-center">
          <div className="animate-spin h-8 w-8 border-4 border-[#DCE8F8] border-t-[#007BF9] rounded-full mx-auto mb-4"></div>
          <p className="text-[#49617E]">Loading labels...</p>
        </div>
      ) : (
        <LabelList 
          initialLabels={labels} 
          initialTotal={labels.length} 
        />
      )}
    </div>
  );
}