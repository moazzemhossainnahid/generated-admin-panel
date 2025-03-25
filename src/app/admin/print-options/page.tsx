'use client';

import { useEffect, useState } from 'react';
import { Printer } from 'lucide-react';
import DateFilter from '@/components/ui/DateFilter';
import PrintOptionList from '@/components/print-options/PrintOptionList';
import { PrintOptionGroup } from '@/types/print-options';

// Mock data for demonstration
const mockPrintOptions: PrintOptionGroup[] = [
  {
    id: '1',
    name: 'Business Cards Print Options',
    status: 'published',
    assignedProducts: [
      { id: '101', name: 'Business Card Standard' },
      { id: '102', name: 'Business Card Premium' }
    ],
    createdAt: '2025-02-15T10:30:00Z',
    variations: []
  },
  {
    id: '2',
    name: 'Christmas Invitation Options',
    status: 'published',
    assignedProducts: [
      { id: '201', name: 'Business Christmas Invitation Card' }
    ],
    createdAt: '2025-02-20T14:45:00Z',
    variations: []
  },
  {
    id: '3',
    name: 'Brochure Print Settings',
    status: 'unpublished',
    assignedProducts: [
      { id: '301', name: 'Tri-fold Brochure' },
      { id: '302', name: 'Bi-fold Brochure' }
    ],
    createdAt: '2025-03-01T09:15:00Z',
    variations: []
  },
  {
    id: '4',
    name: 'Flyer Print Options',
    status: 'published',
    assignedProducts: [
      { id: '401', name: 'Standard Flyers' }
    ],
    createdAt: '2025-03-10T11:00:00Z',
    variations: []
  },
  {
    id: '5',
    name: 'Poster Printing Options',
    status: 'unpublished',
    assignedProducts: [],
    createdAt: '2025-03-12T16:20:00Z',
    variations: []
  }
];

export default function PrintOptionsPage() {
  const [printOptions, setPrintOptions] = useState<PrintOptionGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call with a delay
    const fetchData = async () => {
      try {
        // In a real app, you would fetch from your API
        // const response = await fetch('/api/print-options');
        // const data = await response.json();
        
        // For now, use mock data
        setTimeout(() => {
          setPrintOptions(mockPrintOptions);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching print options:', error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleDateFilter = (startDate: string, endDate: string) => {
    // In a real app, you would fetch filtered data from your API
    // For now, simulate filtering on the client
    const filtered = mockPrintOptions.filter(option => {
      const createdDate = new Date(option.createdAt);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      
      if (start && end) {
        return createdDate >= start && createdDate <= end;
      } else if (start) {
        return createdDate >= start;
      } else if (end) {
        return createdDate <= end;
      }
      
      return true;
    });
    
    setPrintOptions(filtered);
  };
  
  const handleClearDateFilter = () => {
    setPrintOptions(mockPrintOptions);
  };

  return (
    <div className="print-options-page">
      <div className="print-options-page__header mb-6">
        <h1 className="text-[#2B4F60] text-2xl font-semibold flex items-center">
          <Printer className="mr-2" size={24} />
          Product Print Option Groups
        </h1>
        <p className="text-[#49617E] mt-1">
          Manage your product print options and assign them to specific products.
        </p>
      </div>
      
      <DateFilter 
        onApplyFilter={handleDateFilter}
        onClearFilter={handleClearDateFilter}
        className="mb-6"
      />
      
      {isLoading ? (
        <div className="print-options-page__loading bg-white p-8 rounded-md text-center">
          <div className="animate-spin h-8 w-8 border-4 border-[#DCE8F8] border-t-[#007BF9] rounded-full mx-auto mb-4"></div>
          <p className="text-[#49617E]">Loading print options...</p>
        </div>
      ) : (
        <PrintOptionList 
          initialPrintOptions={printOptions} 
          initialTotal={printOptions.length} 
        />
      )}
    </div>
  );
}