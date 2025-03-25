'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Printer, 
  Trash2, 
  Download, 
  Edit2, 
  Save, 
  Plus, 
  X,
  FileDown
} from 'lucide-react';
import { toast } from 'react-toastify';
import Button from '@/components/ui/Button';
import { 
  Order, 
  OrderStatus, 
  PaymentStatus, 
  OrderActivity, 
  Address
} from '@/types/orders';

interface OrderDetailProps {
  order: Order;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ order }) => {
  const router = useRouter();
  const [orderStatus, setOrderStatus] = useState<OrderStatus>(order.status);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(order.paymentStatus);
  const [shippingMethod, setShippingMethod] = useState(order.shippingMethod);
  const [trackingCode, setTrackingCode] = useState(order.trackingCode || '');
  const [shippingDate, setShippingDate] = useState(order.shippingDate || '');
  const [noteText, setNoteText] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);
  const [isUpdatingShipping, setIsUpdatingShipping] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  
  // Customer information states
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: order.user.name,
    email: order.user.email,
    phone: order.user.phone || ''
  });
  
  // Billing/Shipping address states
  const [isEditingBillingAddress, setIsEditingBillingAddress] = useState(false);
  const [isEditingShippingAddress, setIsEditingShippingAddress] = useState(false);
  const [billingAddress, setBillingAddress] = useState<Address>(order.billingAddress);
  const [shippingAddress, setShippingAddress] = useState<Address>(order.shippingAddress);

  // Handler for printing order
  const handlePrintOrder = () => {
    window.print();
  };

  // Handler for deleting order
  const handleDeleteOrder = () => {
    const confirmed = window.confirm(`Are you sure you want to delete order #${order.orderNumber}?`);
    if (!confirmed) return;
    
    try {
      // API call would go here
      toast.success('Order deleted successfully');
      router.push('/admin/orders');
    } catch (error) {
      toast.error('Failed to delete order');
    }
  };

  // Handler for updating order status
  const handleUpdateOrderStatus = async () => {
    if (orderStatus === order.status) return;
    
    setIsUpdatingStatus(true);
    
    try {
      // API call would go here
      
      // Simulate success
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success(`Order status updated to ${orderStatus}`);
      
      // Add activity
      const newActivity: OrderActivity = {
        id: `act-${Date.now()}`,
        type: 'status_change',
        message: `Order status changed from ${order.status} to ${orderStatus}`,
        user: 'Admin User',
        timestamp: new Date().toISOString()
      };
      
      if (!order.activities) {
        order.activities = [];
      }
      order.activities.unshift(newActivity);
      
      order.status = orderStatus;
    } catch (error) {
      toast.error('Failed to update order status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Handler for updating payment status
  const handleUpdatePaymentStatus = async () => {
    if (paymentStatus === order.paymentStatus) return;
    
    setIsUpdatingPayment(true);
    
    try {
      // API call would go here
      
      // Simulate success
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success(`Payment status updated to ${paymentStatus}`);
      
      // Add activity
      const newActivity: OrderActivity = {
        id: `act-${Date.now()}`,
        type: 'payment_update',
        message: `Payment status changed from ${order.paymentStatus} to ${paymentStatus}`,
        user: 'Admin User',
        timestamp: new Date().toISOString()
      };
      
      if (!order.activities) {
        order.activities = [];
      }
      order.activities.unshift(newActivity);
      
      order.paymentStatus = paymentStatus;
    } catch (error) {
      toast.error('Failed to update payment status');
    } finally {
      setIsUpdatingPayment(false);
    }
  };

  // Handler for updating shipping info
  const handleUpdateShipping = async () => {
    setIsUpdatingShipping(true);
    
    try {
      // API call would go here
      
      // Simulate success
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('Shipping information updated');
      
      // Add activity
      const newActivity: OrderActivity = {
        id: `act-${Date.now()}`,
        type: 'status_change',
        message: `Shipping information updated`,
        user: 'Admin User',
        timestamp: new Date().toISOString()
      };
      
      if (!order.activities) {
        order.activities = [];
      }
      order.activities.unshift(newActivity);
      
      order.shippingMethod = shippingMethod;
      order.trackingCode = trackingCode;
      order.shippingDate = shippingDate;
    } catch (error) {
      toast.error('Failed to update shipping information');
    } finally {
      setIsUpdatingShipping(false);
    }
  };

  // Handler for adding admin note
  const handleAddNote = async () => {
    if (!adminNote.trim()) return;
    
    setIsAddingNote(true);
    
    try {
      // API call would go here
      
      // Simulate success
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Add activity
      const newActivity: OrderActivity = {
        id: `act-${Date.now()}`,
        type: 'admin_note',
        message: adminNote,
        user: 'Admin User',
        timestamp: new Date().toISOString()
      };
      
      if (!order.activities) {
        order.activities = [];
      }
      order.activities.unshift(newActivity);
      
      if (!order.adminNotes) {
        order.adminNotes = [];
      }
      order.adminNotes.unshift(adminNote);
      
      toast.success('Note added successfully');
      setAdminNote('');
    } catch (error) {
      toast.error('Failed to add note');
    } finally {
      setIsAddingNote(false);
    }
  };

  // Handler for updating customer info
  const handleUpdateCustomer = async () => {
    try {
      // API call would go here
      
      // Simulate success
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update order user info
      order.user.name = customerInfo.name;
      order.user.email = customerInfo.email;
      order.user.phone = customerInfo.phone;
      
      toast.success('Customer information updated');
      setIsEditingCustomer(false);
    } catch (error) {
      toast.error('Failed to update customer information');
    }
  };

  // Handler for updating billing address
  const handleUpdateBillingAddress = async () => {
    try {
      // API call would go here
      
      // Simulate success
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update order address
      order.billingAddress = billingAddress;
      
      toast.success('Billing address updated');
      setIsEditingBillingAddress(false);
    } catch (error) {
      toast.error('Failed to update billing address');
    }
  };

  // Handler for updating shipping address
  const handleUpdateShippingAddress = async () => {
    try {
      // API call would go here
      
      // Simulate success
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update order address
      order.shippingAddress = shippingAddress;
      
      toast.success('Shipping address updated');
      setIsEditingShippingAddress(false);
    } catch (error) {
      toast.error('Failed to update shipping address');
    }
  };

  // Handler for downloading invoice
  const handleDownloadInvoice = () => {
    toast.success('Invoice downloaded successfully');
    // In a real application, this would trigger a PDF download
  };

  // Handler for downloading design files
  const handleDownloadDesign = () => {
    // Check if any items have design files
    const hasDesignFiles = order.items.some(item => item.designFile);
    
    if (hasDesignFiles) {
      toast.success('Design files downloaded successfully');
    } else {
      toast.info('No design files available for this order');
    }
    // In a real application, this would trigger files download
  };

  // Handler for canceling order
  const handleCancelOrder = () => {
    if (order.status === 'Canceled') {
      toast.info('Order is already canceled');
      return;
    }
    
    const confirmed = window.confirm(`Are you sure you want to cancel order #${order.orderNumber}?`);
    if (!confirmed) return;
    
    try {
      // API call would go here
      
      // Simulate success
      setOrderStatus('Canceled');
      setTimeout(() => {
        handleUpdateOrderStatus();
      }, 0);
      
    } catch (error) {
      toast.error('Failed to cancel order');
    }
  };

  // Handler for refunding order
  const handleRefundOrder = () => {
    if (order.paymentStatus === 'Refunded') {
      toast.info('Order has already been refunded');
      return;
    }
    
    if (order.paymentStatus !== 'Paid' && order.paymentStatus !== 'Partially Paid') {
      toast.warning('Only paid orders can be refunded');
      return;
    }
    
    const confirmed = window.confirm(`Are you sure you want to refund order #${order.orderNumber}?`);
    if (!confirmed) return;
    
    try {
      // API call would go here
      
      // Simulate success
      setPaymentStatus('Refunded');
      setTimeout(() => {
        handleUpdatePaymentStatus();
      }, 0);
      
    } catch (error) {
      toast.error('Failed to refund order');
    }
  };

  // Get appropriate color for status badge
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-[#FFF4EB] text-[#E46A11]';
      case 'Processing':
        return 'bg-[#DCE8F8] text-[#007BF9]';
      case 'In Production':
        return 'bg-[#FFE9D5] text-[#F59E0B]';
      case 'Shipped':
        return 'bg-[#E6F6EE] text-[#30BF89]';
      case 'Delivered':
        return 'bg-[#E6F6EE] text-[#0D894F]';
      case 'Canceled':
        return 'bg-[#FFEFEF] text-[#F85464]';
      default:
        return 'bg-[#F5F5F5] text-[#6F8591]';
    }
  };

  // Get appropriate color for payment status badge
  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'Paid':
        return 'bg-[#E6F6EE] text-[#30BF89]';
      case 'Unpaid':
        return 'bg-[#FFEFEF] text-[#F85464]';
      case 'Partially Paid':
        return 'bg-[#FFE9D5] text-[#F59E0B]';
      case 'Refunded':
        return 'bg-[#DCE8F8] text-[#007BF9]';
      default:
        return 'bg-[#F5F5F5] text-[#6F8591]';
    }
  };

  // Render address as formatted string
  const formatAddress = (address: Address) => {
    let parts = [
      address.firstName + ' ' + address.lastName,
      address.address
    ];
    
    if (address.apartment) {
      parts.push(address.apartment);
    }
    
    parts.push(`${address.city}, ${address.state || ''} ${address.zipCode}`);
    parts.push(address.country);
    
    if (address.phoneNumber) {
      parts.push(address.phoneNumber);
    }
    
    return parts.filter(part => part && part.trim() !== '').join(', ');
  };

  return (
    <div className="order-detail print:p-0 print:m-0">
      {/* Part One: Order Summary Actions */}
      <div className="order-detail__summary bg-white rounded-md border border-[#E4E7EB] p-6 mb-6 print:border-0 print:shadow-none">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-semibold text-[#2B4F60]">Order #{order.orderNumber}</h2>
          <div className="flex items-center gap-3">
            <button 
              className="inline-flex items-center justify-center p-2 bg-[#F8F9FA] text-[#49617E] rounded-md hover:bg-[#DCE8F8] transition-colors print:hidden"
              onClick={handlePrintOrder}
              title="Print order"
            >
              <Printer size={18} />
            </button>
            <button 
              className="inline-flex items-center justify-center p-2 bg-[#F8F9FA] text-[#F85464] rounded-md hover:bg-[#FFEFEF] transition-colors print:hidden"
              onClick={handleDeleteOrder}
              title="Delete order"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:grid-cols-2">
        {/* Left Column: Customer & Payment/Shipping Info */}
        <div className="md:col-span-2 print:col-span-1 space-y-6">
          {/* Part Two: Customer Details */}
          <div className="bg-white rounded-md border border-[#E4E7EB] overflow-hidden print:border-0 print:shadow-none">
            <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4 flex justify-between items-center print:bg-white">
              <h3 className="text-[#2B4F60] font-semibold">Customer Details</h3>
              <button 
                className="text-[#49617E] hover:text-[#007BF9] print:hidden"
                onClick={() => setIsEditingCustomer(!isEditingCustomer)}
              >
                <Edit2 size={16} />
              </button>
            </div>
            
            <div className="p-6">
              {isEditingCustomer ? (
                <div className="space-y-4">
                  <div className="form-group">
                    <label className="block text-sm text-[#49617E] mb-1">Name</label>
                    <input 
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                      className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-sm text-[#49617E] mb-1">Email</label>
                    <input 
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                      className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-sm text-[#49617E] mb-1">Phone</label>
                    <input 
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsEditingCustomer(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      leftIcon={<Save size={16} />}
                      onClick={handleUpdateCustomer}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                    <div>
                      <p className="text-sm text-[#6F8591]">Order Date:</p>
                      <p className="text-[#333333]">{new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#6F8591]">Customer Name:</p>
                      <p className="text-[#333333]">{order.user.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#6F8591]">Email:</p>
                      <p className="text-[#333333]">{order.user.email}</p>
                    </div>
                    {order.user.phone && (
                      <div>
                        <p className="text-sm text-[#6F8591]">Phone:</p>
                        <p className="text-[#333333]">{order.user.phone}</p>
                      </div>
                    )}
                    {order.user.isGuest && (
                      <div className="col-span-2">
                        <span className="inline-block px-2 py-1 bg-[#FFF4EB] text-[#E46A11] text-sm rounded">Guest Order</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Part Three: Payment & Shipping Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Payment Method Section */}
            <div className="bg-white rounded-md border border-[#E4E7EB] overflow-hidden print:border-0 print:shadow-none">
              <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4 print:bg-white">
                <h3 className="text-[#2B4F60] font-semibold">Payment Method</h3>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-[#6F8591]">Method:</p>
                  <p className="text-[#333333]">{order.paymentMethod}</p>
                </div>
                
                {order.transactionId && (
                  <div>
                    <p className="text-sm text-[#6F8591]">Transaction ID:</p>
                    <p className="text-[#333333]">{order.transactionId}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-[#6F8591]">Amount:</p>
                  <p className="text-[#333333] font-semibold">${order.amount.total.toFixed(2)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-[#6F8591]">Payment Status:</p>
                  <div className="flex justify-between items-center mt-1">
                    <select
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                      className="px-3 py-1.5 border border-[#E4E7EB] rounded-md text-sm focus:border-[#007BF9] focus:outline-none print:hidden"
                    >
                      <option value="Paid">Paid</option>
                      <option value="Unpaid">Unpaid</option>
                      <option value="Partially Paid">Partially Paid</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                    
                    <div className="print:hidden">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleUpdatePaymentStatus}
                        isLoading={isUpdatingPayment}
                        disabled={paymentStatus === order.paymentStatus}
                      >
                        Update
                      </Button>
                    </div>
                    
                    <span className={`${getPaymentStatusColor(order.paymentStatus)} px-2 py-1 rounded-full text-xs font-medium hidden print:inline-block`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Shipping Method Section */}
            <div className="bg-white rounded-md border border-[#E4E7EB] overflow-hidden print:border-0 print:shadow-none">
              <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4 print:bg-white">
                <h3 className="text-[#2B4F60] font-semibold">Shipping Method</h3>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-[#6F8591]">Method:</p>
                  <select
                    value={shippingMethod}
                    onChange={(e) => setShippingMethod(e.target.value)}
                    className="w-full px-3 py-1.5 border border-[#E4E7EB] rounded-md text-sm mt-1 focus:border-[#007BF9] focus:outline-none print:hidden"
                  >
                    <option value="Standard Shipping">Standard Shipping</option>
                    <option value="Express Shipping">Express Shipping</option>
                    <option value="Economy Shipping">Economy Shipping</option>
                    <option value="Free Shipping">Free Shipping</option>
                  </select>
                  <p className="hidden print:block text-[#333333]">{order.shippingMethod}</p>
                </div>
                
                <div>
                  <p className="text-sm text-[#6F8591]">Tracking Code:</p>
                  <input
                    type="text"
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                    placeholder="Enter tracking code"
                    className="w-full px-3 py-1.5 border border-[#E4E7EB] rounded-md text-sm mt-1 focus:border-[#007BF9] focus:outline-none print:hidden"
                  />
                  <p className="hidden print:block text-[#333333]">{order.trackingCode || "Not available"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-[#6F8591]">Shipping Date:</p>
                  <input
                    type="date"
                    value={shippingDate ? shippingDate.substring(0, 10) : ''}
                    onChange={(e) => setShippingDate(new Date(e.target.value).toISOString())}
                    className="w-full px-3 py-1.5 border border-[#E4E7EB] rounded-md text-sm mt-1 focus:border-[#007BF9] focus:outline-none print:hidden"
                  />
                  <p className="hidden print:block text-[#333333]">
                    {order.shippingDate ? new Date(order.shippingDate).toLocaleDateString() : "Not available"}
                  </p>
                </div>
                
                <div className="print:hidden">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleUpdateShipping}
                    isLoading={isUpdatingShipping}
                    fullWidth
                  >
                    Update Shipping
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order Status Update */}
          <div className="bg-white rounded-md border border-[#E4E7EB] overflow-hidden print:border-0 print:shadow-none print:hidden">
            <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4">
              <h3 className="text-[#2B4F60] font-semibold">Order Status</h3>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="w-full sm:flex-1">
                  <select
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value as OrderStatus)}
                    className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md text-sm focus:border-[#007BF9] focus:outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="In Production">In Production</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Canceled">Canceled</option>
                  </select>
                </div>
                
                <Button
                  variant="primary"
                  onClick={handleUpdateOrderStatus}
                  isLoading={isUpdatingStatus}
                  disabled={orderStatus === order.status}
                >
                  Update Status
                </Button>
              </div>
            </div>
          </div>
          
          {/* Part Four: Address Management */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Billing Address */}
            <div className="bg-white rounded-md border border-[#E4E7EB] overflow-hidden print:border-0 print:shadow-none">
              <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4 flex justify-between items-center print:bg-white">
                <h3 className="text-[#2B4F60] font-semibold">Billing Address</h3>
                <button 
                  className="text-[#49617E] hover:text-[#007BF9] print:hidden"
                  onClick={() => setIsEditingBillingAddress(!isEditingBillingAddress)}
                >
                  <Edit2 size={16} />
                </button>
              </div>
              
              <div className="p-6">
                {isEditingBillingAddress ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="form-group">
                        <label className="block text-xs text-[#49617E] mb-1">First Name</label>
                        <input 
                          type="text"
                          value={billingAddress.firstName}
                          onChange={(e) => setBillingAddress({...billingAddress, firstName: e.target.value})}
                          className="w-full px-3 py-1.5 border border-[#E4E7EB] rounded-md text-sm"
                        />
                      </div>
                      <div className="form-group">
                        <label className="block text-xs text-[#49617E] mb-1">Last Name</label>
                        <input 
                          type="text"
                          value={billingAddress.lastName}
                          onChange={(e) => setBillingAddress({...billingAddress, lastName: e.target.value})}
                          className="w-full px-3 py-1.5 border border-[#E4E7EB] rounded-md text-sm"
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label className="block text-xs text-[#49617E] mb-1">Company (Optional)</label>
                      <input 
                        type="text"
                        value={billingAddress.companyName || ''}
                        onChange={(e) => setBillingAddress({...billingAddress, companyName: e.target.value})}
                        className="w-full px-3 py-1.5 border border-[#E4E7EB] rounded-md text-sm"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="block text-xs text-[#49617E] mb-1">Country</label>
                      <input 
                        type="text"
                        value={billingAddress.country}
                        onChange={(e) => setBillingAddress({...billingAddress, country: e.target.value})}
                        className="w-full px-3 py-1.5 border border-[#E4E7EB] rounded-md text-sm"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="block text-xs text-[#49617E] mb-1">Street Address</label>
                      <input 
                        type="text"
                        value={billingAddress.address}
                        onChange={(e) => setBillingAddress({...billingAddress, address: e.target.value})}
                        className="w-full px-3 py-1.5 border border-[#E4E7EB] rounded-md text-sm"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="block text-xs text-[#49617E] mb-1">Apartment, suite, etc. (Optional)</label>
                      <input 
                        type="text"
                        value={billingAddress.apartment || ''}
                        onChange={(e) => setBillingAddress({...billingAddress, apartment: e.target.value})}
                        className="w-full px-3 py-1.5 border border-[#E4E7EB] rounded-md text-sm"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="form-group">
                        <label className="block text-xs text-[#49617E] mb-1">City</label>
                        <input 
                          type="text"
                          value={billingAddress.city}
                          onChange={(e) => setBillingAddress({...billingAddress, city: e.target.value})}
                          className="w-full px-3 py-1.5 border border-[#E4E7EB] rounded-md text-sm"
                        />
                      </div>
                      <div className="form-group">
                        <label className="block text-xs text-[#49617E] mb-1">ZIP Code</label>
                        <input 
                          type="text"
                          value={billingAddress.zipCode}
                          onChange={(e) => setBillingAddress({...billingAddress, zipCode: e.target.value})}
                          className="w-full px-3 py-1.5 border border-[#E4E7EB] rounded-md text-sm"
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label className="block text-xs text-[#49617E] mb-1">Phone</label>
                      <input 
                        type="tel"
                        value={billingAddress.phoneNumber || ''}
                        onChange={(e) => setBillingAddress({...billingAddress, phoneNumber: e.target.value})}
                        className="w-full px-3 py-1.5 border border-[#E4E7EB] rounded-md text-sm"
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsEditingBillingAddress(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        variant="primary" 
                        size="sm" 
                        leftIcon={<Save size={16} />}
                        onClick={handleUpdateBillingAddress}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-[#333333] whitespace-pre-line">
                    {formatAddress(order.billingAddress)}
                  </p>
                )}
              </div>
            </div>
            
            {/* Shipping Address */}
            <div className="bg-white rounded-md border border-[#E4E7EB] overflow-hidden print:border-0 print:shadow-none">
              <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4 flex justify-between items-center print:bg-white">
                <h3 className="text-[#2B4F60] font-semibold">Shipping Address</h3>
                <button 
                  className="text-[#49617E] hover:text-[#007BF9] print:hidden"
                  onClick={() => setIsEditingShippingAddress(!isEditingShippingAddress)}
                >
                  <Edit2 size={16} />
                </button>
              </div>
              
              <div className="p-6">
                {isEditingShippingAddress ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="form-group">
                        <label className="block text-xs text-[#49617E] mb-1">First Name</label>
                        <input 
                          type="text"
                          value={shippingAddress.firstName}
                          onChange={(e) => setShippingAddress({...shippingAddress, firstName: e.target.value})}
                          className="w-full px-3 py-1.5 border border-[#E4E7EB] rounded-md text-sm"
                        />
                      </div>
                      <div className="form-group">
                        <label className="block text-xs text-[#49617E] mb-1">Last Name</label>
                        <input 
                          type="text"
                          value={shippingAddress.lastName}
                          onChange={(e) => setShippingAddress({...shippingAddress, lastName: e.target.value})}
                          className="w-full px-3 py-1.5 border border-[#E4E7EB] rounded-md text-sm"
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label className="block text-xs text-[#49617E] mb-1">Company (Optional)</label>
                      <input 
                        type="text"
                        value={shippingAddress.companyName || ''}
                        onChange={(e) => setShippingAddress({...shippingAddress, companyName: e.target.value})}
                        className="w-full px-3 py-1.5 border border-[#E4E7EB] rounded-md text-sm"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="block text-xs text-[#49617E] mb-1">Country</label>
                      <input 
                        type="text"
                        value={shippingAddress.country}
                        onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                        className="w-full px-3 py-1.5 border border-[#E4E7EB] rounded-md text-sm"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="block text-xs text-[#49617E] mb-1">Street Address</label>
                      <input 
                        type="text"
                        value={shippingAddress.address}
                        onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                        className="w-full px-3 py-1.5 border border-[#E4E7EB] rounded-md text-sm"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="block text-xs text-[#49617E] mb-1">Apartment, suite, etc. (Optional)</label>
                      <input 
                        type="text"
                        value={shippingAddress.apartment || ''}
                        onChange={(e) => setShippingAddress({...shippingAddress, apartment: e.target.value})}
                        className="w-full px-3 py-1.5 border border-[#E4E7EB] rounded-md text-sm"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="form-group">
                        <label className="block text-xs text-[#49617E] mb-1">City</label>
                        <input 
                          type="text"
                          value={shippingAddress.city}
                          onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                          className="w-full px-3 py-1.5 border border-[#E4E7EB] rounded-md text-sm"
                        />
                      </div>
                      <div className="form-group">
                        <label className="block text-xs text-[#49617E] mb-1">ZIP Code</label>
                        <input 
                          type="text"
                          value={shippingAddress.zipCode}
                          onChange={(e) => setShippingAddress({...shippingAddress, zipCode: e.target.value})}
                          className="w-full px-3 py-1.5 border border-[#E4E7EB] rounded-md text-sm"
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label className="block text-xs text-[#49617E] mb-1">Phone</label>
                      <input 
                        type="tel"
                        value={shippingAddress.phoneNumber || ''}
                        onChange={(e) => setShippingAddress({...shippingAddress, phoneNumber: e.target.value})}
                        className="w-full px-3 py-1.5 border border-[#E4E7EB] rounded-md text-sm"
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsEditingShippingAddress(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        variant="primary" 
                        size="sm" 
                        leftIcon={<Save size={16} />}
                        onClick={handleUpdateShippingAddress}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-[#333333] whitespace-pre-line">
                    {formatAddress(order.shippingAddress)}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Part Five: Product Order Details */}
          <div className="bg-white rounded-md border border-[#E4E7EB] overflow-hidden print:border-0 print:shadow-none">
            <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4 print:bg-white">
              <h3 className="text-[#2B4F60] font-semibold">Order Items</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F8F9FA] border-b border-[#E4E7EB]">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-sm text-[#49617E]">Product</th>
                    <th className="px-4 py-3 text-left font-semibold text-sm text-[#49617E]">Price</th>
                    <th className="px-4 py-3 text-left font-semibold text-sm text-[#49617E]">Quantity</th>
                    <th className="px-4 py-3 text-right font-semibold text-sm text-[#49617E]">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="border-b border-[#E4E7EB]">
                      <td className="px-4 py-4">
                        <div className="flex items-start">
                          {item.productImage && (
                            <div className="w-16 h-16 rounded overflow-hidden mr-3 flex-shrink-0">
                              <Image 
                                src={item.productImage} 
                                alt={item.productName} 
                                width={64} 
                                height={64}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          )}
                          <div>
                            <Link 
                              href={`/admin/products/${item.productId}`}
                              className="text-[#007BF9] hover:underline font-medium"
                            >
                              {item.productName}
                            </Link>
                            {item.variations && item.variations.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {item.variations.map((variation, index) => (
                                  <div key={index} className="text-xs text-[#49617E]">
                                    <span className="font-medium">{variation.name}:</span> {variation.option}
                                    {variation.price && variation.price > 0 && (
                                      <span className="ml-1 text-[#E46A11]">(+${variation.price.toFixed(2)})</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                            {item.designFile && (
                              <div className="mt-2 text-xs">
                                <span className="bg-[#DCE8F8] text-[#007BF9] px-2 py-0.5 rounded inline-flex items-center">
                                  <FileDown size={12} className="mr-1" />
                                  Design file
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-[#49617E]">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 text-sm text-[#49617E]">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-4 text-sm text-[#333333] font-medium text-right">
                        ${item.totalPrice.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-6 flex justify-between items-start flex-wrap md:flex-nowrap gap-6">
              <div className="w-full md:w-auto flex-1 order-2 md:order-1">
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline" 
                    size="sm" 
                    leftIcon={<Download size={16} />}
                    onClick={handleDownloadInvoice}
                  >
                    Download Invoice
                  </Button>
                  <Button
                    variant="outline" 
                    size="sm" 
                    leftIcon={<Download size={16} />}
                    onClick={handleDownloadDesign}
                  >
                    Download Design
                  </Button>
                </div>
              </div>
              
              <div className="w-full md:w-64 order-1 md:order-2">
                <div className="space-y-2">
                  <div className="flex justify-between py-1">
                    <span className="text-[#49617E]">Subtotal:</span>
                    <span className="text-[#333333]">${order.amount.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#49617E]">Tax:</span>
                    <span className="text-[#333333]">${order.amount.tax.toFixed(2)}</span>
                  </div>
                  {order.amount.discount > 0 && (
                    <div className="flex justify-between py-1 text-[#E46A11]">
                      <span>Discount:</span>
                      <span>-${order.amount.discount.toFixed(2)}</span>
                    </div>
                  )}
                  {order.amount.shipping > 0 && (
                    <div className="flex justify-between py-1">
                      <span className="text-[#49617E]">Shipping:</span>
                      <span className="text-[#333333]">${order.amount.shipping.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-t border-[#E4E7EB] font-semibold">
                    <span className="text-[#2B4F60]">Total:</span>
                    <span className="text-[#2B4F60]">${order.amount.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column: Order Status & History */}
        <div className="space-y-6 print:hidden">
          {/* Order Status Badge */}
          <div className="bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
            <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4">
              <h3 className="text-[#2B4F60] font-semibold">Order Status</h3>
            </div>
            
            <div className="p-6">
              <div className={`${getStatusColor(order.status)} text-center py-8 rounded-md`}>
                <span className="text-lg font-semibold">{order.status}</span>
              </div>
              
              <div className="mt-6 space-y-3">
                <Button
                  variant="outline" 
                  leftIcon={<X size={16} />}
                  onClick={handleCancelOrder}
                  disabled={order.status === 'Canceled'}
                  fullWidth
                >
                  Cancel Order
                </Button>
                <Button
                  variant="outline" 
                  leftIcon={<Download size={16} />}
                  onClick={handleRefundOrder}
                  disabled={order.paymentStatus !== 'Paid' && order.paymentStatus !== 'Partially Paid'}
                  fullWidth
                >
                  Refund
                </Button>
              </div>
            </div>
          </div>
          
          {/* Admin Notes */}
          <div className="bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
            <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4">
              <h3 className="text-[#2B4F60] font-semibold">Admin Notes</h3>
            </div>
            
            <div className="p-6">
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Add an internal note for this order..."
                className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9] resize-none"
                rows={4}
              />
              
              <div className="mt-3 flex justify-end">
                <Button
                  variant="primary" 
                  size="sm" 
                  leftIcon={<Plus size={16} />}
                  onClick={handleAddNote}
                  isLoading={isAddingNote}
                  disabled={!adminNote.trim()}
                >
                  Add Note
                </Button>
              </div>
              
              {order.adminNotes && order.adminNotes.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {order.adminNotes.map((note, index) => (
                    <div key={index} className="bg-[#F8F9FA] p-3 rounded-md">
                      <p className="text-sm text-[#333333]">{note}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 text-center py-6 text-[#6F8591] text-sm">
                  No admin notes yet
                </div>
              )}
            </div>
          </div>
          
          {/* Order Activity Log */}
          <div className="bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
            <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4">
              <h3 className="text-[#2B4F60] font-semibold">Order Activity</h3>
            </div>
            
            <div className="p-6">
              {order.activities && order.activities.length > 0 ? (
                <div className="space-y-4">
                  {order.activities.map((activity) => (
                    <div key={activity.id} className="border-b border-dashed border-[#E4E7EB] pb-4 last:border-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-[#333333]">{activity.message}</p>
                          {activity.user && (
                            <p className="text-xs text-[#6F8591] mt-1">By: {activity.user}</p>
                          )}
                        </div>
                        <p className="text-xs text-[#6F8591]">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-[#6F8591] text-sm">
                  No activity recorded yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;