'use client';

import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import UserList from '@/components/users/UserList';
import { User } from '@/types/users';

// Mock data for demonstration
const mockUsers: User[] = [
  {
    id: 'user-1',
    username: 'Murad',
    email: 'murad@gmail.com',
    phoneNumber: '(555) 123-4567',
    role: 'Admin',
    status: 'Active',
    createdAt: '2025-02-18T10:30:00Z',
    updatedAt: '2025-02-18T10:30:00Z'
  },
  {
    id: 'user-2',
    username: 'Shafiq Islam',
    email: 'shafiqislam@gmail.com',
    phoneNumber: '(555) 987-6543',
    role: 'Customer',
    status: 'Active',
    createdAt: '2025-02-20T14:45:00Z',
    updatedAt: '2025-02-20T14:45:00Z',
    orderCount: 5,
    reviewCount: 2
  },
  {
    id: 'user-3',
    username: 'John Doe',
    email: 'johndoe@gmail.com',
    phoneNumber: '(555) 555-5555',
    role: 'Customer',
    status: 'Inactive',
    createdAt: '2025-02-22T09:20:00Z',
    updatedAt: '2025-02-22T09:20:00Z',
    orderCount: 1
  },
  {
    id: 'user-4',
    username: 'Jane Smith',
    email: 'janesmith@gmail.com',
    phoneNumber: '(555) 111-2222',
    role: 'Customer',
    status: 'Banned',
    createdAt: '2025-02-24T14:10:00Z',
    updatedAt: '2025-02-24T14:10:00Z'
  },
  {
    id: 'user-5',
    username: 'Admin User',
    email: 'admin@druckland.com',
    phoneNumber: '(555) 333-4444',
    role: 'Admin',
    status: 'Active',
    createdAt: '2025-02-25T16:30:00Z',
    updatedAt: '2025-02-25T16:30:00Z'
  }
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call with a delay
    const fetchData = async () => {
      try {
        // In a real app, you would fetch from your API
        // const response = await fetch('/api/users');
        // const data = await response.json();
        
        // For now, use mock data
        setTimeout(() => {
          setUsers(mockUsers);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching users:', error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="users-page">
      <div className="users-page__header mb-6">
        <h1 className="text-[#2B4F60] text-2xl font-semibold flex items-center">
          <Users className="mr-2" size={24} />
          Users
        </h1>
        <p className="text-[#49617E] mt-1">
          Manage your user accounts, roles, and permissions
        </p>
      </div>
      
      {isLoading ? (
        <div className="users-page__loading bg-white p-8 rounded-md text-center">
          <div className="animate-spin h-8 w-8 border-4 border-[#DCE8F8] border-t-[#007BF9] rounded-full mx-auto mb-4"></div>
          <p className="text-[#49617E]">Loading users...</p>
        </div>
      ) : (
        <UserList 
          initialUsers={users} 
          initialTotal={users.length} 
        />
      )}
    </div>
  );
}