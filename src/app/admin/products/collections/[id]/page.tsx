'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Edit2 } from 'lucide-react';
import CollectionForm from '@/components/product-collection/CollectionForm';
import { CollectionFormData } from '@/types/products';

// Mock data for demonstration
const mockCollections: Record<string, CollectionFormData> = {
  'col-1': {
    id: 'col-1',
    name: 'New Arrival',
    slug: 'new-arrival',
    description: 'Shop our latest products and new arrivals.',
    status: 'active',
    isFeatured: true,
    seo: {
      title: 'New Arrivals - Latest Products | Druckland',
      description: 'Discover our latest products and new arrivals. Shop the newest items added to our collection.',
      keywords: ['new arrivals', 'latest products', 'new products'],
      internalLink: '/blog/whats-new',
      externalLink: ''
    }
  },
  'col-2': {
    id: 'col-2',
    name: 'Best Sellers',
    slug: 'best-sellers',
    description: 'Our most popular products based on sales.',
    status: 'active',
    isFeatured: true,
    seo: {
      title: 'Best Sellers - Most Popular Products | Druckland',
      description: 'Shop our best-selling products. These customer favorites are our most popular items.',
      keywords: ['best sellers', 'popular products', 'top products'],
      internalLink: '/blog/customer-favorites',
      externalLink: ''
    }
  },
  'col-3': {
    id: 'col-3',
    name: 'Special Offers',
    slug: 'special-offers',
    description: 'Limited time deals and discounts.',
    status: 'inactive',
    isFeatured: false,
    seo: {
      title: 'Special Offers - Limited Time Deals | Druckland',
      description: 'Shop our special offers and limited time deals. Great products at discounted prices.',
      keywords: ['special offers', 'deals', 'discounts', 'sale'],
      internalLink: '/blog/current-promotions',
      externalLink: ''
    }
  }
};

export default function EditCollectionPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [collection, setCollection] = useState<CollectionFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, you would fetch from your API
    // const fetchCollection = async () => {
    //   const response = await fetch(`/api/collections/${params.id}`);
    //   const data = await response.json();
    //   setCollection(data);
    //   setIsLoading(false);
    // };
    
    // Simulate API call with mock data
    const fetchCollection = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const data = mockCollections[params.id];
        
        if (data) {
          setCollection(data);
        } else {
          // Handle not found case
          router.push('/admin/products/collection');
        }
      } catch (error) {
        console.error('Error fetching collection:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCollection();
  }, [params.id, router]);
  
  const handleSubmit = async (data: CollectionFormData) => {
    // In a real application, you would update the data via your API
    // For now, we'll just navigate back to the list page
    router.push('/admin/products/collection');
  };
  
  const handleDelete = () => {
    // In a real application, you would delete the data via your API
    // For now, we'll just navigate back to the list page
    router.push('/admin/products/collection');
  };

  if (isLoading) {
    return (
      <div className="edit-collection-page">
        <div className="edit-collection-page__loading bg-white p-8 rounded-md text-center">
          <div className="animate-spin h-8 w-8 border-4 border-[#DCE8F8] border-t-[#007BF9] rounded-full mx-auto mb-4"></div>
          <p className="text-[#49617E]">Loading collection details...</p>
        </div>
      </div>
    );
  }
  
  if (!collection) {
    return (
      <div className="edit-collection-page">
        <div className="edit-collection-page__not-found bg-white p-8 rounded-md text-center">
          <p className="text-[#F85464] mb-4">Collection not found</p>
          <button
            onClick={() => router.push('/admin/products/collection')}
            className="text-[#007BF9] hover:underline"
          >
            Return to Collections List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-collection-page">
      <div className="edit-collection-page__header mb-6">
        <h1 className="text-[#2B4F60] text-2xl font-semibold flex items-center">
          <Edit2 className="mr-2" size={24} />
          Edit Collection: {collection.name}
        </h1>
        <p className="text-[#49617E] mt-1">
          Update collection details, status, and SEO settings
        </p>
      </div>
      
      <CollectionForm 
        initialData={collection} 
        onSubmit={handleSubmit} 
        onDelete={handleDelete}
      />
    </div>
  );
}