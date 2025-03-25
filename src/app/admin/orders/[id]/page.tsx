import OrderDetailPage from '@/components/orders/OrderDetailPage';

export default function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  return <OrderDetailPage params={params} />;
}