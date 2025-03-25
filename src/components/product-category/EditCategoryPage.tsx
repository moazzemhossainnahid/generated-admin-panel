'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FolderEdit } from 'lucide-react';
import { toast } from 'react-toastify';
import CategoryForm from '@/components/product-category/CategoryForm';
import { CategoryFormData, ProductCategory } from '@/types/products';

// Mock data for categories
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
    id: 'cat-8',
    name: 'Office Products',
    slug: 'office-products',
    status: 'active',
    productCount: 18,
    createdAt: '2025-02-22T11:25:00Z',
    updatedAt: '2025-02-22T11:25:00Z'
  }
];

// Mock data for individual categories
const mockCategoryData: Record<string, CategoryFormData> = {
  'cat-1': {
    id: 'cat-1',
    name: 'Electronics',
    slug: 'electronics',
    description: 'All electronic devices and accessories',
    status: 'active',
    image: '/api/placeholder/800/300',
    iconType: 'typography',
    icon: 'lucide-smartphone',
    seo: {
      title: 'Electronics - Shop High-Quality Devices | Druckland',
      description: 'Shop for the latest electronics, including smartphones, laptops, TVs, and accessories. Find great deals on top brands.',
      canonicalUrl: '',
      keywords: ['electronics', 'gadgets', 'tech', 'devices', 'smartphones', 'laptops']
    }
  },
  'cat-2': {
    id: 'cat-2',
    name: 'Clothing',
    slug: 'clothing',
    description: 'Men\'s, women\'s, and children\'s clothing and accessories',
    status: 'active',
    image: '/api/placeholder/800/300',
    iconType: 'typography',
    icon: 'lucide-shirt',
    seo: {
      title: 'Clothing - Shop Fashion for Everyone | Druckland',
      description: 'Discover the latest fashion trends in clothing for men, women, and children. Shop tops, bottoms, accessories, and more.',
      canonicalUrl: '',
      keywords: ['clothing', 'fashion', 'apparel', 'men\'s clothing', 'women\'s clothing']
    }
  },
  'cat-3': {
    id: 'cat-3',
    name: 'Home & Kitchen',
    slug: 'home-kitchen',
    description: 'Everything for your home and kitchen needs',
    status: 'active',
    image: '/api/placeholder/800/300',
    iconType: 'image',
    icon: '/api/placeholder/64/64',
    seo: {
      title: 'Home & Kitchen - Essential Products | Druckland',
      description: 'Shop for home and kitchen essentials including appliances, cookware, furniture, decor, and more.',
      canonicalUrl: '',
      keywords: ['home', 'kitchen', 'appliances', 'cookware', 'furniture', 'decor']
    }
  }
};

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [category, setCategory] = useState<CategoryFormData | null>(null);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call with a delay
    const fetchData = async () => {
      try {
        // In a real app, you would fetch from your API
        // For now, use mock data
        setTimeout(() => {
          const categoryData = mockCategoryData[params.id];
          if (categoryData) {
            setCategory(categoryData);
            setCategories(mockCategories);
          } else {
            // Handle not found case
            toast.error('Category not found');
            router.push('/admin/products/categories');
          }
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching category:', error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [params.id, router]);
  
  const handleSubmit = async (data: CategoryFormData) => {
    try {
      // In a real application, you would submit the data to your API
      // For now, we'll just simulate a successful response
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('Category updated successfully');
      router.push('/admin/products/categories');
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
    }
  };
  
  const handleDelete = async () => {
    // Check if category has products
    const categoryWithCount = mockCategories.find(c => c.id === params.id);
    if (categoryWithCount?.productCount && categoryWithCount.productCount > 0) {
      toast.warning(`Cannot delete category because it has ${categoryWithCount.productCount} products associated with it.`);
      return;
    }
    
    try {
      // In a real application, you would submit the delete request to your API
      // For now, we'll just simulate a successful response
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('Category deleted successfully');
      router.push('/admin/products/categories');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  if (isLoading) {
    return (
      <div className="edit-category-page">
        <div className="edit-category-page__loading bg-white p-8 rounded-md text-center">
          <div className="animate-spin h-8 w-8 border-4 border-[#DCE8F8] border-t-[#007BF9] rounded-full mx-auto mb-4"></div>
          <p className="text-[#49617E]">Loading category data...</p>
        </div>
      </div>
    );
  }
  
  if (!category) {
    return (
      <div className="edit-category-page">
        <div className="edit-category-page__not-found bg-white p-8 rounded-md text-center">
          <p className="text-[#F85464] mb-4">Category not found</p>
          <button
            onClick={() => router.push('/admin/products/categories')}
            className="text-[#007BF9] hover:underline"
          >
            Return to Categories List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-category-page">
      <div className="edit-category-page__header mb-6">
        <h1 className="text-[#2B4F60] text-2xl font-semibold flex items-center">
          <FolderEdit className="mr-2" size={24} />
          Edit Category: {category.name}
        </h1>
        <p className="text-[#49617E] mt-1">
          Update category details, status, and SEO settings
        </p>
      </div>
      
      <CategoryForm 
        initialData={category}
        categories={categories}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />
    </div>
  );
}