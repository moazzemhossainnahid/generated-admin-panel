'use client';

import { useEffect, useState } from 'react';
import { ClipboardList } from 'lucide-react';
import OrderList from '@/components/orders/OrderList';
import { Order } from '@/types/orders';

// Mock data for demonstration
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-10023',
    status: 'Pending',
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
    user: {
      id: 'user-1',
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '(555) 123-4567'
    },
    amount: {
      subtotal: 125.00,
      tax: 10.00,
      discount: 0,
      shipping: 15.00,
      total: 150.00
    },
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        productName: 'Business Card Standard',
        productImage: '/api/placeholder/80/80',
        quantity: 100,
        price: 25.00,
        variations: [
          { name: 'Size', option: 'Standard (90x50mm)' },
          { name: 'Paper', option: 'Premium 400gsm', price: 5.00 }
        ],
        totalPrice: 125.00
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
    createdAt: '2025-03-20T10:30:00Z',
    updatedAt: '2025-03-20T10:30:00Z'
  },
  {
    id: '2',
    orderNumber: 'ORD-10022',
    status: 'Processing',
    paymentMethod: 'PayPal',
    paymentStatus: 'Paid',
    user: {
      id: 'user-2',
      name: 'Jane Smith',
      email: 'janesmith@example.com',
      phone: '(555) 987-6543'
    },
    amount: {
      subtotal: 225.00,
      tax: 18.00,
      discount: 20.00,
      shipping: 0,
      total: 223.00
    },
    items: [
      {
        id: 'item-2',
        productId: 'prod-2',
        productName: 'Brochure Tri-fold',
        productImage: '/api/placeholder/80/80',
        quantity: 50,
        price: 4.50,
        variations: [
          { name: 'Size', option: 'A4' },
          { name: 'Paper', option: 'Glossy 150gsm' }
        ],
        totalPrice: 225.00,
        designFile: 'brochure_design.pdf'
      }
    ],
    billingAddress: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'janesmith@example.com',
      phoneNumber: '(555) 987-6543',
      country: 'United States',
      address: '456 Oak Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001'
    },
    shippingAddress: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'janesmith@example.com',
      phoneNumber: '(555) 987-6543',
      country: 'United States',
      address: '456 Oak Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001'
    },
    shippingMethod: 'Express Shipping',
    trackingCode: 'TRK123456789',
    createdAt: '2025-03-19T14:45:00Z',
    updatedAt: '2025-03-20T09:15:00Z'
  },
  {
    id: '3',
    orderNumber: 'ORD-10021',
    status: 'Shipped',
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'Paid',
    user: {
      id: 'user-3',
      name: 'Robert Johnson',
      email: 'robert.j@example.com'
    },
    amount: {
      subtotal: 350.00,
      tax: 28.00,
      discount: 35.00,
      shipping: 12.00,
      total: 355.00
    },
    items: [
      {
        id: 'item-3',
        productId: 'prod-3',
        productName: 'Business Christmas Cards',
        productImage: '/api/placeholder/80/80',
        quantity: 100,
        price: 3.50,
        variations: [
          { name: 'Size', option: 'A5' },
          { name: 'Paper', option: 'Premium Matte', price: 0.50 }
        ],
        totalPrice: 350.00,
        designFile: 'christmas_card_design.pdf'
      }
    ],
    billingAddress: {
      firstName: 'Robert',
      lastName: 'Johnson',
      email: 'robert.j@example.com',
      country: 'United States',
      address: '789 Pine Street',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601'
    },
    shippingAddress: {
      firstName: 'Robert',
      lastName: 'Johnson',
      email: 'robert.j@example.com',
      country: 'United States',
      address: '789 Pine Street',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601'
    },
    shippingMethod: 'Standard Shipping',
    trackingCode: 'TRK987654321',
    shippingDate: '2025-03-18T10:00:00Z',
    transactionId: 'TRANS123456',
    createdAt: '2025-03-15T09:20:00Z',
    updatedAt: '2025-03-18T10:15:00Z'
  },
  {
    id: '4',
    orderNumber: 'ORD-10020',
    status: 'Delivered',
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
    user: {
      id: 'user-4',
      name: 'Sarah Williams',
      email: 'sarah.w@example.com',
      phone: '(555) 555-1234'
    },
    amount: {
      subtotal: 175.00,
      tax: 14.00,
      discount: 0,
      shipping: 10.00,
      total: 199.00
    },
    items: [
      {
        id: 'item-4',
        productId: 'prod-4',
        productName: 'Flyer A5',
        productImage: '/api/placeholder/80/80',
        quantity: 250,
        price: 0.70,
        totalPrice: 175.00,
        designFile: 'flyer_design.pdf'
      }
    ],
    billingAddress: {
      firstName: 'Sarah',
      lastName: 'Williams',
      email: 'sarah.w@example.com',
      phoneNumber: '(555) 555-1234',
      country: 'United States',
      address: '101 Maple Drive',
      city: 'Boston',
      state: 'MA',
      zipCode: '02108'
    },
    shippingAddress: {
      firstName: 'Sarah',
      lastName: 'Williams',
      email: 'sarah.w@example.com',
      phoneNumber: '(555) 555-1234',
      country: 'United States',
      address: '101 Maple Drive',
      city: 'Boston',
      state: 'MA',
      zipCode: '02108'
    },
    shippingMethod: 'Standard Shipping',
    trackingCode: 'TRK456789123',
    shippingDate: '2025-03-12T09:00:00Z',
    transactionId: 'TRANS654321',
    createdAt: '2025-03-10T11:30:00Z',
    updatedAt: '2025-03-15T14:20:00Z'
  },
  {
    id: '5',
    orderNumber: 'ORD-10019',
    status: 'Canceled',
    paymentMethod: 'PayPal',
    paymentStatus: 'Refunded',
    user: {
      id: 'user-5',
      name: 'Michael Brown',
      email: 'm.brown@example.com',
      isGuest: true
    },
    amount: {
      subtotal: 85.00,
      tax: 6.80,
      discount: 0,
      shipping: 7.50,
      total: 99.30
    },
    items: [
      {
        id: 'item-5',
        productId: 'prod-5',
        productName: 'Custom Stickers',
        productImage: '/api/placeholder/80/80',
        quantity: 100,
        price: 0.85,
        totalPrice: 85.00,
        designFile: 'sticker_design.pdf'
      }
    ],
    billingAddress: {
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'm.brown@example.com',
      country: 'United States',
      address: '222 Cedar Lane',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101'
    },
    shippingAddress: {
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'm.brown@example.com',
      country: 'United States',
      address: '222 Cedar Lane',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101'
    },
    shippingMethod: 'Economy Shipping',
    createdAt: '2025-03-05T16:15:00Z',
    updatedAt: '2025-03-06T10:45:00Z'
  },
  {
    id: '6',
    orderNumber: 'ORD-10018',
    status: 'In Production',
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
    user: {
      id: 'user-6',
      name: 'Emily Davis',
      email: 'emily.d@example.com',
      phone: '(555) 333-4444'
    },
    amount: {
      subtotal: 450.00,
      tax: 36.00,
      discount: 45.00,
      shipping: 20.00,
      total: 461.00
    },
    items: [
      {
        id: 'item-6',
        productId: 'prod-6',
        productName: 'Poster A2',
        productImage: '/api/placeholder/80/80',
        quantity: 10,
        price: 45.00,
        variations: [
          { name: 'Finish', option: 'Gloss Lamination', price: 5.00 }
        ],
        totalPrice: 450.00,
        designFile: 'poster_design.pdf'
      }
    ],
    billingAddress: {
      firstName: 'Emily',
      lastName: 'Davis',
      email: 'emily.d@example.com',
      phoneNumber: '(555) 333-4444',
      country: 'United States',
      address: '333 Birch Street',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101'
    },
    shippingAddress: {
      firstName: 'Emily',
      lastName: 'Davis',
      email: 'emily.d@example.com',
      phoneNumber: '(555) 333-4444',
      country: 'United States',
      address: '333 Birch Street',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101'
    },
    shippingMethod: 'Express Shipping',
    transactionId: 'TRANS789456',
    createdAt: '2025-03-18T13:40:00Z',
    updatedAt: '2025-03-19T09:30:00Z'
  }
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call with a delay
    const fetchData = async () => {
      try {
        // In a real app, you would fetch from your API
        // const response = await fetch('/api/orders');
        // const data = await response.json();
        
        // For now, use mock data
        setTimeout(() => {
          setOrders(mockOrders);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="orders-page">
      <div className="orders-page__header mb-6">
        <h1 className="text-[#2B4F60] text-2xl font-semibold flex items-center">
          <ClipboardList className="mr-2" size={24} />
          Orders
        </h1>
        <p className="text-[#49617E] mt-1">
          Manage customer orders, update status, and process shipments
        </p>
      </div>
      
      {isLoading ? (
        <div className="orders-page__loading bg-white p-8 rounded-md text-center">
          <div className="animate-spin h-8 w-8 border-4 border-[#DCE8F8] border-t-[#007BF9] rounded-full mx-auto mb-4"></div>
          <p className="text-[#49617E]">Loading orders...</p>
        </div>
      ) : (
        <OrderList 
          initialOrders={orders} 
          initialTotal={orders.length} 
        />
      )}
    </div>
  );
}