'use client';

import { useRouter } from 'next/navigation';
import { Printer, Plus } from 'lucide-react';
import PrintOptionForm from '@/components/print-options/PrintOptionForm';
import { PrintOptionGroup } from '@/types/print-options';

export default function NewPrintOptionPage() {
  const router = useRouter();
  
  const handleSubmit = async (data: PrintOptionGroup) => {
    // In a real application, you would submit the data to your API
    // For now, we'll just navigate back to the list page
    router.push('/admin/print-options');
  };

  return (
    <div className="new-print-option-page">
      <div className="new-print-option-page__header mb-6">
        <h1 className="text-[#2B4F60] text-2xl font-semibold flex items-center">
          <Plus className="mr-2" size={24} />
          Add New Print Option Group
        </h1>
        <p className="text-[#49617E] mt-1">
          Create a new print option group to define product variations and pricing.
        </p>
      </div>
      
      <PrintOptionForm onSubmit={handleSubmit} />
    </div>
  );
}