'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Edit2 } from 'lucide-react';
import { toast } from 'react-toastify';
import UserForm from '@/components/users/UserForm';
import { User, UserFormData } from '@/types/users';

// Mock data for demonstration
const mockUsers: Record<string, User> = {
  'user-1': {
    id: 'user-1',
    username: 'Murad',
    email: 'murad@gmail.com',
    phoneNumber: '(555) 123-4567',
    dateOfBirth: '1990-01-15',
    role: 'Admin',
    status: 'Active',
    createdAt: '2025-02-18T10:30:00Z',
    updatedAt: '2025-02-18T10:30:00Z',
    billingAddress: {
      firstName: 'Murad',
      lastName: 'Ahmed',
      email: 'murad@gmail.com',
      phoneNumber: '(555) 123-4567',
      country: 'United States of America',
      address: '123 Main St',
      city: 'New York',
      zipCode: '10001'
    },
    shippingAddress: {
      firstName: 'Murad',
      lastName: 'Ahmed',
      email: 'murad@gmail.com',
      phoneNumber: '(555) 123-4567',
      country: 'United States of America',
      address: '123 Main St',
      city: 'New York',
      zipCode: '10001'
    }
  },
  'user-2': {
    id: 'user-2',
    username: 'Shafiq Islam',
    email: 'shafiqislam@gmail.com',
    phoneNumber: '(555) 987-6543',
    dateOfBirth: '1985-05-20',
    role: 'Customer',
    status: 'Active',
    profilePicture: '/api/placeholder/200/200',
    createdAt: '2025-02-20T14:45:00Z',
    updatedAt: '2025-02-20T14:45:00Z',
    orderCount: 5,
    reviewCount: 2,
    billingAddress: {
      firstName: 'Shafiq',
      lastName: 'Islam',
      companyName: 'Shafiq Co.',
      email: 'shafiqislam@gmail.com',
      phoneNumber: '(555) 987-6543',
      country: 'United States of America',
      address: '456 Oak Ave',
      apartment: 'Suite 200',
      city: 'Chicago',
      zipCode: '60601'
    },
    shippingAddress: {
      firstName: 'Shafiq',
      lastName: 'Islam',
      companyName: 'Shafiq Co.',
      email: 'shafiqislam@gmail.com',
      phoneNumber: '(555) 987-6543',
      country: 'United States of America',
      address: '456 Oak Ave',
      apartment: 'Suite 200',
      city: 'Chicago',
      zipCode: '60601'
    }
  },
  'user-3': {
    id: 'user-3',
    username: 'John Doe',
    email: 'johndoe@gmail.com',
    phoneNumber: '(555) 555-5555',
    role: 'Customer',
    status: 'Inactive',
    createdAt: '2025-02-22T09:20:00Z',
    updatedAt: '2025-02-22T09:20:00Z',
    orderCount: 1,
    billingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@gmail.com',
      phoneNumber: '(555) 555-5555',
      country: 'United States of America',
      address: '789 Pine St',
      city: 'Los Angeles',
      zipCode: '90001'
    },
    shippingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@gmail.com',
      phoneNumber: '(555) 555-5555',
      country: 'United States of America',
      address: '789 Pine St',
      city: 'Los Angeles',
      zipCode: '90001'
    }
  }
};

export default function EditUserPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call with a delay
    const fetchData = async () => {
      try {
        // In a real app, you would fetch from your API
        // const response = await fetch(`/api/users/${params.id}`);
        // const data = await response.json();
        
        // For now, use mock data
        setTimeout(() => {
          const userData = mockUsers[params.id];
          if (userData) {
            setUser(userData);
          } else {
            // Handle not found case
            toast.error('User not found');
            router.push('/admin/users');
          }
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching user:', error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [params.id, router]);

  const handleSubmit = async (data: UserFormData, exit: boolean = false) => {
    try {
      // In a real application, you would submit the data to your API
      // For now, we'll just simulate a successful response
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('User updated successfully');
      
      if (exit) {
        router.push('/admin/users');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="edit-user-page">
        <div className="edit-user-page__loading bg-white p-8 rounded-md text-center">
          <div className="animate-spin h-8 w-8 border-4 border-[#DCE8F8] border-t-[#007BF9] rounded-full mx-auto mb-4"></div>
          <p className="text-[#49617E]">Loading user...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="edit-user-page">
        <div className="edit-user-page__not-found bg-white p-8 rounded-md text-center">
          <p className="text-[#F85464] mb-4">User not found</p>
          <button
            onClick={() => router.push('/admin/users')}
            className="text-[#007BF9] hover:underline"
          >
            Return to Users List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-user-page">
      <div className="edit-user-page__header mb-6">
        <h1 className="text-[#2B4F60] text-2xl font-semibold flex items-center">
          <Edit2 className="mr-2" size={24} />
          Edit User - {user.username}
        </h1>
        <p className="text-[#49617E] mt-1">
          Update user details, status, and permissions
        </p>
      </div>
      
      <UserForm 
        initialData={user} 
        onSubmit={handleSubmit} 
      />
    </div>
  );
}