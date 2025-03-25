'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Plus, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Download,
  Upload,
  Eye,
  Trash2
} from 'lucide-react';
import { toast } from 'react-toastify';
import Button from '@/components/ui/Button';
import DateFilter from '@/components/ui/DateFilter';
import { Order, OrderStatus, PaymentStatus } from '@/types/orders';

interface OrderListProps {
  initialOrders: Order[];
  initialTotal: number;
}

const OrderList: React.FC<OrderListProps> = ({ 
  initialOrders,
  initialTotal
}) => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [total, setTotal] = useState(initialTotal);
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'All'>('All');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<PaymentStatus | 'All'>('All');
  const [dateRange, setDateRange] = useState<{start: string, end: string} | null>(null);

  // Bulk action handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(orders.map(order => order.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) {
      toast.warning('No items selected');
      return;
    }

    // Check if any selected orders are in "Processing" or "Shipped" status
    const hasProcessingOrShipped = orders.some(
      order => selectedItems.includes(order.id) && 
              (order.status === 'Processing' || order.status === 'Shipped')
    );

    let confirmed = false;
    
    if (hasProcessingOrShipped) {
      confirmed = window.confirm(`Some selected orders are in Processing or Shipped status. Are you sure you want to delete ${selectedItems.length} orders?`);
    } else {
      confirmed = window.confirm(`Are you sure you want to delete ${selectedItems.length} selected orders?`);
    }
    
    if (!confirmed) return;

    try {
      // API call would go here
      
      // Update the UI
      setOrders(orders.filter(order => !selectedItems.includes(order.id)));
      setSelectedItems([]);
      toast.success(`Successfully deleted ${selectedItems.length} orders`);
    } catch (error) {
      toast.error('Failed to delete orders');
    }
  };

  // Individual delete handler
  const handleDelete = async (id: string) => {
    const order = orders.find(o => o.id === id);
    
    if (!order) return;
    
    // Check if order is in "Processing" or "Shipped" status
    const isProcessingOrShipped = order.status === 'Processing' || order.status === 'Shipped';
    
    let confirmed = false;
    
    if (isProcessingOrShipped) {
      confirmed = window.confirm(`This order is in ${order.status} status. Are you sure you want to delete it?`);
    } else {
      confirmed = window.confirm('Are you sure you want to delete this order?');
    }
    
    if (!confirmed) return;

    try {
      // API call would go here
      
      // Update the UI
      setOrders(orders.filter(order => order.id !== id));
      toast.success('Order deleted successfully');
    } catch (error) {
      toast.error('Failed to delete order');
    }
  };

  // Search handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // API call would go here for server-side filtering
    
    // For now, just simulate filtering on client side
    if (searchQuery.trim() === '') {
      applyFilters();
    } else {
      const filtered = initialOrders.filter(order => 
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.amount.total.toString().includes(searchQuery)
      );
      setOrders(filtered);
    }
  };

  // Apply all filters
  const applyFilters = () => {
    let filtered = [...initialOrders];
    
    // Status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    // Payment status filter
    if (paymentStatusFilter !== 'All') {
      filtered = filtered.filter(order => order.paymentStatus === paymentStatusFilter);
    }
    
    // Date range filter
    if (dateRange?.start && dateRange?.end) {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999); // Set to end of day
      
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= startDate && orderDate <= endDate;
      });
    }
    
    // Search query
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.amount.total.toString().includes(searchQuery)
      );
    }
    
    setOrders(filtered);
  };

  // Filter handlers
  const handleStatusFilter = (status: OrderStatus | 'All') => {
    setStatusFilter(status);
    setCurrentPage(1);
    
    // After setting the new filter, apply all filters
    setTimeout(() => {
      applyFilters();
    }, 0);
  };

  const handlePaymentStatusFilter = (status: PaymentStatus | 'All') => {
    setPaymentStatusFilter(status);
    setCurrentPage(1);
    
    // After setting the new filter, apply all filters
    setTimeout(() => {
      applyFilters();
    }, 0);
  };

  // Date filter handler
  const handleDateFilter = (start: string, end: string) => {
    setDateRange({ start, end });
    setCurrentPage(1);
    
    // After setting the date range, apply all filters
    setTimeout(() => {
      applyFilters();
    }, 0);
  };

  const handleClearDateFilter = () => {
    setDateRange(null);
    
    // After clearing the date range, apply all filters
    setTimeout(() => {
      applyFilters();
    }, 0);
  };

  // Sorting handler
  const handleSort = (field: string) => {
    const newOrder = field === sortField && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newOrder);
    
    // Sort the orders
    const sortedOrders = [...orders].sort((a, b) => {
      if (field === 'orderNumber') {
        return newOrder === 'asc' 
          ? a.orderNumber.localeCompare(b.orderNumber) 
          : b.orderNumber.localeCompare(a.orderNumber);
      } else if (field === 'status') {
        return newOrder === 'asc' 
          ? a.status.localeCompare(b.status) 
          : b.status.localeCompare(a.status);
      } else if (field === 'paymentStatus') {
        return newOrder === 'asc' 
          ? a.paymentStatus.localeCompare(b.paymentStatus) 
          : b.paymentStatus.localeCompare(a.paymentStatus);
      } else if (field === 'user') {
        return newOrder === 'asc' 
          ? a.user.name.localeCompare(b.user.name) 
          : b.user.name.localeCompare(a.user.name);
      } else if (field === 'amount') {
        return newOrder === 'asc' 
          ? a.amount.total - b.amount.total 
          : b.amount.total - a.amount.total;
      } else if (field === 'createdAt') {
        return newOrder === 'asc' 
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() 
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });
    
    setOrders(sortedOrders);
  };

  // Pagination handlers
  const totalPages = Math.ceil(total / itemsPerPage);
  
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    // API call would go here for server-side pagination
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
    // API call would go here
  };

  // Handle export
  const handleExport = () => {
    toast.success('Orders exported successfully');
    // In a real application, this would trigger a CSV/Excel export
  };

  // Handle import
  const handleImport = () => {
    // Open file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv,.xlsx,.xls';
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // In a real application, you would handle the file upload and import
        toast.success(`File "${file.name}" imported successfully`);
      }
    };
    fileInput.click();
  };

  // Get sort indicator
  const getSortIndicator = (field: string) => {
    if (field !== sortField) return null;
    
    return sortOrder === 'asc' 
      ? <ArrowUp size={14} className="ml-1" /> 
      : <ArrowDown size={14} className="ml-1" />;
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: OrderStatus }) => {
    let bgColor = '';
    let textColor = '';
    
    switch (status) {
      case 'Pending':
        bgColor = 'bg-[#FFF4EB]';
        textColor = 'text-[#E46A11]';
        break;
      case 'Processing':
        bgColor = 'bg-[#DCE8F8]';
        textColor = 'text-[#007BF9]';
        break;
      case 'In Production':
        bgColor = 'bg-[#FFE9D5]';
        textColor = 'text-[#F59E0B]';
        break;
      case 'Shipped':
        bgColor = 'bg-[#E6F6EE]';
        textColor = 'text-[#30BF89]';
        break;
      case 'Delivered':
        bgColor = 'bg-[#E6F6EE]';
        textColor = 'text-[#0D894F]';
        break;
      case 'Canceled':
        bgColor = 'bg-[#FFEFEF]';
        textColor = 'text-[#F85464]';
        break;
      default:
        bgColor = 'bg-[#F5F5F5]';
        textColor = 'text-[#6F8591]';
    }
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {status}
      </span>
    );
  };

  // Payment status badge component
  const PaymentStatusBadge = ({ status }: { status: PaymentStatus }) => {
    let bgColor = '';
    let textColor = '';
    
    switch (status) {
      case 'Paid':
        bgColor = 'bg-[#E6F6EE]';
        textColor = 'text-[#30BF89]';
        break;
      case 'Unpaid':
        bgColor = 'bg-[#FFEFEF]';
        textColor = 'text-[#F85464]';
        break;
      case 'Partially Paid':
        bgColor = 'bg-[#FFE9D5]';
        textColor = 'text-[#F59E0B]';
        break;
      case 'Refunded':
        bgColor = 'bg-[#DCE8F8]';
        textColor = 'text-[#007BF9]';
        break;
      default:
        bgColor = 'bg-[#F5F5F5]';
        textColor = 'text-[#6F8591]';
    }
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="order-list">
      <div className="order-list__header mb-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="order-list__search flex-1 max-w-md">
          <form onSubmit={handleSearch} className="flex">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F8591]" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by order #, name, email or amount..."
                className="w-full pl-10 pr-4 py-2 border border-[#E4E7EB] rounded-l-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9] text-sm"
              />
            </div>
            <Button type="submit" size="md" className="rounded-l-none">
              Search
            </Button>
          </form>
        </div>
        
        <div className="order-list__actions flex flex-wrap gap-3">
          <Button 
            variant="outline" 
            leftIcon={<Upload size={16} />}
            onClick={handleImport}
          >
            Import
          </Button>
          
          <Button 
            variant="outline" 
            leftIcon={<Download size={16} />}
            onClick={handleExport}
          >
            Export
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 mb-4">
        <DateFilter 
          onApplyFilter={handleDateFilter}
          onClearFilter={handleClearDateFilter}
        />
      </div>
      
      <div className="order-list__filters mb-4 flex flex-wrap items-center gap-4">
        <div className="order-list__bulk-actions flex items-center gap-2">
          <select 
            className="bulk-action-select border border-[#E4E7EB] bg-white rounded-md px-3 py-2 text-sm text-[#333333] focus:outline-none focus:ring-1 focus:ring-[#007BF9]"
            disabled={selectedItems.length === 0}
            defaultValue=""
          >
            <option value="" disabled>Bulk Actions</option>
            <option value="delete">Delete Selected</option>
          </select>
          
          <Button 
            variant="primary" 
            size="sm" 
            onClick={handleBulkDelete}
            disabled={selectedItems.length === 0}
          >
            Apply
          </Button>
          
          {selectedItems.length > 0 && (
            <span className="text-sm text-[#49617E]">
              {selectedItems.length} item(s) selected
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#49617E]">Status:</span>
          <select 
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value as OrderStatus | 'All')}
            className="border border-[#E4E7EB] bg-white rounded-md px-3 py-2 text-sm text-[#333333] focus:outline-none focus:ring-1 focus:ring-[#007BF9]"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="In Production">In Production</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Canceled">Canceled</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#49617E]">Payment:</span>
          <select 
            value={paymentStatusFilter}
            onChange={(e) => handlePaymentStatusFilter(e.target.value as PaymentStatus | 'All')}
            className="border border-[#E4E7EB] bg-white rounded-md px-3 py-2 text-sm text-[#333333] focus:outline-none focus:ring-1 focus:ring-[#007BF9]"
          >
            <option value="All">All</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Partially Paid">Partially Paid</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>
      </div>
      
      <div className="order-list__table bg-white rounded-md border border-[#E4E7EB] overflow-hidden mb-4">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8F9FA] border-b border-[#E4E7EB]">
              <tr>
                <th className="px-4 py-3 text-left">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === orders.length && orders.length > 0}
                      onChange={handleSelectAll}
                      className="mr-2 rounded border-[#E4E7EB]"
                    />
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-semibold text-sm text-[#49617E]">ID</th>
                <th 
                  className="px-4 py-3 text-left font-semibold text-sm text-[#49617E] cursor-pointer"
                  onClick={() => handleSort('orderNumber')}
                >
                  <div className="flex items-center">
                    Order {getSortIndicator('orderNumber')}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left font-semibold text-sm text-[#49617E] cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    Status {getSortIndicator('status')}
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-semibold text-sm text-[#49617E]">Payment Method</th>
                <th 
                  className="px-4 py-3 text-left font-semibold text-sm text-[#49617E] cursor-pointer"
                  onClick={() => handleSort('paymentStatus')}
                >
                  <div className="flex items-center">
                    Payment Status {getSortIndicator('paymentStatus')}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left font-semibold text-sm text-[#49617E] cursor-pointer"
                  onClick={() => handleSort('user')}
                >
                  <div className="flex items-center">
                    User {getSortIndicator('user')}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left font-semibold text-sm text-[#49617E] cursor-pointer"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center">
                    Amount {getSortIndicator('amount')}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left font-semibold text-sm text-[#49617E] cursor-pointer"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center">
                    Created At {getSortIndicator('createdAt')}
                  </div>
                </th>
                <th className="px-4 py-3 text-center font-semibold text-sm text-[#49617E]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-[#E4E7EB] hover:bg-[#F8F9FA]">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(order.id)}
                      onChange={() => handleSelectItem(order.id)}
                      className="rounded border-[#E4E7EB]"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-[#49617E]">{order.id}</td>
                  <td className="px-4 py-3">
                    <Link 
                      href={`/admin/orders/${order.id}`}
                      className="text-[#007BF9] hover:underline font-medium"
                    >
                      #{order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-[#49617E]">{order.paymentMethod}</td>
                  <td className="px-4 py-3">
                    <PaymentStatusBadge status={order.paymentStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-sm text-[#333333]">{order.user.name}</span>
                      <span className="text-xs text-[#6F8591]">{order.user.email}</span>
                      {order.user.isGuest && (
                        <span className="text-xs text-[#E46A11] mt-1">Guest</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-[#333333]">
                    ${order.amount.total.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#49617E]">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <Link 
                        href={`/admin/orders/${order.id}`}
                        className="text-[#49617E] hover:text-[#007BF9] transition p-1 bg-[#F5F7FA] rounded"
                      >
                        <Eye size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="text-[#49617E] hover:text-[#F85464] transition p-1 bg-[#F5F7FA] rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {orders.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-[#6F8591]">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="order-list__pagination flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="order-list__per-page flex items-center gap-2">
          <span className="text-sm text-[#49617E]">Show</span>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="border border-[#E4E7EB] rounded px-2 py-1 text-sm text-[#333333] focus:outline-none focus:ring-1 focus:ring-[#007BF9]"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-sm text-[#49617E]">entries</span>
        </div>
        
        <div className="order-list__page-nav flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </Button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(page => (
              page === 1 || 
              page === totalPages || 
              (page >= currentPage - 1 && page <= currentPage + 1)
            ))
            .map((page, i, array) => (
              <React.Fragment key={page}>
                {i > 0 && array[i - 1] !== page - 1 && (
                  <span className="text-[#6F8591] px-2">...</span>
                )}
                <Button
                  variant={currentPage === page ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              </React.Fragment>
            ))
          }
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};