'use client';

import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import FlashSaleForm from '@/components/flash-sale/FlashSaleForm';
import { FlashSaleFormData } from '@/types/products';

export default function NewFlashSalePage() {
  const router = useRouter();
  
  const handleSubmit = async (data: FlashSaleFormData) => {
    // In a real application, you would submit the data to your API
    // For now, we'll just navigate back to the list page
    router.push('/admin/products/flash-sale');
  };

  return (
    <div className="new-flash-sale-page">
      <div className="new-flash-sale-page__header mb-6">
        <h1 className="text-[#2B4F60] text-2xl font-semibold flex items-center">
          <Plus className="mr-2" size={24} />
          Add New Flash Sale
        </h1>
        <p className="text-[#49617E] mt-1">
          Create a new flash sale campaign with customized timing and product discounts
        </p>
      </div>
      
      <FlashSaleForm onSubmit={handleSubmit} />
    </div>
  );
}