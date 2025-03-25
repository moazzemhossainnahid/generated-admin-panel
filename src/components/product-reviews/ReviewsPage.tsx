'use client';

import { useEffect, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import ReviewList from '@/components/product-reviews/ReviewList';
import { ProductReview } from '@/types/products';

// Mock data for demonstration
const mockReviews: ProductReview[] = [
  {
    id: 'review-1',
    productId: 'product-1',
    productName: 'Christmas Card',
    productImage: '/images/christmas-card.jpg',
    userId: 'user-1',
    userName: 'Maxin Riley',
    userEmail: 'maxinriley@gmail.com',
    userType: 'registered',
    rating: 4,
    reviewText: 'Very enthusiastic support! It\'s a true pleasure working with them.',
    status: 'approved',
    createdAt: '2025-02-20T10:30:00Z',
    updatedAt: '2025-02-20T10:30:00Z'
  },
  {
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
    updatedAt: '2025-02-19T11:45:00Z'
  },
  {
    id: 'review-3',
    productId: 'product-1',
    productName: 'Christmas Card',
    productImage: '/images/christmas-card.jpg',
    userId: 'user-3',
    userName: 'Maxin Riley',
    userEmail: 'maxinriley@gmail.com',
    userType: 'guest',
    rating: 4,
    reviewText: 'Very enthusiastic support! It\'s a true pleasure working with them.',
    status: 'pending',
    createdAt: '2025-02-18T09:20:00Z',
    updatedAt: '2025-02-18T09:20:00Z'
  },
  {
    id: 'review-4',
    productId: 'product-1',
    productName: 'Christmas Card',
    productImage: '/images/christmas-card.jpg',
    userId: 'user-4',
    userName: 'Maxin Riley',
    userEmail: 'maxinriley@gmail.com',
    userType: 'registered',
    rating: 4,
    reviewText: 'Very enthusiastic support! It\'s a true pleasure working with them.',
    status: 'pending',
    createdAt: '2025-02-17T14:10:00Z',
    updatedAt: '2025-02-17T14:10:00Z'
  },
  {
    id: 'review-5',
    productId: 'product-1',
    productName: 'Christmas Card',
    productImage: '/images/christmas-card.jpg',
    userId: 'user-5',
    userName: 'Maxin Riley',
    userEmail: 'maxinriley@gmail.com',
    userType: 'registered',
    rating: 4,
    reviewText: 'Very enthusiastic support! It\'s a true pleasure working with them.',
    images: ['/images/review-image-1.jpg', '/images/review-image-2.jpg'],
    status: 'approved',
    createdAt: '2025-02-16T16:30:00Z',
    updatedAt: '2025-02-16T16:30:00Z'
  },
  {
    id: 'review-6',
    productId: 'product-1',
    productName: 'Christmas Card',
    productImage: '/images/christmas-card.jpg',
    userId: 'user-6',
    userName: 'Maxin Riley',
    userEmail: 'maxinriley@gmail.com',
    userType: 'registered',
    rating: 4,
    reviewText: 'Very enthusiastic support! It\'s a true pleasure working with them.',
    status: 'approved',
    createdAt: '2025-02-15T08:15:00Z',
    updatedAt: '2025-02-15T08:15:00Z'
  },
  {
    id: 'review-7',
    productId: 'product-1',
    productName: 'Christmas Card',
    productImage: '/images/christmas-card.jpg',
    userId: 'user-7',
    userName: 'Maxin Riley',
    userEmail: 'maxinriley@gmail.com',
    userType: 'registered',
    rating: 4,
    reviewText: 'Very enthusiastic support! It\'s a true pleasure working with them.',
    status: 'approved',
    createdAt: '2025-02-14T13:40:00Z',
    updatedAt: '2025-02-14T13:40:00Z'
  },
  {
    id: 'review-8',
    productId: 'product-1',
    productName: 'Christmas Card',
    productImage: '/images/christmas-card.jpg',
    userId: 'user-8',
    userName: 'Maxin Riley',
    userEmail: 'maxinriley@gmail.com',
    userType: 'registered',
    rating: 4,
    reviewText: 'Very enthusiastic support! It\'s a true pleasure working with them.',
    status: 'approved',
    createdAt: '2025-02-13T11:25:00Z',
    updatedAt: '2025-02-13T11:25:00Z'
  }
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call with a delay
    const fetchData = async () => {
      try {
        // In a real app, you would fetch from your API
        // const response = await fetch('/api/product-reviews');
        // const data = await response.json();
        
        // For now, use mock data
        setTimeout(() => {
          setReviews(mockReviews);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="reviews-page">
      <div className="reviews-page__header mb-6">
        <h1 className="text-[#2B4F60] text-2xl font-semibold flex items-center">
          <MessageSquare className="mr-2" size={24} />
          Product Reviews
        </h1>
        <p className="text-[#49617E] mt-1">
          Manage and moderate product reviews from your customers
        </p>
      </div>
      
      {isLoading ? (
        <div className="reviews-page__loading bg-white p-8 rounded-md text-center">
          <div className="animate-spin h-8 w-8 border-4 border-[#DCE8F8] border-t-[#007BF9] rounded-full mx-auto mb-4"></div>
          <p className="text-[#49617E]">Loading reviews...</p>
        </div>
      ) : (
        <ReviewList 
          initialReviews={reviews} 
          initialTotal={reviews.length} 
        />
      )}
    </div>
  );
}