'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { toast } from 'react-toastify';
import Button from '@/components/ui/Button';
import { PrintOptionGroup } from '@/types/print-options';
import React from 'react';

interface PrintOptionListProps {
  initialPrintOptions: PrintOptionGroup[];
  initialTotal: number;
}

const PrintOptionList: React.FC<PrintOptionListProps> = ({ 
  initialPrintOptions,
  initialTotal
}) => {
  const [printOptions, setPrintOptions] = useState<PrintOptionGroup[]>(initialPrintOptions);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [total, setTotal] = useState(initialTotal);

  // Bulk action handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(printOptions.map(option => option.id));
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

    const confirmed = window.confirm(`Are you sure you want to delete ${selectedItems.length} selected items?`);
    if (!confirmed) return;

    try {
      // API call would go here
      
      // Update the UI
      setPrintOptions(printOptions.filter(option => !selectedItems.includes(option.id)));
      setSelectedItems([]);
      toast.success(`Successfully deleted ${selectedItems.length} items`);
    } catch (error) {
      toast.error('Failed to delete items');
    }
  };

  // Individual delete handler
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this print option group?');
    if (!confirmed) return;

    try {
      // API call would go here
      
      // Update the UI
      setPrintOptions(printOptions.filter(option => option.id !== id));
      toast.success('Print option group deleted successfully');
    } catch (error) {
      toast.error('Failed to delete print option group');
    }
  };

  // Search handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // API call would go here for server-side filtering
    
    // For now, just simulate filtering on client side
    if (searchQuery.trim() === '') {
      setPrintOptions(initialPrintOptions);
    } else {
      const filtered = initialPrintOptions.filter(option => 
        option.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        option.assignedProducts.some(product => 
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setPrintOptions(filtered);
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

  return (
    <div className="print-option-list">
      <div className="print-option-list__header mb-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="print-option-list__search flex-1 max-w-md">
          <form onSubmit={handleSearch} className="flex">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F8591]" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or product..."
                className="w-full pl-10 pr-4 py-2 border border-[#E4E7EB] rounded-l-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9] text-sm"
              />
            </div>
            <Button type="submit" size="md" className="rounded-l-none">
              Search
            </Button>
          </form>
        </div>
        
        <div className="print-option-list__actions flex gap-3">
          <Link href="/admin/print-options/new">
            <Button leftIcon={<Plus size={16} />}>
              Add New Print Option
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="print-option-list__bulk-actions mb-4 flex items-center gap-4">
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
      
      <div className="print-option-list__table bg-white rounded-md border border-[#E4E7EB] overflow-hidden mb-4">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8F9FA] border-b border-[#E4E7EB]">
              <tr>
                <th className="px-4 py-3 text-left">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === printOptions.length && printOptions.length > 0}
                      onChange={handleSelectAll}
                      className="mr-2 rounded border-[#E4E7EB]"
                    />
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-semibold text-sm text-[#49617E]">Print Option Group Name</th>
                <th className="px-4 py-3 text-left font-semibold text-sm text-[#49617E]">Assigned To</th>
                <th className="px-4 py-3 text-left font-semibold text-sm text-[#49617E]">Created At</th>
                <th className="px-4 py-3 text-left font-semibold text-sm text-[#49617E]">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-sm text-[#49617E]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {printOptions.map((printOption) => (
                <tr key={printOption.id} className="border-b border-[#E4E7EB] hover:bg-[#F8F9FA]">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(printOption.id)}
                      onChange={() => handleSelectItem(printOption.id)}
                      className="rounded border-[#E4E7EB]"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Link 
                      href={`/admin/print-options/${printOption.id}`}
                      className="text-[#007BF9] hover:underline font-medium"
                    >
                      {printOption.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {printOption.assignedProducts.map((product, index) => (
                        <span 
                          key={product.id} 
                          className="inline-block bg-[#DCE8F8] text-[#007BF9] px-2 py-0.5 rounded-full text-xs"
                        >
                          {product.name}
                          {index < printOption.assignedProducts.length - 1 && ", "}
                        </span>
                      ))}
                      {printOption.assignedProducts.length === 0 && (
                        <span className="text-[#6F8591] text-sm">Not assigned</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#49617E]">
                    {new Date(printOption.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      printOption.status === 'published' 
                        ? 'bg-[#E6F6EE] text-[#0D894F]' 
                        : 'bg-[#FFF4EB] text-[#E46A11]'
                    }`}>
                      {printOption.status === 'published' ? 'Published' : 'Unpublished'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link 
                        href={`/admin/print-options/${printOption.id}`}
                        className="text-[#49617E] hover:text-[#007BF9] transition"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(printOption.id)}
                        className="text-[#49617E] hover:text-[#F85464] transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {printOptions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[#6F8591]">
                    No print options found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="print-option-list__pagination flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="print-option-list__per-page flex items-center gap-2">
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
        
        <div className="print-option-list__page-nav flex items-center gap-1">
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

export default PrintOptionList;