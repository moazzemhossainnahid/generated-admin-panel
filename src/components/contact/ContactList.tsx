'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Eye, 
  Trash2
} from 'lucide-react';
import { toast } from 'react-toastify';
import Button from '@/components/ui/Button';
import { ContactSubmission } from '@/types/contact';

interface ContactListProps {
  initialContacts: ContactSubmission[];
  initialTotal: number;
}

const ContactList: React.FC<ContactListProps> = ({ 
  initialContacts,
  initialTotal
}) => {
  const [contacts, setContacts] = useState<ContactSubmission[]>(initialContacts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [total, setTotal] = useState(initialTotal);
  const [bulkAction, setBulkAction] = useState<string>('');

  // Bulk action handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(contacts.map(contact => contact.id));
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
      if (bulkAction === 'mark-as-read') {
        // Update status to "Resolved" for selected items
        const updatedContacts = contacts.map(contact => 
          selectedItems.includes(contact.id) 
            ? { ...contact, status: 'Resolved' as const } 
            : contact
        );
        setContacts(updatedContacts);
        toast.success(`${selectedItems.length} contacts marked as read`);
      } else if (bulkAction === 'move-to-trash') {
        // Remove selected items from the list
        setContacts(contacts.filter(contact => !selectedItems.includes(contact.id)));
        toast.success(`${selectedItems.length} contacts moved to trash`);
      }
      
      setSelectedItems([]);
      setBulkAction('');
    } catch (error) {
      toast.error('Failed to perform bulk action');
    }
  };

  // Individual delete handler
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this contact submission?');
    if (!confirmed) return;

    try {
      // API call would go here
      
      // Update the UI
      setContacts(contacts.filter(contact => contact.id !== id));
      toast.success('Contact submission moved to trash');
    } catch (error) {
      toast.error('Failed to delete contact submission');
    }
  };

  // Search handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // API call would go here for server-side filtering
    
    // For now, just simulate filtering on client side
    if (searchQuery.trim() === '') {
      setContacts(initialContacts);
    } else {
      const filtered = initialContacts.filter(contact => 
        contact.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.subject.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setContacts(filtered);
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

  // Status badge component
  const StatusBadge = ({ status }: { status: ContactSubmission['status'] }) => {
    let bgColor = '';
    let textColor = '';
    
    switch (status) {
      case 'Resolved':
        bgColor = 'bg-[#E6F6EE]';
        textColor = 'text-[#30BF89]';
        break;
      case 'Closed':
        bgColor = 'bg-[#F5F5F5]';
        textColor = 'text-[#6F8591]';
        break;
      case 'In Progress':
        bgColor = 'bg-[#FFF4EB]';
        textColor = 'text-[#E46A11]';
        break;
      case 'Spam':
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

  return (
    <div className="contact-list">
      <div className="contact-list__header mb-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="contact-list__bulk-actions flex items-center gap-2">
          <select 
            value={bulkAction}
            onChange={handleBulkActionChange}
            className="bulk-action-select border border-[#E4E7EB] bg-white rounded-md px-3 py-2 text-sm text-[#333333] focus:outline-none focus:ring-1 focus:ring-[#007BF9]"
          >
            <option value="">Bulk Actions</option>
            <option value="mark-as-read">Mark as Read</option>
            <option value="move-to-trash">Move to Trash</option>
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
        
        <div className="contact-list__search flex-1 max-w-md ml-auto">
          <form onSubmit={handleSearch} className="flex">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F8591]" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email or subject..."
                className="w-full pl-10 pr-4 py-2 border border-[#E4E7EB] rounded-l-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9] text-sm"
              />
            </div>
            <Button type="submit" size="md" className="rounded-l-none">
              Search
            </Button>
          </form>
        </div>
      </div>
      
      <div className="contact-list__table bg-white rounded-md border border-[#E4E7EB] overflow-hidden mb-4">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8F9FA] border-b border-[#E4E7EB]">
              <tr>
                <th className="px-4 py-3 text-left">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === contacts.length && contacts.length > 0}
                      onChange={handleSelectAll}
                      className="mr-2 rounded border-[#E4E7EB]"
                    />
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-semibold text-sm text-[#49617E]">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-sm text-[#49617E]">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-sm text-[#49617E]">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-sm text-[#49617E]">Subject</th>
                <th className="px-4 py-3 text-left font-semibold text-sm text-[#49617E]">Created At</th>
                <th className="px-4 py-3 text-center font-semibold text-sm text-[#49617E]">Action</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.id} className="border-b border-[#E4E7EB] hover:bg-[#F8F9FA]">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(contact.id)}
                      onChange={() => handleSelectItem(contact.id)}
                      className="rounded border-[#E4E7EB]"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-[#49617E]">{contact.fullName}</td>
                  <td className="px-4 py-3 text-sm text-[#49617E]">{contact.email}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={contact.status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-[#49617E] max-w-xs truncate">
                    {contact.subject}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#49617E]">
                    {new Date(contact.submittedAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <Link 
                        href={`/admin/contact/${contact.id}`}
                        className="text-[#49617E] hover:text-[#007BF9] transition p-1 bg-[#F5F7FA] rounded"
                      >
                        <Eye size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(contact.id)}
                        className="text-[#49617E] hover:text-[#F85464] transition p-1 bg-[#F5F7FA] rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {contacts.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-[#6F8591]">
                    No contact submissions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="contact-list__pagination flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="contact-list__per-page flex items-center gap-2">
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
        
        <div className="contact-list__page-nav flex items-center gap-1">
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

export default ContactList;