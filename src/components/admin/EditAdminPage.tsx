'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserCog, Edit2 } from 'lucide-react';
import { toast } from 'react-toastify';
import AdminForm from '@/components/admin/AdminForm';
import { Admin, AdminFormData } from '@/types/admin';

// Mock data for demonstration
const mockAdmins: Record<string, Admin> = {
  '469360': {
    id: '469360',
    fullName: 'Md Murad Khan',
    username: 'Murad',
    email: 'murad@gmail.com',
    phoneNumber: '(555) 123-4567',
    role: 'Super Admin',
    status: 'Active',
    isVerified: true,
    createdAt: '2025-02-18T16:33:00Z',
    updatedAt: '2025-02-18T16:33:00Z'
  },
  '469361': {
    id: '469361',
    fullName: 'Md Murad Khan',
    username: 'Murad',
    email: 'murad@gmail.com',
    phoneNumber: '(555) 123-4567',
    role: 'Manager',
    status: 'Suspended',
    isVerified: true,
    createdAt: '2025-02-18T16:33:00Z',
    updatedAt: '2025-02-18T16:33:00Z'
  },
  '469362': {
    id: '469362',
    fullName: 'Md Murad Khan',
    username: 'Murad',
    email: 'murad@gmail.com',
    phoneNumber: '(555) 123-4567',
    role: 'Support',
    status: 'Inactive',
    isVerified: false,
    createdAt: '2025-02-18T16:33:00Z',
    updatedAt: '2025-02-18T16:33:00Z'
  }
};

interface EditAdminPageProps {
  params: {
    id: string;
  };
}

export default function EditAdminPage({ params }: EditAdminPageProps) {
  const router = useRouter();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call with a delay
    const fetchData = async () => {
      try {
        // In a real app, you would fetch from your API
        // const response = await fetch(`/api/admins/${params.id}`);
        // const data = await response.json();
        
        // For now, use mock data
        setTimeout(() => {
          const adminData = mockAdmins[params.id];
          if (adminData) {
            setAdmin(adminData);
          } else {
            // Handle not found case
            toast.error('Admin not found');
            router.push('/admin/admin');
          }
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching admin:', error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [params.id, router]);

  const handleSubmit = async (data: AdminFormData, exit: boolean = false) => {
    try {
      // In a real application, you would submit the data to your API
      // For now, we'll just simulate a successful response
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('Admin updated successfully');
      
      if (exit) {
        router.push('/admin/admin');
      }
    } catch (error) {
      console.error('Error updating admin:', error);
      toast.error('Failed to update admin');
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="edit-admin-page">
        <div className="edit-admin-page__loading bg-white p-8 rounded-md text-center">
          <div className="animate-spin h-8 w-8 border-4 border-[#DCE8F8] border-t-[#007BF9] rounded-full mx-auto mb-4"></div>
          <p className="text-[#49617E]">Loading admin...</p>
        </div>
      </div>
    );
  }
  
  if (!admin) {
    return (
      <div className="edit-admin-page">
        <div className="edit-admin-page__not-found bg-white p-8 rounded-md text-center">
          <p className="text-[#F85464] mb-4">Admin not found</p>
          <button
            onClick={() => router.push('/admin/administration')}
            className="text-[#007BF9] hover:underline"
          >
            Return to Admin List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-admin-page">
      <div className="edit-admin-page__header mb-6">
        <h1 className="text-[#2B4F60] text-2xl font-semibold flex items-center">
          <Edit2 className="mr-2" size={24} />
          Edit Admin
        </h1>
        <p className="text-[#49617E] mt-1">
          Update admin user details, role, and permissions
        </p>
      </div>
      
      <AdminForm 
        initialData={admin} 
        onSubmit={handleSubmit} 
      />
    </div>
  );
}