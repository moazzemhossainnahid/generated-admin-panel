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
  ChevronRight,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { toast } from 'react-toastify';
import Button from '@/components/ui/Button';
import { ProductTag } from '@/types/products';
import React from 'react';

interface TagListProps {
  initialTags: ProductTag[];
  initialTotal: number;
}

const TagList: React.FC<TagListProps> = ({ 
  initialTags,
  initialTotal
}) => {
  const [tags, setTags] = useState<ProductTag[]>(initialTags);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [total, setTotal] = useState(initialTotal);
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Bulk action handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(tags.map(tag => tag.id));
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

    const confirmed = window.confirm(`Are you sure you want to delete ${selectedItems.length} selected tags?`);
    if (!confirmed) return;

    try {
      // API call would go here
      
      // Update the UI
      setTags(tags.filter(tag => !selectedItems.includes(tag.id)));
      setSelectedItems([]);
      toast.success(`Successfully deleted ${selectedItems.length} tags`);
    } catch (error) {
      toast.error('Failed to delete tags');
    }
  };

  // Individual delete handler
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this tag?');
    if (!confirmed) return;

    try {
      // API call would go here
      
      // Update the UI
      setTags(tags.filter(tag => tag.id !== id));
      toast.success('Tag deleted successfully');
    } catch (error) {
      toast.error('Failed to delete tag');
    }
  };

  // Search handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // API call would go here for server-side filtering
    
    // For now, just simulate filtering on client side
    if (searchQuery.trim() === '') {
      setTags(initialTags);
    } else {
      const filtered = initialTags.filter(tag => 
        tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tag.slug.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setTags(filtered);
    }
  };

  // Sorting handler
  const handleSort = (field: string) => {
    const newOrder = field === sortField && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newOrder);
    
    // Sort the tags
    const sortedTags = [...tags].sort((a, b) => {
      if (field === 'id') {
        return newOrder === 'asc' 
          ? a.id.localeCompare(b.id) 
          : b.id.localeCompare(a.id);
      } else if (field === 'name') {
        return newOrder === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      } else if (field === 'slug') {
        return newOrder === 'asc' 
          ? a.slug.localeCompare(b.slug) 
          : b.slug.localeCompare(a.slug);
      } else if (field === 'createdAt') {
        return newOrder === 'asc' 
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() 
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });
    
    setTags(sortedTags);
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

  return (
    <div className="tag-list">
      <div className="tag-list__header mb-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="tag-list__search flex-1 max-w-md">
          <form onSubmit={handleSearch} className="flex">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F8591]" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or slug..."
                className="w-full pl-10 pr-4 py-2 border border-[#E4E7EB] rounded-l-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9] text-sm"
              />
            </div>
            <Button type="submit" size="md" className="rounded-l-none">
              Search
            </Button>
          </form>
        </div>
        
        <div className="tag-list__actions flex gap-3">
          <Link href="/admin/products/tags/new">
            <Button leftIcon={<Plus size={16} />}>
              Add New Tag
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="tag-list__bulk-actions mb-4 flex items-center gap-4">
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
      
      <div className="tag-list__table bg-white rounded-md border border-[#E4E7EB] overflow-hidden mb-4">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8F9FA] border-b border-[#E4E7EB]">
              <tr>
                <th className="px-4 py-3 text-left">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === tags?.length && tags.length > 0}
                      onChange={handleSelectAll}
                      className="mr-2 rounded border-[#E4E7EB]"
                    />
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left font-semibold text-sm text-[#49617E] cursor-pointer"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center">
                    ID {getSortIndicator('id')}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left font-semibold text-sm text-[#49617E] cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Name {getSortIndicator('name')}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left font-semibold text-sm text-[#49617E] cursor-pointer"
                  onClick={() => handleSort('slug')}
                >
                  <div className="flex items-center">
                    Slug {getSortIndicator('slug')}
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
              {tags?.map((tag) => (
                <tr key={tag.id} className="border-b border-[#E4E7EB] hover:bg-[#F8F9FA]">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(tag.id)}
                      onChange={() => handleSelectItem(tag.id)}
                      className="rounded border-[#E4E7EB]"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-[#49617E]">{tag.id}</td>
                  <td className="px-4 py-3">
                    <Link 
                      href={`/admin/products/tags/${tag.id}`}
                      className="text-[#007BF9] hover:underline font-medium"
                    >
                      {tag.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#49617E]">{tag.slug}</td>
                  <td className="px-4 py-3 text-sm text-[#49617E]">
                    {new Date(tag.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link 
                        href={`/admin/products/tags/${tag.id}`}
                        className="text-[#49617E] hover:text-[#007BF9] transition"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(tag.id)}
                        className="text-[#49617E] hover:text-[#F85464] transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {tags?.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[#6F8591]">
                    No tags found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="tag-list__pagination flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="tag-list__per-page flex items-center gap-2">
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
        
        <div className="tag-list__page-nav flex items-center gap-1">
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

export default TagList;