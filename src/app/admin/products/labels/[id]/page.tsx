'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tag, Edit2 } from 'lucide-react';
import { toast } from 'react-toastify';
import LabelForm from '@/components/product-label/LabelForm';
import { ProductLabel, LabelFormData } from '@/types/products';

// Mock data for demonstration
const mockLabels: Record<string, ProductLabel> = {
  'label-1': {
    id: 'label-1',
    name: 'New',
    color: '#F85464',
    status: 'active',
    isFeatured: true,
    createdAt: '2025-02-15T10:30:00Z',
    updatedAt: '2025-02-15T10:30:00Z'
  },
  'label-2': {
    id: 'label-2',
    name: 'Sale',
    color: '#30BF89',
    status: 'active',
    isFeatured: true,
    createdAt: '2025-02-16T11:45:00Z',
    updatedAt: '2025-02-16T11:45:00Z'
  },
  'label-3': {
    id: 'label-3',
    name: 'Hot',
    color: '#FFB02C',
    status: 'active',
    isFeatured: false,
    createdAt: '2025-02-17T09:20:00Z',
    updatedAt: '2025-02-17T09:20:00Z'
  }
};

export default function EditLabelPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [label, setLabel] = useState<ProductLabel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call with a delay
    const fetchData = async () => {
      try {
        // In a real app, you would fetch from your API
        // const response = await fetch(`/api/product-labels/${params.id}`);
        // const data = await response.json();
        
        // For now, use mock data
        setTimeout(() => {
          const labelData = mockLabels[params.id];
          if (labelData) {
            setLabel(labelData);
          } else {
            // Handle not found case
            toast.error('Label not found');
            router.push('/admin/products/label');
          }
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching label:', error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [params.id, router]);

  const handleSubmit = async (data: LabelFormData, exit: boolean = false) => {
    try {
      // In a real application, you would submit the data to your API
      // For now, we'll just simulate a successful response
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('Label updated successfully');
      
      if (exit) {
        router.push('/admin/products/label');
      }
    } catch (error) {
      console.error('Error updating label:', error);
      toast.error('Failed to update label');
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="edit-label-page">
        <div className="edit-label-page__loading bg-white p-8 rounded-md text-center">
          <div className="animate-spin h-8 w-8 border-4 border-[#DCE8F8] border-t-[#007BF9] rounded-full mx-auto mb-4"></div>
          <p className="text-[#49617E]">Loading label...</p>
        </div>
      </div>
    );
  }
  
  if (!label) {
    return (
      <div className="edit-label-page">
        <div className="edit-label-page__not-found bg-white p-8 rounded-md text-center">
          <p className="text-[#F85464] mb-4">Label not found</p>
          <button
            onClick={() => router.push('/admin/products/label')}
            className="text-[#007BF9] hover:underline"
          >
            Return to Labels List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-label-page">
      <div className="edit-label-page__header mb-6">
        <h1 className="text-[#2B4F60] text-2xl font-semibold flex items-center">
          <Edit2 className="mr-2" size={24} />
          Edit Product Label - {label.name}
        </h1>
        <p className="text-[#49617E] mt-1">
          Update your product label details
        </p>
      </div>
      
      <div className="edit-label-page__content bg-white rounded-md border border-[#E4E7EB] p-6">
        <LabelForm 
          initialData={{
            id: label.id,
            name: label.name,
            color: label.color,
            status: label.status,
            isFeatured: label.isFeatured
          }} 
          onSubmit={handleSubmit} 
        />
      </div>
    </div>
  );
}