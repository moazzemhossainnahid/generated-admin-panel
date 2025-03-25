'use client';

import { useEffect, useState } from 'react';
import { Flame } from 'lucide-react';
import FlashSaleList from '@/components/flash-sale/FlashSaleList';
import { FlashSale, FlashSaleFilter } from '@/types/products';

// Mock data for demonstration
const mockFlashSales: FlashSale[] = [
  {
    id: 'sale-1',
    name: 'New Year Sale',
    startDate: '2025-02-19T04:00:00Z',
    endDate: '2025-02-25T04:00:00Z',
    status: 'active',
    visibility: 'public',
    products: [],
    isFeatured: true,
    createdAt: '2025-02-18T04:33:00Z',
    updatedAt: '2025-02-18T04:33:00Z'
  },
  {
    id: 'sale-2',
    name: 'New Year Sale',
    startDate: '2025-02-19T04:00:00Z',
    endDate: '2025-02-25T04:00:00Z',
    status: 'expired',
    visibility: 'public',
    products: [],
    isFeatured: false,
    createdAt: '2025-02-18T04:33:00Z',
    updatedAt: '2025-02-18T04:33:00Z'
  },
  {
    id: 'sale-3',
    name: 'New Year Sale',
    startDate: '2025-02-19T05:00:00Z',
    endDate: '2025-02-25T04:00:00Z',
    status: 'scheduled',
    visibility: 'public',
    products: [],
    isFeatured: false,
    createdAt: '2025-02-18T04:33:00Z',
    updatedAt: '2025-02-18T04:33:00Z'
  },
  {
    id: 'sale-4',
    name: 'New Year Sale',
    startDate: '2025-02-19T05:00:00Z',
    endDate: '2025-02-25T04:00:00Z',
    status: 'expired',
    visibility: 'hidden',
    products: [],
    isFeatured: false,
    createdAt: '2025-02-18T04:33:00Z',
    updatedAt: '2025-02-18T04:33:00Z'
  },
  {
    id: 'sale-5',
    name: 'New Year Sale',
    startDate: '2025-02-19T05:00:00Z',
    endDate: '2025-02-25T04:00:00Z',
    status: 'active',
    visibility: 'public',
    products: [],
    isFeatured: true,
    createdAt: '2025-02-18T04:33:00Z',
    updatedAt: '2025-02-18T04:33:00Z'
  },
  {
    id: 'sale-6',
    name: 'New Year Sale',
    startDate: '2025-02-19T05:00:00Z',
    endDate: '2025-02-25T04:00:00Z',
    status: 'expired',
    visibility: 'public',
    products: [],
    isFeatured: false,
    createdAt: '2025-02-18T04:33:00Z',
    updatedAt: '2025-02-18T04:33:00Z'
  },
  {
    id: 'sale-7',
    name: 'New Year Sale',
    startDate: '2025-02-19T05:00:00Z',
    endDate: '2025-02-25T04:00:00Z',
    status: 'active',
    visibility: 'public',
    products: [],
    isFeatured: false,
    createdAt: '2025-02-18T04:33:00Z',
    updatedAt: '2025-02-18T04:33:00Z'
  },
  {
    id: 'sale-8',
    name: 'New Year Sale',
    startDate: '2025-02-19T05:00:00Z',
    endDate: '2025-02-25T04:00:00Z',
    status: 'expired',
    visibility: 'public',
    products: [],
    isFeatured: false,
    createdAt: '2025-02-18T04:33:00Z',
    updatedAt: '2025-02-18T04:33:00Z'
  }
];

export default function FlashSalePage() {
  const [flashSales, setFlashSales] = useState<FlashSale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call with a delay
    const fetchData = async () => {
      try {
        // In a real app, you would fetch from your API
        // const response = await fetch('/api/flash-sales');
        // const data = await response.json();
        
        // For now, use mock data
        setTimeout(() => {
          setFlashSales(mockFlashSales);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching flash sales:', error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Default filter
  const initialFilter: FlashSaleFilter = {
    search: '',
    page: 1,
    limit: 10
  };

  return (
    <div className="flash-sales-page">
      <div className="flash-sales-page__header mb-6">
        <h1 className="text-[#2B4F60] text-2xl font-semibold flex items-center">
          <Flame className="mr-2" size={24} />
          Flash Sales
        </h1>
        <p className="text-[#49617E] mt-1">
          Manage your flash sales campaigns, promotions, and limited-time offers
        </p>
      </div>
      
      {isLoading ? (
        <div className="flash-sales-page__loading bg-white p-8 rounded-md text-center">
          <div className="animate-spin h-8 w-8 border-4 border-[#DCE8F8] border-t-[#007BF9] rounded-full mx-auto mb-4"></div>
          <p className="text-[#49617E]">Loading flash sales...</p>
        </div>
      ) : (
        <FlashSaleList 
          initialFlashSales={flashSales} 
          initialTotal={flashSales.length} 
          initialFilter={initialFilter}
        />
      )}
    </div>
  );
}