import EditCategoryPage from '@/components/product-category/EditCategoryPage';

export default function EditProductCategoryPage({ params }: { params: { id: string } }) {
  return <EditCategoryPage params={params} />;
}