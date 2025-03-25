'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Download
} from 'lucide-react';
import { toast } from 'react-toastify';
import Button from '@/components/ui/Button';
import { Admin } from '@/types/admin';

interface AdminListProps {
  initialAdmins: Admin[];
  initialTotal: number;
}

const AdminList: React.FC<AdminListProps> = ({ 
  initialAdmins,
  initialTotal
}) => {
  const [admins, setAdmins] = useState<Admin[]>(initialAdmins);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [total, setTotal] = useState(initialTotal);
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [bulkAction, setBulkAction] = useState<string>('');

  // Bulk action handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(admins.map(admin => admin.id));
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

  const handleBulkActionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBulkAction(e.target.value);
  };

  const handleApplyBulkAction = async () => {
    if (selectedItems.length === 0) {
      toast.warning('No items selected');
      return;
    }

    if (!bulkAction) {
      toast.warning('Please select an action');
      return;
    }

    try {
      // API call would go here
      
      // Update the UI based on the action
      if (bulkAction === 'activate') {
        const updatedAdmins = admins.map(admin => 
          selectedItems.includes(admin.id) 
            ? { ...admin, status: 'Active' as const } 
            : admin
        );
        setAdmins(updatedAdmins);
        toast.success(`${selectedItems.length} admins activated`);
      } else if (bulkAction === 'deactivate') {
        const updatedAdmins = admins.map(admin => 
          selectedItems.includes(admin.id) 
            ? { ...admin, status: 'Inactive' as const } 
            : admin
        );
        setAdmins(updatedAdmins);
        toast.success(`${selectedItems.length} admins deactivated`);
      } else if (bulkAction === 'delete') {
        setAdmins(admins.filter(admin => !selectedItems.includes(admin.id)));
        toast.success(`${selectedItems.length} admins deleted`);
      }
      
      setSelectedItems([]);
      setBulkAction('');
    } catch (error) {
      toast.error('Failed to perform bulk action');
    }
  };

  // Individual delete handler
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this admin?');
    if (!confirmed) return;

    try {
      // API call would go here
      
      // Update the UI
      setAdmins(admins.filter(admin => admin.id !== id));
      toast.success('Admin deleted successfully');
    } catch (error) {
      toast.error('Failed to delete admin');
    }
  };

  // Search handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // API call would go here for server-side filtering
    
    // For now, just simulate filtering on client side
    if (searchQuery.trim() === '') {
      setAdmins(initialAdmins);
    } else {
      const filtered = initialAdmins.filter(admin => 
        admin.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.role.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setAdmins(filtered);
    }
  };

  // Sorting handler
  const handleSort = (field: string) => {
    const newOrder = field === sortField && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newOrder);
    
    // Sort the admins
    const sortedAdmins = [...admins].sort((a, b) => {
      if (field === 'fullName') {
        return newOrder === 'asc' 
          ? a.fullName.localeCompare(b.fullName) 
          : b.fullName.localeCompare(a.fullName);
      } else if (field === 'username') {
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
    
    setAdmins(sortedAdmins);
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

  // Handle export
  const handleExport = () => {
    toast.success('Admins exported successfully');
    // In a real application, this would trigger a CSV/Excel export
  };

  // Get sort indicator
  const getSortIndicator = (field: string) => {
    if (field !== sortField) return null;
    
    return sortOrder === 'asc' 
      ? <ArrowUp size={14} className="ml-1" /> 
      : <ArrowDown size={14} className="ml-1" />;
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: Admin['status'] }) => {
    let bgColor = '';
    let textColor = '';
    
    switch (status) {
      case 'Active':
        bgColor = 'bg-[#E6F6EE]';
        textColor = 'text-[#30BF89]';
        break;
      case 'Inactive':
        bgColor = 'bg-[#FFF4EB]';
        textColor = 'text-[#E46A11]';
        break;
      case 'Suspended':
        bgColor = 'bg-[#FFEFEF]';
        textColor = 'text-[#F85464]';
        break;
      default:
        bgColor = 'bg-[#F5F5F5]';
        textColor = 'text-[#6F8591]';
    }
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {status}
      </span>
    );
  };

  // Role badge component
  const RoleBadge = ({ role }: { role: Admin['role'] }) => {
    let bgColor = '';
    let textColor = '';
    
    switch (role) {
      case 'Super Admin':
        bgColor = 'bg-[#DCE8F8]';
        textColor = 'text-[#007BF9]';
        break;
      case 'Manager':
        bgColor = 'bg-[#E6F6EE]';
        textColor = 'text-[#30BF89]';
        break;
      case 'Support':
        bgColor = 'bg-[#FFF4EB]';
        textColor = 'text-[#E46A11]';
        break;
      case 'Employee':
        bgColor = 'bg-[#FFE9D5]';
        textColor = 'text-[#F59E0B]';
        break;
      case 'Editor':
        bgColor = 'bg-[#F5F5F5]';
        textColor = 'text-[#6F8591]';
        break;
      default:
        bgColor = 'bg-[#F5F5F5]';
        textColor = 'text-[#6F8591]';
    }
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {role}
      </span>
    );
  };

  return (
    <div className="admin-list">
      <div className="admin-list__header mb-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="admin-list__search flex-1 max-w-md">
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
        
        <div className="admin-list__actions flex gap-3">
          <Button 
            variant="outline" 
            leftIcon={<Download size={16} />}
            onClick={handleExport}
          >
            Export
          </Button>
          
          <Link href="/admin/administration/new">
            <Button leftIcon={<Plus size={16} />}>
              Add Admin
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="admin-list__bulk-actions mb-4 flex items-center gap-4">
        <select 
          value={bulkAction}
          onChange={handleBulkActionChange}
          className="bulk-action-select border border-[#E4E7EB] bg-white rounded-md px-3 py-2 text-sm text-[#333333] focus:outline-none focus:ring-1 focus:ring-[#007BF9]"
        >
          <option value="">Bulk Actions</option>
          <option value="activate">Activate Selected</option>
          <option value="deactivate">Deactivate Selected</option>
          <option value="delete">Delete Selected</option>
        </select>
        
        <Button 
          variant="primary" 
          size="sm" 
          onClick={handleApplyBulkAction}
          disabled={selectedItems.length === 0 || !bulkAction}
        >
          Apply
        </Button>
        
        {selectedItems.length > 0 && (
          <span className="text-sm text-[#49617E]">
            {selectedItems.length} item(s) selected
          </span>
        )}
      </div>
      
      <div className="admin-list__table bg-white rounded-md border border-[#E4E7EB] overflow-hidden mb-4">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8F9FA] border-b border-[#E4E7EB]">
              <tr>
                <th className="px-4 py-3 text-left">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === admins.length && admins.length > 0}
                      onChange={handleSelectAll}
                      className="mr-2 rounded border-[#E4E7EB]"
                    />
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-semibold text-sm text-[#49617E]">Admin ID</th>
                <th 
                  className="px-4 py-3 text-left font-semibold text-sm text-[#49617E] cursor-pointer"
                  onClick={() => handleSort('fullName')}
                >
                  <div className="flex items-center">
                    Admin Name {getSortIndicator('fullName')}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left font-semibold text-sm text-[#49617E] cursor-pointer"
                  onClick={() => handleSort('username')}
                >
                  <div className="flex items-center">
                    Admin User Name {getSortIndicator('username')}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left font-semibold text-sm text-[#49617E] cursor-pointer"
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center">
                    Email Address {getSortIndicator('email')}
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
                <th className="px-4 py-3 text-center font-semibold text-sm text-[#49617E]">Action</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id} className="border-b border-[#E4E7EB] hover:bg-[#F8F9FA]">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(admin.id)}
                      onChange={() => handleSelectItem(admin.id)}
                      className="rounded border-[#E4E7EB]"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-[#49617E]">#{admin.id}</td>
                  <td className="px-4 py-3 text-sm text-[#49617E]">{admin.fullName}</td>
                  <td className="px-4 py-3 text-sm text-[#49617E]">{admin.username}</td>
                  <td className="px-4 py-3 text-sm text-[#49617E]">{admin.email}</td>
                  <td className="px-4 py-3">
                    <RoleBadge role={admin.role} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={admin.status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-[#49617E]">
                    {new Date(admin.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <Link 
                        href={`/admin/administration/${admin.id}`}
                        className="text-[#49617E] hover:text-[#007BF9] transition p-1 bg-[#F5F7FA] rounded"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(admin.id)}
                        className="text-[#49617E] hover:text-[#F85464] transition p-1 bg-[#F5F7FA] rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {admins.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-[#6F8591]">
                    No admin users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="admin-list__pagination flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="admin-list__per-page flex items-center gap-2">
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
        
        <div className="admin-list__page-nav flex items-center gap-1">
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

export default AdminList;