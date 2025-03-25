'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ClipboardList } from 'lucide-react';
import { toast } from 'react-toastify';
import Button from '@/components/ui/Button';
import OrderDetail from '@/components/orders/OrderDetail';
import { Order } from '@/types/orders';

// Mock data for a single order - in a real app this would come from your API
const mockOrder: Order = {
  id: '1',
  orderNumber: 'ORD-10023',
  status: 'Processing',
  paymentMethod: 'Credit Card',
  paymentStatus: 'Paid',
  user: {
    id: 'user-1',
    name: 'John Doe',
    email: 'johndoe@example.com',
    phone: '(555) 123-4567'
  },
  amount: {
    subtotal: 224.00,
    tax: 17.92,
    discount: 10.00,
    shipping: 15.00,
    total: 246.92
  },
  items: [
    {
      id: 'item-1',
      productId: 'prod-1',
      productName: 'Business Card Standard',
      productImage: '/api/placeholder/80/80',
      quantity: 100,
      price: 1.24,
      variations: [
        { name: 'Size', option: 'Standard (90x50mm)' },
        { name: 'Paper', option: 'Premium 400gsm', price: 0.50 }
      ],
      totalPrice: 124.00,
      designFile: 'business_card_design.pdf'
    },
    {
      id: 'item-2',
      productId: 'prod-2',
      productName: 'Letterhead A4',
      productImage: '/api/placeholder/80/80',
      quantity: 50,
      price: 2.00,
      variations: [
        { name: 'Paper', option: 'Premium 120gsm' }
      ],
      totalPrice: 100.00
    }
  ],
  billingAddress: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@example.com',
    phoneNumber: '(555) 123-4567',
    country: 'United States',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001'
  },
  shippingAddress: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@example.com',
    phoneNumber: '(555) 123-4567',
    country: 'United States',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001'
  },
  shippingMethod: 'Standard Shipping',
  transactionId: 'TXN72381947',
  createdAt: '2025-03-20T10:30:00Z',
  updatedAt: '2025-03-20T14:45:00Z',
  activities: [
    {
      id: 'act-1',
      type: 'status_change',
      message: 'Order status changed from Pending to Processing',
      user: 'Admin User',
      timestamp: '2025-03-20T14:45:00Z'
    },
    {
      id: 'act-2',
      type: 'payment_update',
      message: 'Payment received via Credit Card',
      timestamp: '2025-03-20T10:35:00Z'
    },
    {
      id: 'act-3',
      type: 'customer_notification',
      message: 'Order confirmation email sent to customer',
      timestamp: '2025-03-20T10:32:00Z'
    }
  ],
  adminNotes: [
    'Customer requested expedited processing if possible.',
    'Verified payment with payment processor.'
  ]
};

interface OrderDetailPageProps {
  params: {
    id: string;
  };
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call with a delay
    const fetchData = async () => {
      try {
        // In a real app, you would fetch from your API
        // const response = await fetch(`/api/orders/${params.id}`);
        // const data = await response.json();
        
        // For now, use mock data
        setTimeout(() => {
          // Pretend we're getting the order with the ID from the params
          // In a real app, you'd filter from a database or make an API call
          if (params.id === '1') {
            setOrder(mockOrder);
          } else {
            toast.error('Order not found');
            router.push('/admin/orders');
          }
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching order:', error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [params.id, router]);

  return (
    <div className="order-detail-page">
      <div className="order-detail-page__header mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<ArrowLeft size={16} />}
            onClick={() => router.push('/admin/orders')}
            className="print:hidden"
          >
            Back to Orders
          </Button>
          
          <h1 className="text-[#2B4F60] text-2xl font-semibold flex items-center">
            <ClipboardList className="mr-2" size={24} />
            Order Details
          </h1>
        </div>
        
        <p className="text-[#49617E] mt-1 print:hidden">
          View and manage order details, update status, and process shipments
        </p>
      </div>
      
      {isLoading ? (
        <div className="order-detail-page__loading bg-white p-8 rounded-md text-center">
          <div className="animate-spin h-8 w-8 border-4 border-[#DCE8F8] border-t-[#007BF9] rounded-full mx-auto mb-4"></div>
          <p className="text-[#49617E]">Loading order details...</p>
        </div>
      ) : order ? (
        <OrderDetail order={order} />
      ) : (
        <div className="order-detail-page__not-found bg-white p-8 rounded-md text-center">
          <p className="text-[#F85464] mb-4">Order not found</p>
          <Button
            variant="primary"
            onClick={() => router.push('/admin/orders')}
          >
            Return to Orders List
          </Button>
        </div>
      )}
    </div>
  );
}