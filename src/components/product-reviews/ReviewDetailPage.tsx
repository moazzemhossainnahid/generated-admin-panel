'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, Edit2 } from 'lucide-react';
import { toast } from 'react-toastify';
import ReviewDetail from '@/components/product-reviews/ReviewDetail';
import { ProductReview } from '@/types/products';

// Mock data for demonstration
const mockReviews: Record<string, ProductReview> = {
  'review-1': {
    id: 'review-1',
    productId: 'product-1',
    productName: 'Christmas Gift Stickers',
    productImage: '/images/christmas-card.jpg',
    userId: 'user-1',
    userName: 'Maxin Riley',
    userEmail: 'maxinriley@gmail.com',
    userType: 'registered',
    rating: 4,
    reviewText: 'Very enthusiastic support! Excellent code is written, it\'s a true pleasure working with. Excellent code is written, it\'s a true pleasure working with. Excellent code is written, it\'s a true pleasure working with.',
    images: ['/images/christmas-card.jpg', '/images/christmas-card.jpg', '/images/christmas-card.jpg'],
    status: 'approved',
    createdAt: '2025-02-20T10:30:00Z',
    updatedAt: '2025-02-20T10:30:00Z',
    replies: [
      {
        id: 'reply-1',
        reviewId: 'review-1',
        userId: 'admin-1',
        userName: 'Admin User',
        userRole: 'Admin',
        replyText: 'Thank you for your kind words! We\'re glad you enjoyed our service.',
        createdAt: '2025-02-20T11:30:00Z'
      }
    ],
    activityLog: [
      {
        id: 'activity-1',
        reviewId: 'review-1',
        action: 'created',
        details: 'Review was submitted by customer',
        performedBy: 'Maxin Riley',
        performedAt: '2025-02-20T10:30:00Z'
      },
      {
        id: 'activity-2',
        reviewId: 'review-1',
        action: 'status_update',
        details: 'Status changed from pending to approved',
        performedBy: 'Admin User',
        performedAt: '2025-02-20T10:45:00Z'
      },
      {
        id: 'activity-3',
        reviewId: 'review-1',
        action: 'reply_added',
        details: 'Admin reply was added',
        performedBy: 'Admin User',
        performedAt: '2025-02-20T11:30:00Z'
      }
    ]
  },
  'review-2': {
    id: 'review-2',
    productId: 'product-1',
    productName: 'Christmas Card',
    productImage: '/images/christmas-card.jpg',
    userId: 'user-2',
    userName: 'Maxin Riley',
    userEmail: 'maxinriley@gmail.com',
    userType: 'registered',
    rating: 4,
    reviewText: 'Very enthusiastic support! It\'s a true pleasure working with them.',
    status: 'pending',
    createdAt: '2025-02-19T11:45:00Z',
    updatedAt: '2025-02-19T11:45:00Z',
    activityLog: [
      {
        id: 'activity-1',
        reviewId: 'review-2',
        action: 'created',
        details: 'Review was submitted by customer',
        performedBy: 'Maxin Riley',
        performedAt: '2025-02-19T11:45:00Z'
      }
    ]
  }
};

export default function ReviewDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [review, setReview] = useState<ProductReview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call with a delay
    const fetchData = async () => {
      try {
        // In a real app, you would fetch from your API
        // const response = await fetch(`/api/product-reviews/${params.id}`);
        // const data = await response.json();
        
        // For now, use mock data
        setTimeout(() => {
          const reviewData = mockReviews[params.id];
          if (reviewData) {
            setReview(reviewData);
          } else {
            // Handle not found case
            toast.error('Review not found');
            router.push('/admin/products/reviews');
          }
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching review:', error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [params.id, router]);

  // Handle status update
  const handleStatusUpdate = async (reviewId: string, status: string) => {
    try {
      // In a real app, you would make an API call
      // await fetch(`/api/product-reviews/${reviewId}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status })
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the UI
      if (review) {
        // Create a new activity log entry
        const newActivity = {
          id: `activity-${Date.now()}`,
          reviewId,
          action: 'status_update',
          details: `Status changed from ${review.status} to ${status}`,
          performedBy: 'Admin User',
          performedAt: new Date().toISOString()
        };
        
        setReview({
          ...review,
          status: status as 'pending' | 'approved' | 'disapproved' | 'spam',
          updatedAt: new Date().toISOString(),
          activityLog: [...(review.activityLog || []), newActivity]
        });
      }
    } catch (error) {
      console.error('Error updating review status:', error);
      throw error;
    }
  };

  // Handle reply submission
  const handleReplySubmit = async (reviewId: string, replyText: string) => {
    try {
      // In a real app, you would make an API call
      // await fetch(`/api/product-reviews/${reviewId}/replies`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ replyText })
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the UI
      if (review) {
        // Create a new reply
        const newReply = {
          id: `reply-${Date.now()}`,
          reviewId,
          userId: 'admin-1',
          userName: 'Admin User',
          userRole: 'Admin',
          replyText,
          createdAt: new Date().toISOString()
        };
        
        // Create a new activity log entry
        const newActivity = {
          id: `activity-${Date.now()}`,
          reviewId,
          action: 'reply_added',
          details: 'Admin reply was added',
          performedBy: 'Admin User',
          performedAt: new Date().toISOString()
        };
        
        setReview({
          ...review,
          updatedAt: new Date().toISOString(),
          replies: [...(review.replies || []), newReply],
          activityLog: [...(review.activityLog || []), newActivity]
        });
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="review-detail-page">
        <div className="review-detail-page__loading bg-white p-8 rounded-md text-center">
          <div className="animate-spin h-8 w-8 border-4 border-[#DCE8F8] border-t-[#007BF9] rounded-full mx-auto mb-4"></div>
          <p className="text-[#49617E]">Loading review details...</p>
        </div>
      </div>
    );
  }
  
  if (!review) {
    return (
      <div className="review-detail-page">
        <div className="review-detail-page__not-found bg-white p-8 rounded-md text-center">
          <p className="text-[#F85464] mb-4">Review not found</p>
          <button
            onClick={() => router.push('/admin/products/reviews')}
            className="text-[#007BF9] hover:underline"
          >
            Return to Reviews List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="review-detail-page">
      <div className="review-detail-page__header mb-6">
        <h1 className="text-[#2B4F60] text-2xl font-semibold flex items-center">
          <MessageSquare className="mr-2" size={24} />
          Review Details
        </h1>
        <p className="text-[#49617E] mt-1">
          View and manage product review details
        </p>
      </div>
      
      <ReviewDetail 
        review={review}
        onStatusUpdate={handleStatusUpdate}
        onReplySubmit={handleReplySubmit}
      />
    </div>
  );
}