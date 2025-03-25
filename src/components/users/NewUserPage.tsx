'use client';

import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import UserForm from '@/components/users/UserForm';
import { UserFormData } from '@/types/users';

export default function NewUserPage() {
  const router = useRouter();
  
  const handleSubmit = async (data: UserFormData, exit: boolean = false) => {
    try {
      // In a real application, you would submit the data to your API
      // For now, we'll just simulate a successful response
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('User created successfully');
      
      if (exit) {
        router.push('/admin/users');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user');
      throw error;
    }
  };

  return (
    <div className="new-user-page">
      <div className="new-user-page__header mb-6">
        <h1 className="text-[#2B4F60] text-2xl font-semibold flex items-center">
          <Plus className="mr-2" size={24} />
          Add New User
        </h1>
        <p className="text-[#49617E] mt-1">
          Create a new user account with details and permissions
        </p>
      </div>
      
      <UserForm onSubmit={handleSubmit} />
    </div>
  );
}