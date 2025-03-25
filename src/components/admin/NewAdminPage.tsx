'use client';

import { useRouter } from 'next/navigation';
import { UserCog, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import AdminForm from '@/components/admin/AdminForm';
import { AdminFormData } from '@/types/admin';

export default function NewAdminPage() {
  const router = useRouter();
  
  const handleSubmit = async (data: AdminFormData, exit: boolean = false) => {
    try {
      // In a real application, you would submit the data to your API
      // For now, we'll just simulate a successful response
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('Admin created successfully');
      
      if (exit) {
        router.push('/admin/admin');
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      toast.error('Failed to create admin');
      throw error;
    }
  };

  return (
    <div className="new-admin-page">
      <div className="new-admin-page__header mb-6">
        <h1 className="text-[#2B4F60] text-2xl font-semibold flex items-center">
          <Plus className="mr-2" size={24} />
          Add New Admin
        </h1>
        <p className="text-[#49617E] mt-1">
          Create a new admin user with appropriate role and permissions
        </p>
      </div>
      
      <AdminForm onSubmit={handleSubmit} />
    </div>
  );
}