'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Printer, Edit2 } from 'lucide-react';
import PrintOptionForm from '@/components/print-options/PrintOptionForm';
import { PrintOptionGroup } from '@/types/print-options';

// Mock data for demonstration
const mockPrintOptionGroups: Record<string, PrintOptionGroup> = {
  '1': {
    id: '1',
    name: 'Business Cards Print Options',
    status: 'published',
    assignedProducts: [
      { id: '101', name: 'Business Card Standard' },
      { id: '102', name: 'Business Card Premium' }
    ],
    createdAt: '2025-02-15T10:30:00Z',
    variations: [
      {
        id: 'quant-1',
        name: 'Quantity',
        type: 'quantity',
        enabled: true,
        discountType: 'fixed',
        attributes: [
          { id: 'q1', name: '100', isDefault: true, price: 20 },
          { id: 'q2', name: '250', isDefault: false, price: 40 },
          { id: 'q3', name: '500', isDefault: false, price: 70 }
        ]
      },
      {
        id: 'size-1',
        name: 'Paper Size or Format',
        type: 'paper-size',
        enabled: true,
        priceType: 'fixed',
        dependOnQuantity: false,
        attributes: [
          { 
            id: 's1', 
            name: 'Standard (90x50mm)', 
            isDefault: true, 
            price: 0,
            designSettings: {
              productWidth: 90,
              productHeight: 50,
              designWidth: 86,
              designHeight: 46,
              designTop: 2,
              designLeft: 2
            }
          },
          { 
            id: 's2', 
            name: 'Square (55x55mm)', 
            isDefault: false, 
            price: 5,
            designSettings: {
              productWidth: 55,
              productHeight: 55,
              designWidth: 51,
              designHeight: 51,
              designTop: 2,
              designLeft: 2
            } 
          }
        ]
      },
      {
        id: 'paper-1',
        name: 'Paper Type',
        type: 'paper-type',
        enabled: true,
        priceType: 'fixed',
        dependOnQuantity: false,
        attributes: [
          { id: 'p1', name: 'Standard 300gsm', isDefault: true, price: 0 },
          { id: 'p2', name: 'Premium 400gsm', isDefault: false, price: 8 },
          { id: 'p3', name: 'Recycled 350gsm', isDefault: false, price: 5 }
        ]
      },
      {
        id: 'finish-1',
        name: 'Finishing',
        type: 'finishing',
        enabled: true,
        priceType: 'fixed',
        dependOnQuantity: true,
        attributes: [
          { 
            id: 'f1', 
            name: 'No Finishing', 
            isDefault: true, 
            price: 0,
            prices: {
              'q1': 0,
              'q2': 0,
              'q3': 0
            }
          },
          { 
            id: 'f2', 
            name: 'Gloss Lamination', 
            isDefault: false, 
            price: 10,
            prices: {
              'q1': 10,
              'q2': 20,
              'q3': 30
            }
          },
          { 
            id: 'f3', 
            name: 'Spot UV', 
            isDefault: false, 
            price: 15,
            prices: {
              'q1': 15,
              'q2': 30,
              'q3': 50
            }
          }
        ]
      }
    ]
  },
  '2': {
    id: '2',
    name: 'Christmas Invitation Options',
    status: 'published',
    assignedProducts: [
      { id: '201', name: 'Business Christmas Invitation Card' }
    ],
    createdAt: '2025-02-20T14:45:00Z',
    variations: [
      {
        id: 'quant-2',
        name: 'Quantity',
        type: 'quantity',
        enabled: true,
        discountType: 'percentage',
        attributes: [
          { id: 'q1', name: '50', isDefault: true, price: 0 },
          { id: 'q2', name: '100', isDefault: false, price: 5 },
          { id: 'q3', name: '200', isDefault: false, price: 10 }
        ]
      },
      {
        id: 'size-2',
        name: 'Paper Size or Format',
        type: 'paper-size',
        enabled: true,
        priceType: 'fixed',
        dependOnQuantity: false,
        attributes: [
          { 
            id: 's1', 
            name: 'A5 (148x210mm)', 
            isDefault: true, 
            price: 0,
            designSettings: {
              productWidth: 148,
              productHeight: 210,
              designWidth: 144,
              designHeight: 206,
              designTop: 2,
              designLeft: 2
            }
          },
          { 
            id: 's2', 
            name: 'A6 (105x148mm)', 
            isDefault: false, 
            price: -5,
            designSettings: {
              productWidth: 105,
              productHeight: 148,
              designWidth: 101,
              designHeight: 144,
              designTop: 2,
              designLeft: 2
            } 
          }
        ]
      }
    ]
  }
};

export default function EditPrintOptionPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [printOptionGroup, setPrintOptionGroup] = useState<PrintOptionGroup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, you would fetch from your API
    // const fetchPrintOptionGroup = async () => {
    //   const response = await fetch(`/api/print-options/${params.id}`);
    //   const data = await response.json();
    //   setPrintOptionGroup(data);
    //   setIsLoading(false);
    // };
    
    // Simulate API call with mock data
    const fetchPrintOptionGroup = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const data = mockPrintOptionGroups[params.id];
        
        if (data) {
          setPrintOptionGroup(data);
        } else {
          // Handle not found case
          router.push('/admin/print-options');
        }
      } catch (error) {
        console.error('Error fetching print option group:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPrintOptionGroup();
  }, [params.id, router]);
  
  const handleSubmit = async (data: PrintOptionGroup) => {
    // In a real application, you would submit the data to your API
    // For now, we'll just navigate back to the list page
    router.push('/admin/print-options');
  };
  
  const handleDelete = () => {
    // In a real application, you would delete the data via your API
    // For now, we'll just navigate back to the list page
    router.push('/admin/print-options');
  };

  if (isLoading) {
    return (
      <div className="edit-print-option-page">
        <div className="edit-print-option-page__loading bg-white p-8 rounded-md text-center">
          <div className="animate-spin h-8 w-8 border-4 border-[#DCE8F8] border-t-[#007BF9] rounded-full mx-auto mb-4"></div>
          <p className="text-[#49617E]">Loading print option group...</p>
        </div>
      </div>
    );
  }
  
  if (!printOptionGroup) {
    return (
      <div className="edit-print-option-page">
        <div className="edit-print-option-page__not-found bg-white p-8 rounded-md text-center">
          <p className="text-[#F85464] mb-4">Print option group not found</p>
          <button
            onClick={() => router.push('/admin/print-options')}
            className="text-[#007BF9] hover:underline"
          >
            Return to Print Options List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-print-option-page">
      <div className="edit-print-option-page__header mb-6">
        <h1 className="text-[#2B4F60] text-2xl font-semibold flex items-center">
          <Edit2 className="mr-2" size={24} />
          Edit Print Option Group
        </h1>
        <p className="text-[#49617E] mt-1">
          Edit existing print option group settings and variations.
        </p>
      </div>
      
      <PrintOptionForm 
        initialData={printOptionGroup} 
        onSubmit={handleSubmit} 
        onDelete={handleDelete}
      />
    </div>
  );
}