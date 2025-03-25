'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Edit2 } from 'lucide-react';
import FlashSaleForm from '@/components/flash-sale/FlashSaleForm';
import { FlashSaleFormData } from '@/types/products';

// Mock data for demonstration
const mockFlashSales: Record<string, FlashSaleFormData> = {
  'sale-1': {
    id: 'sale-1',
    name: 'New Year Sale',
    startDate: '2025-02-19T04:00:00',
    endDate: '2025-02-25T04:00:00',
    status: 'active',
    visibility: 'public',
    products: [
      {
        id: 'prod-1',
        name: 'Christmas Gift Cards',
        image: '/images/christmas-card-1.jpg',
        regularPrice: 100.00,
        salePrice: 80.00,
        offeredPrice: 80.00
      },
      {
        id: 'prod-2',
        name: 'New Year Greeting Cards',
        image: '/images/new-year-card-1.jpg',
        regularPrice: 120.00,
        salePrice: 90.00,
        offeredPrice: 90.00
      }
    ],
    isFeatured: true,
    tags: [
      { id: 'tag-2', name: 'Christmas' },
      { id: 'tag-3', name: 'Sale' }
    ]
  },
  'sale-2': {
    id: 'sale-2',
    name: 'Christmas Flash Deal',
    startDate: '2025-02-15T04:00:00',
    endDate: '2025-02-20T04:00:00',
    status: 'expired',
    visibility: 'public',
    products: [
      {
        id: 'prod-1',
        name: 'Christmas Gift Cards',
        image: '/images/christmas-card-1.jpg',
        regularPrice: 100.00,
        salePrice: 75.00,
        offeredPrice: 75.00
      }
    ],
    isFeatured: false,
    tags: [
      { id: 'tag-2', name: 'Christmas' }
    ]
  }
};

export default function EditFlashSalePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [flashSale, setFlashSale] = useState<FlashSaleFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, you would fetch from your API
    // const fetchFlashSale = async () => {
    //   const response = await fetch(`/api/flash-sales/${params.id}`);
    //   const data = await response.json();
    //   setFlashSale(data);
    //   setIsLoading(false);
    // };
    
    // Simulate API call with mock data
    const fetchFlashSale = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const data = mockFlashSales[params.id];
        
        if (data) {
          setFlashSale(data);
        } else {
          // Handle not found case
          router.push('/admin/products/flash-sale');
        }
      } catch (error) {
        console.error('Error fetching flash sale:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFlashSale();
  }, [params.id, router]);
  
  const handleSubmit = async (data: FlashSaleFormData) => {
    // In a real application, you would update the data via your API
    // For now, we'll just navigate back to the list page
    router.push('/admin/products/flash-sale');
  };
  
  const handleDelete = () => {
    // In a real application, you would delete the data via your API
    // For now, we'll just navigate back to the list page
    router.push('/admin/products/flash-sale');
  };

  if (isLoading) {
    return (
      <div className="edit-flash-sale-page">
        <div className="edit-flash-sale-page__loading bg-white p-8 rounded-md text-center">
          <div className="animate-spin h-8 w-8 border-4 border-[#DCE8F8] border-t-[#007BF9] rounded-full mx-auto mb-4"></div>
          <p className="text-[#49617E]">Loading flash sale details...</p>
        </div>
      </div>
    );
  }
  
  if (!flashSale) {
    return (
      <div className="edit-flash-sale-page">
        <div className="edit-flash-sale-page__not-found bg-white p-8 rounded-md text-center">
          <p className="text-[#F85464] mb-4">Flash sale not found</p>
          <button
            onClick={() => router.push('/admin/products/flash-sale')}
            className="text-[#007BF9] hover:underline"
          >
            Return to Flash Sales List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-flash-sale-page">
      <div className="edit-flash-sale-page__header mb-6">
        <h1 className="text-[#2B4F60] text-2xl font-semibold flex items-center">
          <Edit2 className="mr-2" size={24} />
          Edit Flash Sale: {flashSale.name}
        </h1>
        <p className="text-[#49617E] mt-1">
          Update your flash sale details, timing, and product discounts
        </p>
      </div>
      
      <FlashSaleForm 
        initialData={flashSale} 
        onSubmit={handleSubmit} 
        onDelete={handleDelete}
      />
    </div>
  );
}