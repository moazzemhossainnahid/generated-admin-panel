'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FolderPlus } from 'lucide-react';
import { toast } from 'react-toastify';
import CategoryForm from '@/components/product-category/CategoryForm';
import { CategoryFormData, ProductCategory } from '@/types/products';

// Mock data for available parent categories
const mockCategories: ProductCategory[] = [
  {
    id: 'cat-1',
    name: 'Electronics',
    slug: 'electronics',
    status: 'active',
    createdAt: '2025-02-15T10:30:00Z',
    updatedAt: '2025-02-15T10:30:00Z'
  },
  {
    id: 'cat-2',
    name: 'Clothing',
    slug: 'clothing',
    status: 'active',
    createdAt: '2025-02-16T11:45:00Z',
    updatedAt: '2025-02-16T11:45:00Z'
  },
  {
    id: 'cat-3',
    name: 'Home & Kitchen',
    slug: 'home-kitchen',
    status: 'active',
    createdAt: '2025-02-17T09:20:00Z',
    updatedAt: '2025-02-17T09:20:00Z'
  },
  {
    id: 'cat-5',
    name: 'Books',
    slug: 'books',
    status: 'active',
    createdAt: '2025-02-19T16:30:00Z',
    updatedAt: '2025-02-19T16:30:00Z'
  },
  {
    id: 'cat-6',
    name: 'Sports & Outdoors',
    slug: 'sports-outdoors',
    status: 'active',
    createdAt: '2025-02-20T08:15:00Z',
    updatedAt: '2025-02-20T08:15:00Z'
  },
  {
    id: 'cat-8',
    name: 'Office Products',
    slug: 'office-products',
    status: 'active',
    createdAt: '2025-02-22T11:25:00Z',
    updatedAt: '2025-02-22T11:25:00Z'
  }
];

export default function NewCategoryPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call with a delay
    const fetchCategories = async () => {
      try {
        // In a real app, you would fetch from your API
        // const response = await fetch('/api/categories');
        // const data = await response.json();
        
        // For now, use mock data
        setTimeout(() => {
          setCategories(mockCategories);
          setIsLoading(false);
        }, 300);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  const handleSubmit = async (data: CategoryFormData) => {
    try {
      // In a real application, you would submit the data to your API
      // For now, we'll just simulate a successful response
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('Category created successfully');
      router.push('/admin/products/categories');
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Failed to create category');
    }
  };

  return (
    <div className="new-category-page">
      <div className="new-category-page__header mb-6">
        <h1 className="text-[#2B4F60] text-2xl font-semibold flex items-center">
          <FolderPlus className="mr-2" size={24} />
          Create New Category
        </h1>
        <p className="text-[#49617E] mt-1">
          Add a new product category to organize your products
        </p>
      </div>
      
      {isLoading ? (
        <div className="new-category-page__loading bg-white p-8 rounded-md text-center">
          <div className="animate-spin h-8 w-8 border-4 border-[#DCE8F8] border-t-[#007BF9] rounded-full mx-auto mb-4"></div>
          <p className="text-[#49617E]">Loading category data...</p>
        </div>
      ) : (
        <CategoryForm 
          categories={categories}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}