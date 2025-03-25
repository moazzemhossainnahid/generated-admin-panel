// This file should be placed at app/admin/products/reviews/[id]/page.tsx
import ReviewDetailPage from '@/components/product-reviews/ReviewDetailPage';

export default function ProductReviewDetailPage({ params }: { params: { id: string } }) {
  return <ReviewDetailPage params={params} />;
}