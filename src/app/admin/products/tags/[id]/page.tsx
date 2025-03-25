'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tag, Edit2 } from 'lucide-react';
import { toast } from 'react-toastify';
import TagForm from '@/components/product-tags/TagForm';
import { ProductTag, TagFormData } from '@/types/products';

// Mock data for demonstration
const mockTags: Record<string, ProductTag> = {
  'tag-1': {
    id: 'tag-1',
    name: 'New',
    slug: 'new',
    createdAt: '2025-02-15T10:30:00Z',
    updatedAt: '2025-02-15T10:30:00Z',
    seo: {
      title: 'New Products',
      description: 'Discover our latest products and additions',
      canonicalUrl: '',
      keywords: ['new', 'latest', 'products']
    }
  },
  'tag-2': {
    id: 'tag-2',
    name: 'Bestseller',
    slug: 'bestseller',
    createdAt: '2025-02-16T11:45:00Z',
    updatedAt: '2025-02-16T11:45:00Z',
    seo: {
      title: 'Bestselling Products',
      description: 'Our most popular products loved by customers',
      canonicalUrl: '',
      keywords: ['bestseller', 'popular', 'trending']
    }
  },
  'tag-3': {
    id: 'tag-3',
    name: 'Sale',
    slug: 'sale',
    createdAt: '2025-02-17T09:20:00Z',
    updatedAt: '2025-02-17T09:20:00Z',
    seo: {
      title: 'Products on Sale',
      description: 'Special discounts and promotions on select products',
      canonicalUrl: '',
      keywords: ['sale', 'discount', 'promotion', 'special offer']
    }
  }
};

export default function EditTagPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [tag, setTag] = useState<ProductTag | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call with a delay
    const fetchData = async () => {
      try {
        // In a real app, you would fetch from your API
        // const response = await fetch(`/api/product-tags/${params.id}`);
        // const data = await response.json();
        
        // For now, use mock data
        setTimeout(() => {
          const tagData = mockTags[params.id];
          if (tagData) {
            setTag(tagData);
          } else {
            // Handle not found case
            toast.error('Tag not found');
            router.push('/admin/products/tags');
          }
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching tag:', error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [params.id, router]);

  const handleSubmit = async (data: TagFormData, exit: boolean = false) => {
    try {
      // In a real application, you would submit the data to your API
      // For now, we'll just simulate a successful response
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('Tag updated successfully');
      
      if (exit) {
        router.push('/admin/products/tags');
      }
    } catch (error) {
      console.error('Error updating tag:', error);
      toast.error('Failed to update tag');
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="edit-tag-page">
        <div className="edit-tag-page__loading bg-white p-8 rounded-md text-center">
          <div className="animate-spin h-8 w-8 border-4 border-[#DCE8F8] border-t-[#007BF9] rounded-full mx-auto mb-4"></div>
          <p className="text-[#49617E]">Loading tag...</p>
        </div>
      </div>
    );
  }
  
  if (!tag) {
    return (
      <div className="edit-tag-page">
        <div className="edit-tag-page__not-found bg-white p-8 rounded-md text-center">
          <p className="text-[#F85464] mb-4">Tag not found</p>
          <button
            onClick={() => router.push('/admin/products/tags')}
            className="text-[#007BF9] hover:underline"
          >
            Return to Tags List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-tag-page">
      <div className="edit-tag-page__header mb-6">
        <h1 className="text-[#2B4F60] text-2xl font-semibold flex items-center">
          <Edit2 className="mr-2" size={24} />
          Edit Product Tag - {tag.name}
        </h1>
        <p className="text-[#49617E] mt-1">
          Update your product tag details and SEO settings
        </p>
      </div>
      
      <div className="edit-tag-page__content bg-white rounded-md border border-[#E4E7EB] p-6">
        <TagForm 
          initialData={{
            id: tag.id,
            name: tag.name,
            slug: tag.slug,
            seo: tag.seo || {
              title: '',
              description: '',
              canonicalUrl: '',
              keywords: []
            }
          }} 
          onSubmit={handleSubmit} 
        />
      </div>
    </div>
  );
}