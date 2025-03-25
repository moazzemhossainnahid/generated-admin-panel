'use client';

import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import CollectionForm from '@/components/product-collection/CollectionForm';
import { CollectionFormData } from '@/types/products';

export default function NewCollectionPage() {
  const router = useRouter();
  
  const handleSubmit = async (data: CollectionFormData) => {
    // In a real application, you would submit the data to your API
    // For now, we'll just navigate back to the list page
    router.push('/admin/products/collection');
  };

  return (
    <div className="new-collection-page">
      <div className="new-collection-page__header mb-6">
        <h1 className="text-[#2B4F60] text-2xl font-semibold flex items-center">
          <Plus className="mr-2" size={24} />
          Add New Collection
        </h1>
        <p className="text-[#49617E] mt-1">
          Create a new product collection to organize and categorize your products
        </p>
      </div>
      
      <CollectionForm onSubmit={handleSubmit} />
    </div>
  );
}