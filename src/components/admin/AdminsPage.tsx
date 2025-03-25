'use client';

import { useEffect, useState } from 'react';
import { UserCog } from 'lucide-react';
import AdminList from '@/components/admin/AdminList';
import { Admin } from '@/types/admin';

// Mock data for demonstration
const mockAdmins: Admin[] = [
  {
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
  {
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
  {
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
  },
  {
    id: '469363',
    fullName: 'Md Murad Khan',
    username: 'Murad',
    email: 'murad@gmail.com',
    phoneNumber: '(555) 123-4567',
    role: 'Employee',
    status: 'Active',
    isVerified: true,
    createdAt: '2025-02-18T16:33:00Z',
    updatedAt: '2025-02-18T16:33:00Z'
  },
  {
    id: '469364',
    fullName: 'Md Murad Khan',
    username: 'Murad',
    email: 'murad@gmail.com',
    phoneNumber: '(555) 123-4567',
    role: 'Super Admin',
    status: 'Suspended',
    isVerified: true,
    createdAt: '2025-02-18T16:33:00Z',
    updatedAt: '2025-02-18T16:33:00Z'
  },
  {
    id: '469365',
    fullName: 'Md Murad Khan',
    username: 'Murad',
    email: 'murad@gmail.com',
    phoneNumber: '(555) 123-4567',
    role: 'Manager',
    status: 'Inactive',
    isVerified: false,
    createdAt: '2025-02-18T16:33:00Z',
    updatedAt: '2025-02-18T16:33:00Z'
  },
  {
    id: '469366',
    fullName: 'Md Murad Khan',
    username: 'Murad',
    email: 'murad@gmail.com',
    phoneNumber: '(555) 123-4567',
    role: 'Support',
    status: 'Suspended',
    isVerified: true,
    createdAt: '2025-02-18T16:33:00Z',
    updatedAt: '2025-02-18T16:33:00Z'
  },
  {
    id: '469367',
    fullName: 'Md Murad Khan',
    username: 'Murad',
    email: 'murad@gmail.com',
    phoneNumber: '(555) 123-4567',
    role: 'Employee',
    status: 'Inactive',
    isVerified: false,
    createdAt: '2025-02-18T16:33:00Z',
    updatedAt: '2025-02-18T16:33:00Z'
  }
];

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call with a delay
    const fetchData = async () => {
      try {
        // In a real app, you would fetch from your API
        // const response = await fetch('/api/admins');
        // const data = await response.json();
        
        // For now, use mock data
        setTimeout(() => {
          setAdmins(mockAdmins);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching admins:', error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="admins-page">
      <div className="admins-page__header mb-6">
        <h1 className="text-[#2B4F60] text-2xl font-semibold flex items-center">
          <UserCog className="mr-2" size={24} />
          All Admin
        </h1>
        <p className="text-[#49617E] mt-1">
          Manage admin users, roles, and permissions
        </p>
      </div>
      
      {isLoading ? (
        <div className="admins-page__loading bg-white p-8 rounded-md text-center">
          <div className="animate-spin h-8 w-8 border-4 border-[#DCE8F8] border-t-[#007BF9] rounded-full mx-auto mb-4"></div>
          <p className="text-[#49617E]">Loading admin users...</p>
        </div>
      ) : (
        <AdminList 
          initialAdmins={admins} 
          initialTotal={admins.length} 
        />
      )}
    </div>
  );
}