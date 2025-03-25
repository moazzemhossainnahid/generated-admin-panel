// Types for the Orders module

export interface Order {
    id: string;
    orderNumber: string;
    status: OrderStatus;
    paymentMethod: string;
    paymentStatus: PaymentStatus;
    user: {
      id: string;
      name: string;
      email: string;
      phone?: string;
      isGuest?: boolean;
    };
    amount: {
      subtotal: number;
      tax: number;
      discount: number;
      shipping: number;
      total: number;
    };
    items: OrderItem[];
    billingAddress: Address;
    shippingAddress: Address;
    shippingMethod: string;
    trackingCode?: string;
    shippingDate?: string;
    transactionId?: string;
    createdAt: string;
    updatedAt: string;
    activities?: OrderActivity[];
    adminNotes?: string[];
  }
  
  export type OrderStatus = 
    | 'Pending' 
    | 'Processing' 
    | 'In Production' 
    | 'Shipped' 
    | 'Delivered' 
    | 'Canceled';
  
  export type PaymentStatus = 
    | 'Paid' 
    | 'Unpaid' 
    | 'Partially Paid' 
    | 'Refunded';
  
  export interface OrderItem {
    id: string;
    productId: string;
    productName: string;
    productImage?: string;
    quantity: number;
    price: number;
    variations?: OrderItemVariation[];
    totalPrice: number;
    designFile?: string;
  }
  
  export interface OrderItemVariation {
    name: string;
    option: string;
    price?: number;
  }
  
  export interface Address {
    firstName: string;
    lastName: string;
    companyName?: string;
    email: string;
    phoneNumber?: string;
    country: string;
    address: string;
    apartment?: string;
    city: string;
    state?: string;
    zipCode: string;
  }
  
  export interface OrderActivity {
    id: string;
    type: 'status_change' | 'payment_update' | 'admin_note' | 'customer_notification';
    message: string;
    user?: string;
    timestamp: string;
  }
  
  export interface OrderFilter {
    search?: string;
    status?: OrderStatus | 'All';
    paymentStatus?: PaymentStatus | 'All';
    dateRange?: {
      start: string;
      end: string;
    };
    page: number;
    limit: number;
  }
  
  export interface OrdersResponse {
    data: Order[];
    total: number;
  }
  
  export interface OrderResponse {
    data: Order;
  }
  
  export interface UpdateOrderStatusRequest {
    status: OrderStatus;
  }
  
  export interface UpdatePaymentStatusRequest {
    status: PaymentStatus;
  }
  
  export interface UpdateShippingRequest {
    shippingMethod: string;
    trackingCode?: string;
    shippingDate?: string;
  }
  
  export interface AddAdminNoteRequest {
    note: string;
  }