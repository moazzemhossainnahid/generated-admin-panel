'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Download
} from 'lucide-react';
import { toast } from 'react-toastify';
import Button from '@/components/ui/Button';
import { User } from '@/types/users';

interface UserListProps {
  initialUsers: User[];
  initialTotal: number;
}

const UserList: React.FC<UserListProps> = ({ 
  initialUsers,
  initialTotal
}) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [total] = useState(initialTotal);
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [roleFilter, setRoleFilter] = useState<string>('All');

  // Bulk action handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(users.map(user => user.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) {
      toast.warning('No items selected');
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to delete ${selectedItems.length} selected users?`);
    if (!confirmed) return;

    try {
      // API call would go here
      
      // Update the UI
      setUsers(users.filter(user => !selectedItems.includes(user.id)));
      setSelectedItems([]);
      toast.success(`Successfully deleted ${selectedItems.length} users`);
    } catch (error) {
      toast.error('Failed to delete users');
    }
  };

  // Individual delete handler
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this user?');
    if (!confirmed) return;

    try {
      // API call would go here
      
      // Update the UI
      setUsers(users.filter(user => user.id !== id));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  // Search handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // API call would go here for server-side filtering
    
    // For now, just simulate filtering on client side
    if (searchQuery.trim() === '') {
      setUsers(initialUsers);
    } else {
      const filtered = initialUsers.filter(user => 
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setUsers(filtered);
    }
  };

  // Sorting handler
  const handleSort = (field: string) => {
    const newOrder = field === sortField && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newOrder);
    
    // Sort the users
    const sortedUsers = [...users].sort((a, b) => {
      if (field === 'username') {
        return newOrder === 'asc' 
          ? a.username.localeCompare(b.username) 
          : b.username.localeCompare(a.username);
      } else if (field === 'email') {
        return newOrder === 'asc' 
          ? a.email.localeCompare(b.email) 
          : b.email.localeCompare(a.email);
      } else if (field === 'role') {
        return newOrder === 'asc' 
          ? a.role.localeCompare(b.role) 
          : b.role.localeCompare(a.role);
      } else if (field === 'status') {
        return newOrder === 'asc' 
          ? a.status.localeCompare(b.status) 
          : b.status.localeCompare(a.status);
      } else if (field === 'createdAt') {
        return newOrder === 'asc' 
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() 
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });
    
    setUsers(sortedUsers);
  };

  // Filter handlers
  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    // API call would go here
    
    // For now, just simulate filtering on client side
    if (status === 'All') {
      setUsers(initialUsers);
    } else {
      const filtered = initialUsers.filter(user => 
        user.status === status
      );
      setUsers(filtered);
    }
  };

  const handleRoleFilter = (role: string) => {
    setRoleFilter(role);
    // API call would go here
    
    // For now, just simulate filtering on client side
    if (role === 'All') {
      setUsers(initialUsers);
    } else {
      const filtered = initialUsers.filter(user => 
        user.role === role
      );
      setUsers(filtered);
    }
  };

  // Pagination handlers
  const totalPages = Math.ceil(total / itemsPerPage);
  
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    // API call would go here for server-side pagination
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
    // API call would go here
  };

  // Get sort indicator
  const getSortIndicator = (field: string) => {
    if (field !== sortField) return null;
    
    return sortOrder === 'asc' 
      ? <ArrowUp size={14} className="ml-1" /> 
      : <ArrowDown size={14} className="ml-1" />;
  };

  // Handle export
  const handleExport = () => {
    toast.success('Users exported successfully');
    // In a real application, this would trigger a CSV/Excel export
  };

  return (
    <div className="user-list">
      <div className="user-list__header mb-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="user-list__search flex-1 max-w-md">
          <form onSubmit={handleSearch} className="flex">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F8591]" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email or role..."
                className="w-full pl-10 pr-4 py-2 border border-[#E4E7EB] rounded-l-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9] text-sm"
              />
            </div>
            <Button type="submit" size="md" className="rounded-l-none">
              Search
            </Button>
          </form>
        </div>
        
        <div className="user-list__actions flex gap-3">
          <Button 
            variant="outline" 
            leftIcon={<Download size={16} />}
            onClick={handleExport}
          >
            Export
          </Button>
          
          <Link href="/admin/users/new">
            <Button leftIcon={<Plus size={16} />}>
              Add User
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="user-list__filters mb-4 flex flex-wrap items-center gap-4">
        <div className="user-list__bulk-actions flex items-center gap-2">
          <select 
            className="bulk-action-select border border-[#E4E7EB] bg-white rounded-md px-3 py-2 text-sm text-[#333333] focus:outline-none focus:ring-1 focus:ring-[#007BF9]"
            disabled={selectedItems.length === 0}
            defaultValue=""
          >
            <option value="" disabled>Bulk Actions</option>
            <option value="delete">Delete Selected</option>
          </select>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBulkDelete}
            disabled={selectedItems.length === 0}
          >
            Apply
          </Button>
          
          {selectedItems.length > 0 && (
            <span className="text-sm text-[#49617E]">
              {selectedItems.length} item(s) selected
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#49617E]">Status:</span>
          <select 
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="border border-[#E4E7EB] bg-white rounded-md px-3 py-2 text-sm text-[#333333] focus:outline-none focus:ring-1 focus:ring-[#007BF9]"
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Banned">Banned</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#49617E]">Role:</span>
          <select 
            value={roleFilter}
            onChange={(e) => handleRoleFilter(e.target.value)}
            className="border border-[#E4E7EB] bg-white rounded-md px-3 py-2 text-sm text-[#333333] focus:outline-none focus:ring-1 focus:ring-[#007BF9]"
          >
            <option value="All">All</option>
            <option value="Customer">Customer</option>
            <option value="Admin">Admin</option>
            <option value="Guest">Guest</option>
          </select>
        </div>
      </div>
      
      <div className="user-list__table bg-white rounded-md border border-[#E4E7EB] overflow-hidden mb-4">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8F9FA] border-b border-[#E4E7EB]">
              <tr>
                <th className="px-4 py-3 text-left">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === users.length && users.length > 0}
                      onChange={handleSelectAll}
                      className="mr-2 rounded border-[#E4E7EB]"
                    />
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left font-semibold text-sm text-[#49617E] cursor-pointer"
                  onClick={() => handleSort('username')}
                >
                  <div className="flex items-center">
                    User Name {getSortIndicator('username')}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left font-semibold text-sm text-[#49617E] cursor-pointer"
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center">
                    Email {getSortIndicator('email')}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left font-semibold text-sm text-[#49617E] cursor-pointer"
                  onClick={() => handleSort('role')}
                >
                  <div className="flex items-center">
                    Role {getSortIndicator('role')}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left font-semibold text-sm text-[#49617E] cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    Status {getSortIndicator('status')}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left font-semibold text-sm text-[#49617E] cursor-pointer"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center">
                    Created At {getSortIndicator('createdAt')}
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-semibold text-sm text-[#49617E]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-[#E4E7EB] hover:bg-[#F8F9FA]">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(user.id)}
                      onChange={() => handleSelectItem(user.id)}
                      className="rounded border-[#E4E7EB]"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-[#E0E0E0] flex items-center justify-center mr-2 overflow-hidden">
                        {user.profilePicture ? (
                          <Image 
                            src={user.profilePicture} 
                            alt={user.username} 
                            width={32} 
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[#6F8591] text-sm font-medium">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <Link 
                        href={`/admin/users/${user.id}`}
                        className="text-[#007BF9] hover:underline font-medium"
                      >
                        {user.username}
                      </Link>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#49617E]">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.role === 'Admin' 
                        ? 'bg-[#DCE8F8] text-[#007BF9]' 
                        : user.role === 'Customer'
                          ? 'bg-[#E6F6EE] text-[#30BF89]'
                          : 'bg-[#F5F5F5] text-[#6F8591]'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.status === 'Active' 
                        ? 'bg-[#E6F6EE] text-[#30BF89]' 
                        : user.status === 'Inactive'
                          ? 'bg-[#F5F5F5] text-[#6F8591]'
                          : 'bg-[#FFEFEF] text-[#F85464]'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#49617E]">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link 
                        href={`/admin/users/${user.id}`}
                        className="text-[#49617E] hover:text-[#007BF9] transition"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-[#49617E] hover:text-[#F85464] transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {users.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-[#6F8591]">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="user-list__pagination flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="user-list__per-page flex items-center gap-2">
          <span className="text-sm text-[#49617E]">Show</span>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="border border-[#E4E7EB] rounded px-2 py-1 text-sm text-[#333333] focus:outline-none focus:ring-1 focus:ring-[#007BF9]"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-sm text-[#49617E]">entries</span>
        </div>
        
        <div className="user-list__page-nav flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </Button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(page => (
              page === 1 || 
              page === totalPages || 
              (page >= currentPage - 1 && page <= currentPage + 1)
            ))
            .map((page, i, array) => (
              <React.Fragment key={page}>
                {i > 0 && array[i - 1] !== page - 1 && (
                  <span className="text-[#6F8591] px-2">...</span>
                )}
                <Button
                  variant={currentPage === page ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              </React.Fragment>
            ))
          }
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserList;