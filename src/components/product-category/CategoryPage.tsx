'use client';

import { useEffect, useState } from 'react';
import { FolderTree } from 'lucide-react';
import CategoryList from '@/components/product-category/CategoryList';
import { ProductCategory, CategoryFilter } from '@/types/products';

// Mock data for demonstration
const mockCategories: ProductCategory[] = [
  {
    id: 'cat-1',
    name: 'Electronics',
    slug: 'electronics',
    status: 'active',
    productCount: 45,
    createdAt: '2025-02-15T10:30:00Z',
    updatedAt: '2025-02-15T10:30:00Z'
  },
  {
    id: 'cat-2',
    name: 'Clothing',
    slug: 'clothing',
    status: 'active',
    productCount: 78,
    createdAt: '2025-02-16T11:45:00Z',
    updatedAt: '2025-02-16T11:45:00Z'
  },
  {
    id: 'cat-3',
    name: 'Home & Kitchen',
    slug: 'home-kitchen',
    status: 'active',
    productCount: 32,
    createdAt: '2025-02-17T09:20:00Z',
    updatedAt: '2025-02-17T09:20:00Z'
  },
  {
    id: 'cat-4',
    name: 'Toys & Games',
    slug: 'toys-games',
    status: 'inactive',
    productCount: 0,
    createdAt: '2025-02-18T14:10:00Z',
    updatedAt: '2025-02-18T14:10:00Z'
  },
  {
    id: 'cat-5',
    name: 'Books',
    slug: 'books',
    status: 'active',
    productCount: 56,
    createdAt: '2025-02-19T16:30:00Z',
    updatedAt: '2025-02-19T16:30:00Z'
  },
  {
    id: 'cat-6',
    name: 'Sports & Outdoors',
    slug: 'sports-outdoors',
    status: 'active',
    productCount: 23,
    createdAt: '2025-02-20T08:15:00Z',
    updatedAt: '2025-02-20T08:15:00Z'
  },
  {
    id: 'cat-7',
    name: 'Beauty & Personal Care',
    slug: 'beauty-personal-care',
    status: 'inactive',
    productCount: 0,
    createdAt: '2025-02-21T13:40:00Z',
    updatedAt: '2025-02-21T13:40:00Z'
  },
  {
    id: 'cat-8',
    name: 'Office Products',
    slug: 'office-products',
    status: 'active',
    productCount: 18,
    createdAt: '2025-02-22T11:25:00Z',
    updatedAt: '2025-02-22T11:25:00Z'
  },
  {
    id: 'cat-9',
    name: 'Smartphones',
    slug: 'smartphones',
    parentId: 'cat-1',
    status: 'active',
    productCount: 15,
    createdAt: '2025-02-23T10:15:00Z',
    updatedAt: '2025-02-23T10:15:00Z'
  },
  {
    id: 'cat-10',
    name: 'Laptops',
    slug: 'laptops',
    parentId: 'cat-1',
    status: 'active',
    productCount: 20,
    createdAt: '2025-02-24T09:30:00Z',
    updatedAt: '2025-02-24T09:30:00Z'
  },
  {
    id: 'cat-11',
    name: "Men's Clothing",
    slug: 'mens-clothing',
    parentId: 'cat-2',
    status: 'active',
    productCount: 38,
    createdAt: '2025-02-25T14:20:00Z',
    updatedAt: '2025-02-25T14:20:00Z'
  },
  {
    id: 'cat-12',
    name: "Women's Clothing",
    slug: 'womens-clothing',
    parentId: 'cat-2',
    status: 'active',
    productCount: 40,
    createdAt: '2025-02-26T15:45:00Z',
    updatedAt: '2025-02-26T15:45:00Z'
  }
];

export default function CategoryPage() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call with a delay
    const fetchData = async () => {
      try {
        // In a real app, you would fetch from your API
        // const response = await fetch('/api/categories');
        // const data = await response.json();
        
        // For now, use mock data
        setTimeout(() => {
          // Here we'd typically process the data to establish the parent-child relationships
          // But for the demo we'll use the mock data directly
          setCategories(mockCategories);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Default filter
  const initialFilter: CategoryFilter = {
    search: '',
    page: 1,
    limit: 10,
    sort: 'createdAt',
    sortDirection: 'desc'
  };

  return (
    <div className="categories-page">
      <div className="categories-page__header mb-6">
        <h1 className="text-[#2B4F60] text-2xl font-semibold flex items-center">
          <FolderTree className="mr-2" size={24} />
          Product Categories
        </h1>
        <p className="text-[#49617E] mt-1">
          Manage product categories to organize your store and improve navigation
        </p>
      </div>
      
      {isLoading ? (
        <div className="categories-page__loading bg-white p-8 rounded-md text-center">
          <div className="animate-spin h-8 w-8 border-4 border-[#DCE8F8] border-t-[#007BF9] rounded-full mx-auto mb-4"></div>
          <p className="text-[#49617E]">Loading categories...</p>
        </div>
      ) : (
        <CategoryList 
          initialCategories={categories} 
          initialTotal={categories.length} 
          initialFilter={initialFilter}
        />
      )}
    </div>
  );
}