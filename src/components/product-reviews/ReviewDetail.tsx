'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Save, 
  User, 
  Mail, 
  Calendar, 
  Send, 
  ExternalLink,
  ChevronLeft
} from 'lucide-react';
import { toast } from 'react-toastify';
import Button from '@/components/ui/Button';
import { ProductReview, ReviewActivityLog, ReviewReply } from '@/types/products';

interface ReviewDetailProps {
  review: ProductReview;
  onStatusUpdate: (reviewId: string, status: string) => Promise<void>;
  onReplySubmit: (reviewId: string, replyText: string) => Promise<void>;
}

const ReviewDetail: React.FC<ReviewDetailProps> = ({
  review,
  onStatusUpdate,
  onReplySubmit
}) => {
  const [status, setStatus] = useState(review.status);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  // Handle status update
  const handleStatusUpdate = async () => {
    if (status === review.status) {
      toast.info('Status not changed');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onStatusUpdate(review.id, status);
      toast.success('Review status updated successfully');
    } catch (error) {
      console.error('Error updating review status:', error);
      toast.error('Failed to update review status');
      // Revert to original status on error
      setStatus(review.status);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle reply submission
  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!replyText.trim()) {
      toast.warning('Reply text cannot be empty');
      return;
    }
    
    setIsReplying(true);
    
    try {
      await onReplySubmit(review.id, replyText);
      toast.success('Reply submitted successfully');
      setReplyText('');
    } catch (error) {
      console.error('Error submitting reply:', error);
      toast.error('Failed to submit reply');
    } finally {
      setIsReplying(false);
    }
  };

  // Helper to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper for status badge style
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

  // Helper to get action text for activity log
  const getActionText = (action: string) => {
    switch (action) {
      case 'status_update':
        return 'Status updated';
      case 'reply_added':
        return 'Reply added';
      case 'created':
        return 'Review submitted';
      default:
        return action;
    }
  };

  return (
    <div className="review-detail">
      <div className="review-detail__back mb-6">
        <Link 
          href="/admin/products/reviews" 
          className="inline-flex items-center text-[#49617E] hover:text-[#007BF9] transition"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to Reviews
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Review and User Details) */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Info Card */}
          <div className="bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
            <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4">
              <h2 className="text-[#2B4F60] font-semibold">User Information</h2>
            </div>
            <div className="p-6">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-[#DCE8F8] flex items-center justify-center text-[#007BF9] mr-4">
                  <User size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                    <div>
                      <h3 className="text-[#2B4F60] font-medium flex items-center">
                        {review.userName}
                        {review.userType === 'guest' && (
                          <span className="ml-2 text-xs font-normal text-white bg-[#FFB02C] px-2 py-0.5 rounded">
                            Guest
                          </span>
                        )}
                      </h3>
                      <div className="flex items-center text-[#6F8591] text-sm mt-1">
                        <Mail size={14} className="mr-1" />
                        {review.userEmail}
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-0 text-sm text-[#6F8591] flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {formatDate(review.createdAt)}
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <div className="flex mr-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg 
                          key={star} 
                          className={`w-5 h-5 ${star <= review.rating ? 'text-[#FFB02C]' : 'text-[#E0E0E0]'}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm font-medium text-[#2B4F60]">
                      {review.rating}/5
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-[#49617E] whitespace-pre-wrap">
                      {review.reviewText}
                    </p>
                  </div>
                  
                  {review.images && review.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {review.images.map((image, index) => (
                        <div 
                          key={index} 
                          className="w-20 h-20 relative border border-[#E4E7EB] rounded-md overflow-hidden"
                        >
                          <Image
                            src={image}
                            alt={`Review image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Status Update Card */}
          <div className="bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
            <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4">
              <h2 className="text-[#2B4F60] font-semibold">Update Review Status</h2>
            </div>
            <div className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-full sm:w-auto flex-1">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'pending' | 'approved' | 'disapproved' | 'spam')}
                    className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="disapproved">Disapproved</option>
                    <option value="spam">Spam</option>
                  </select>
                </div>
                <Button
                  onClick={handleStatusUpdate}
                  leftIcon={<Save size={16} />}
                  isLoading={isSubmitting}
                  disabled={status === review.status}
                >
                  Save Status
                </Button>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-[#49617E] mr-2">Current Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(review.status)}`}>
                    {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Reply Form Card */}
          <div className="bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
            <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4">
              <h2 className="text-[#2B4F60] font-semibold">Reply to Review</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleReplySubmit}>
                <div className="mb-4">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write your reply here..."
                    className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                    rows={4}
                    required
                  ></textarea>
                </div>
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    leftIcon={<Send size={16} />}
                    isLoading={isReplying}
                  >
                    Send Reply
                  </Button>
                </div>
              </form>
              
              {/* Previous Replies */}
              {review.replies && review.replies.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-[#2B4F60] font-medium mb-3">Previous Replies</h3>
                  <div className="space-y-4">
                    {review.replies.map((reply) => (
                      <div key={reply.id} className="border border-[#E4E7EB] rounded-md p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-sm font-medium text-[#2B4F60]">{reply.userName}</span>
                            <span className="ml-2 text-xs bg-[#DCE8F8] text-[#007BF9] px-2 py-0.5 rounded">
                              {reply.userRole}
                            </span>
                          </div>
                          <span className="text-xs text-[#6F8591]">
                            {formatDate(reply.createdAt)}
                          </span>
                        </div>
                        <p className="text-[#49617E] text-sm">{reply.replyText}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Activity Log Card */}
          {review.activityLog && review.activityLog.length > 0 && (
            <div className="bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
              <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4">
                <h2 className="text-[#2B4F60] font-semibold">Activity Log</h2>
              </div>
              <div className="p-6">
                <div className="relative">
                  {review.activityLog.map((activity, index) => (
                    <div key={activity.id} className="flex mb-4 last:mb-0">
                      <div className="mr-4 relative">
                        <div className="w-8 h-8 rounded-full bg-[#DCE8F8] flex items-center justify-center text-[#007BF9] z-10 relative">
                          {activity.action === 'status_update' && <Save size={16} />}
                          {activity.action === 'reply_added' && <Send size={16} />}
                          {activity.action === 'created' && <User size={16} />}
                        </div>
                        {index !== review.activityLog.length - 1 && (
                          <div className="absolute top-8 left-1/2 w-px h-full bg-[#E4E7EB] -translate-x-1/2"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                          <span className="text-sm font-medium text-[#2B4F60]">
                            {getActionText(activity.action)}
                          </span>
                          <span className="text-xs text-[#6F8591]">
                            {formatDate(activity.performedAt)}
                          </span>
                        </div>
                        <p className="text-[#49617E] text-sm">
                          {activity.details}
                        </p>
                        <p className="text-[#6F8591] text-xs mt-1">
                          By: {activity.performedBy}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Right Column (Product Details) */}
        <div className="space-y-6">
          <div className="bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
            <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4">
              <h2 className="text-[#2B4F60] font-semibold">Product Details</h2>
            </div>
            <div className="p-6">
              <div className="flex flex-col items-center">
                <div className="w-full h-48 relative mb-4">
                  <Image
                    src={review.productImage}
                    alt={review.productName}
                    fill
                    className="object-contain"
                  />
                </div>
                
                <h3 className="text-[#2B4F60] font-medium text-center mb-2">
                  {review.productName}
                </h3>
                
                <Link 
                  href={`/admin/products/${review.productId}`}
                  className="text-[#007BF9] hover:underline text-sm flex items-center mb-4"
                >
                  View Product <ExternalLink size={14} className="ml-1" />
                </Link>
                
                <div className="flex items-center justify-center mb-2">
                  <div className="flex mr-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg 
                        key={star} 
                        className="w-5 h-5 text-[#FFB02C]" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-[#49617E]">
                    4.5 out of 5 (230 reviews)
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 w-full mt-2">
                  <div className="bg-[#F5F7FA] p-3 rounded-md text-center">
                    <div className="text-sm text-[#6F8591]">Price</div>
                    <div className="text-[#2B4F60] font-medium">$29.99</div>
                  </div>
                  <div className="bg-[#F5F7FA] p-3 rounded-md text-center">
                    <div className="text-sm text-[#6F8591]">Stock</div>
                    <div className="text-[#30BF89] font-medium">In Stock</div>
                  </div>
                </div>
                
                <Link 
                  href={`/admin/products/${review.productId}`}
                  className="mt-4 block w-full"
                >
                  <Button variant="outline" fullWidth>
                    Edit Product
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
            <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4">
              <h2 className="text-[#2B4F60] font-semibold">Other Reviews</h2>
            </div>
            <div className="p-6">
              <p className="text-[#6F8591] text-center">
                This product has 230 reviews with an average rating of 4.5/5.
              </p>
              <div className="mt-4">
                <Link href={`/admin/products/reviews?product=${review.productId}`}>
                  <Button variant="outline" fullWidth>
                    View All Reviews for This Product
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetail;