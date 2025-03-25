'use client';

import { useRouter } from 'next/navigation';
import { Tag, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import LabelForm from '@/components/product-label/LabelForm';
import { LabelFormData } from '@/types/products';

export default function NewLabelPage() {
  const router = useRouter();
  
  const handleSubmit = async (data: LabelFormData, exit: boolean = false) => {
    try {
      // In a real application, you would submit the data to your API
      // For now, we'll just simulate a successful response
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('Label created successfully');
      
      if (exit) {
        router.push('/admin/products/label');
      }
    } catch (error) {
      console.error('Error creating label:', error);
      toast.error('Failed to create label');
      throw error;
    }
  };

  return (
    <div className="new-label-page">
      <div className="new-label-page__header mb-6">
        <h1 className="text-[#2B4F60] text-2xl font-semibold flex items-center">
          <Plus className="mr-2" size={24} />
          Add New Product Label
        </h1>
        <p className="text-[#49617E] mt-1">
          Create a new product label to highlight and categorize your products
        </p>
      </div>
      
      <div className="new-label-page__content bg-white rounded-md border border-[#E4E7EB] p-6">
        <LabelForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}