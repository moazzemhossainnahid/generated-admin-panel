'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, 
  Eye, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Filter
} from 'lucide-react';
import { toast } from 'react-toastify';
import Button from '@/components/ui/Button';
import { ProductReview } from '@/types/products';

interface ReviewListProps {
  initialReviews: ProductReview[];
  initialTotal: number;
}

const ReviewList: React.FC<ReviewListProps> = ({ 
  initialReviews,
  initialTotal
}) => {
  const [reviews, setReviews] = useState<ProductReview[]>(initialReviews);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'disapproved' | 'spam'>('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [total, setTotal] = useState(initialTotal);

  // Bulk action handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(reviews.map(review => review.id));
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

  const handleBulkAction = async (action: 'approve' | 'disapprove' | 'delete') => {
    if (selectedItems.length === 0) {
      toast.warning('No items selected');
      return;
    }

    const actionText = {
      'approve': 'approve',
      'disapprove': 'disapprove',
      'delete': 'delete'
    }[action];

    const confirmed = window.confirm(`Are you sure you want to ${actionText} ${selectedItems.length} selected reviews?`);
    if (!confirmed) return;

    try {
      // API call would go here
      
      // Update the UI based on the action
      if (action === 'delete') {
        setReviews(reviews.filter(review => !selectedItems.includes(review.id)));
        toast.success(`Successfully deleted ${selectedItems.length} reviews`);
      } else {
        const newStatus = action === 'approve' ? 'approved' : 'disapproved';
        const updatedReviews = reviews.map(review => {
          if (selectedItems.includes(review.id)) {
            return { ...review, status: newStatus };
          }
          return review;
        });
        setReviews(updatedReviews);
        toast.success(`Successfully ${actionText}d ${selectedItems.length} reviews`);
      }
      
      setSelectedItems([]);
    } catch (error) {
      toast.error(`Failed to ${actionText} reviews`);
    }
  };

  // Individual delete handler
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this review?');
    if (!confirmed) return;

    try {
      // API call would go here
      
      // Update the UI
      setReviews(reviews.filter(review => review.id !== id));
      toast.success('Review deleted successfully');
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  // Search handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // API call would go here for server-side filtering
    
    // For now, just simulate filtering on client side
    if (searchQuery.trim() === '') {
      setReviews(initialReviews.filter(review => {
        if (statusFilter === 'all') return true;
        return review.status === statusFilter;
      }));
    } else {
      const filtered = initialReviews.filter(review => {
        const matchesSearch = 
          review.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          review.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
          review.reviewText.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' ? true : review.status === statusFilter;
        
        return matchesSearch && matchesStatus;
      });
      setReviews(filtered);
    }
  };

  // Status filter handler
  const handleStatusFilter = (status: 'all' | 'pending' | 'approved' | 'disapproved' | 'spam') => {
    setStatusFilter(status);
    
    if (searchQuery.trim() === '') {
      setReviews(initialReviews.filter(review => {
        if (status === 'all') return true;
        return review.status === status;
      }));
    } else {
      const filtered = initialReviews.filter(review => {
        const matchesSearch = 
          review.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          review.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
          review.reviewText.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesStatus = status === 'all' ? true : review.status === status;
        
        return matchesSearch && matchesStatus;
      });
      setReviews(filtered);
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

  // Helper to truncate text
  const truncateText = (text: string, limit = 100) => {
    if (text.length <= limit) return text;
    return text.slice(0, limit) + '...';
  };

  // Helper to get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-[#E6F6EE] text-[#30BF89]';
      case 'pending':
        return 'bg-[#FFF4EB] text-[#FFB02C]';
      case 'disapproved':
        return 'bg-[#FFEBEE] text-[#F85464]';
      case 'spam':
        return 'bg-[#F5F5F5] text-[#828282]';
      default:
        return 'bg-[#F5F5F5] text-[#49617E]';
    }
  };

  return (
    <div className="review-list">
      <div className="review-list__header mb-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="review-list__search flex-1 max-w-md">
          <form onSubmit={handleSearch} className="flex">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F8591]" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by user, email or review content..."
                className="w-full pl-10 pr-4 py-2 border border-[#E4E7EB] rounded-l-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9] text-sm"
              />
            </div>
            <Button type="submit" size="md" className="rounded-l-none">
              Search
            </Button>
          </form>
        </div>
        
        <div className="review-list__filters flex flex-wrap gap-2">
          <Button 
            variant={statusFilter === 'all' ? 'primary' : 'outline'} 
            size="sm" 
            onClick={() => handleStatusFilter('all')}
          >
            All
          </Button>
          <Button 
            variant={statusFilter === 'pending' ? 'primary' : 'outline'} 
            size="sm" 
            onClick={() => handleStatusFilter('pending')}
          >
            Pending
          </Button>
          <Button 
            variant={statusFilter === 'approved' ? 'primary' : 'outline'} 
            size="sm" 
            onClick={() => handleStatusFilter('approved')}
          >
            Approved
          </Button>
          <Button 
            variant={statusFilter === 'disapproved' ? 'primary' : 'outline'} 
            size="sm" 
            onClick={() => handleStatusFilter('disapproved')}
          >
            Disapproved
          </Button>
        </div>
      </div>
      
      <div className="review-list__bulk-actions mb-4 flex items-center gap-4">
        <select 
          className="bulk-action-select border border-[#E4E7EB] bg-white rounded-md px-3 py-2 text-sm text-[#333333] focus:outline-none focus:ring-1 focus:ring-[#007BF9]"
          disabled={selectedItems.length === 0}
          defaultValue=""
          onChange={(e) => {
            const action = e.target.value as 'approve' | 'disapprove' | 'delete';
            if (action) {
              handleBulkAction(action);
              e.target.value = '';
            }
          }}
        >
          <option value="" disabled>Bulk Actions</option>
          <option value="approve">Approve Selected</option>
          <option value="disapprove">Disapprove Selected</option>
          <option value="delete">Delete Selected</option>
        </select>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => {
            const select = document.querySelector('.bulk-action-select') as HTMLSelectElement;
            const action = select.value as 'approve' | 'disapprove' | 'delete';
            if (action) {
              handleBulkAction(action);
              select.value = '';
            } else {
              toast.warning('Please select an action');
            }
          }}
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
      
      <div className="review-list__table bg-white rounded-md border border-[#E4E7EB] overflow-hidden mb-4">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8F9FA] border-b border-[#E4E7EB]">
              <tr>
                <th className="px-4 py-3 text-left">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === reviews.length && reviews.length > 0}
                      onChange={handleSelectAll}
                      className="mr-2 rounded border-[#E4E7EB]"
                    />
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-semibold text-sm text-[#49617E]">Product</th>
                <th className="px-4 py-3 text-left font-semibold text-sm text-[#49617E]">User</th>
                <th className="px-4 py-3 text-left font-semibold text-sm text-[#49617E]">Star</th>
                <th className="px-4 py-3 text-left font-semibold text-sm text-[#49617E]">Review Text</th>
                <th className="px-4 py-3 text-left font-semibold text-sm text-[#49617E]">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-sm text-[#49617E]">Created At</th>
                <th className="px-4 py-3 text-left font-semibold text-sm text-[#49617E]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.id} className="border-b border-[#E4E7EB] hover:bg-[#F8F9FA]">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(review.id)}
                      onChange={() => handleSelectItem(review.id)}
                      className="rounded border-[#E4E7EB]"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="w-12 h-12 mr-3 relative">
                        <Image
                          src={review.productImage}
                          alt={review.productName}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <span className="text-sm text-[#49617E]">{review.productName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[#2B4F60]">
                        {review.userName}
                        {review.userType === 'guest' && (
                          <span className="ml-1 text-xs font-normal text-white bg-[#FFB02C] px-1.5 py-0.5 rounded">
                            Guest
                          </span>
                        )}
                      </span>
                      <span className="text-xs text-[#6F8591]">{review.userEmail}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg 
                          key={star} 
                          className={`w-4 h-4 ${star <= review.rating ? 'text-[#FFB02C]' : 'text-[#E0E0E0]'}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-[#49617E]">
                      {truncateText(review.reviewText)}
                    </p>
                    {review.images && review.images.length > 0 && (
                      <div className="flex mt-1 space-x-1">
                        {review.images.slice(0, 3).map((image, index) => (
                          <div key={index} className="w-6 h-6 relative">
                            <Image
                              src={image}
                              alt={`Review image ${index + 1}`}
                              fill
                              className="object-cover rounded-sm"
                            />
                          </div>
                        ))}
                        {review.images.length > 3 && (
                          <div className="w-6 h-6 bg-[#F5F5F5] rounded-sm flex items-center justify-center text-[#6F8591] text-xs">
                            +{review.images.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(review.status)}`}>
                      {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#49617E]">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link 
                        href={`/admin/products/reviews/${review.id}`}
                        className="p-1 text-[#49617E] hover:text-[#007BF9] transition rounded-full hover:bg-[#F5F5F5]"
                      >
                        <Eye size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="p-1 text-[#49617E] hover:text-[#F85464] transition rounded-full hover:bg-[#F5F5F5]"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {reviews.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-[#6F8591]">
                    No reviews found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="review-list__pagination flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="review-list__per-page flex items-center gap-2">
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
        
        <div className="review-list__page-nav flex items-center gap-1">
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

export default ReviewList;