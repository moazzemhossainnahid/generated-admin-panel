'use client';

import { useRouter } from 'next/navigation';
import { Tag, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import TagForm from '@/components/product-tags/TagForm';
import { TagFormData } from '@/types/products';

export default function NewTagPage() {
  const router = useRouter();
  
  const handleSubmit = async (data: TagFormData, exit: boolean = false) => {
    try {
      // In a real application, you would submit the data to your API
      // For now, we'll just simulate a successful response
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('Tag created successfully');
      
      if (exit) {
        router.push('/admin/products/tags');
      }
    } catch (error) {
      console.error('Error creating tag:', error);
      toast.error('Failed to create tag');
      throw error;
    }
  };

  return (
    <div className="new-tag-page">
      <div className="new-tag-page__header mb-6">
        <h1 className="text-[#2B4F60] text-2xl font-semibold flex items-center">
          <Plus className="mr-2" size={24} />
          Add New Product Tag
        </h1>
        <p className="text-[#49617E] mt-1">
          Create a new product tag to better organize and categorize your products
        </p>
      </div>
      
      <div className="new-tag-page__content bg-white rounded-md border border-[#E4E7EB] p-6">
        <TagForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}