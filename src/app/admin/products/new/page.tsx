'use client';

import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import ProductForm from '@/components/products/ProductForm';
import { ProductFormData } from '@/types/products';

export default function NewProductPage() {
  const router = useRouter();
  
  const handleSubmit = async (data: ProductFormData) => {
    // In a real application, you would submit the data to your API
    // For now, we'll just navigate back to the list page
    router.push('/admin/products');
  };

  return (
    <div className="new-product-page">
      <div className="new-product-page__header mb-6">
        <h1 className="text-[#2B4F60] text-2xl font-semibold flex items-center">
          <Plus className="mr-2" size={24} />
          Add New Product
        </h1>
        <p className="text-[#49617E] mt-1">
          Create a new product with all the required information
        </p>
      </div>
      
      <ProductForm onSubmit={handleSubmit} />
    </div>
  );
}