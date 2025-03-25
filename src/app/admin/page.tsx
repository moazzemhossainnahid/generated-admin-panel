'use client';

import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  ClipboardList, 
  TrendingUp,
  Eye,
  DollarSign,
  Printer,
  Bell,
  Mail
} from 'lucide-react';
import Button from '@/components/ui/Button';

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__header mb-6">
        <h1 className="text-[#2B4F60] text-2xl font-semibold flex items-center">
          <LayoutDashboard className="mr-2" size={24} />
          Dashboard
        </h1>
        <p className="text-[#49617E] mt-1">
          Welcome to Druckland Admin Panel. Here's an overview of your store's performance.
        </p>
      </div>
      
      <div className="admin-dashboard__stats grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="admin-dashboard__stat-card bg-white rounded-md border border-[#E4E7EB] p-4 shadow-sm">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-md bg-[#DCE8F8] flex items-center justify-center text-[#007BF9] mr-3">
              <DollarSign size={20} />
            </div>
            <h3 className="text-[#49617E] font-medium">Total Revenue</h3>
          </div>
          <div className="text-2xl font-semibold text-[#2B4F60]">$24,580.50</div>
          <div className="text-xs text-[#30BF89] flex items-center mt-1">
            <TrendingUp size={14} className="mr-1" /> 
            +12.5% from last month
          </div>
        </div>
        
        <div className="admin-dashboard__stat-card bg-white rounded-md border border-[#E4E7EB] p-4 shadow-sm">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-md bg-[#DCE8F8] flex items-center justify-center text-[#007BF9] mr-3">
              <ShoppingCart size={20} />
            </div>
            <h3 className="text-[#49617E] font-medium">Total Orders</h3>
          </div>
          <div className="text-2xl font-semibold text-[#2B4F60]">1,258</div>
          <div className="text-xs text-[#30BF89] flex items-center mt-1">
            <TrendingUp size={14} className="mr-1" /> 
            +8.2% from last month
          </div>
        </div>
        
        <div className="admin-dashboard__stat-card bg-white rounded-md border border-[#E4E7EB] p-4 shadow-sm">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-md bg-[#DCE8F8] flex items-center justify-center text-[#007BF9] mr-3">
              <Users size={20} />
            </div>
            <h3 className="text-[#49617E] font-medium">Total Customers</h3>
          </div>
          <div className="text-2xl font-semibold text-[#2B4F60]">3,427</div>
          <div className="text-xs text-[#30BF89] flex items-center mt-1">
            <TrendingUp size={14} className="mr-1" /> 
            +5.7% from last month
          </div>
        </div>
        
        <div className="admin-dashboard__stat-card bg-white rounded-md border border-[#E4E7EB] p-4 shadow-sm">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-md bg-[#DCE8F8] flex items-center justify-center text-[#007BF9] mr-3">
              <Eye size={20} />
            </div>
            <h3 className="text-[#49617E] font-medium">Total Visits</h3>
          </div>
          <div className="text-2xl font-semibold text-[#2B4F60]">12,458</div>
          <div className="text-xs text-[#30BF89] flex items-center mt-1">
            <TrendingUp size={14} className="mr-1" /> 
            +15.2% from last month
          </div>
        </div>
      </div>
      
      <div className="admin-dashboard__quick-actions grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="admin-dashboard__action-card bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
          <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-4 py-3">
            <h3 className="text-[#2B4F60] font-medium">Products</h3>
          </div>
          <div className="p-4">
            <div className="flex justify-between mb-3">
              <div className="text-[#49617E]">Total Products</div>
              <div className="text-[#2B4F60] font-semibold">245</div>
            </div>
            <div className="flex justify-between mb-4">
              <div className="text-[#49617E]">Out of Stock</div>
              <div className="text-[#F85464] font-semibold">12</div>
            </div>
            <Link href="/admin/products">
              <Button variant="outline" fullWidth>
                Manage Products
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="admin-dashboard__action-card bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
          <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-4 py-3">
            <h3 className="text-[#2B4F60] font-medium">Orders</h3>
          </div>
          <div className="p-4">
            <div className="flex justify-between mb-3">
              <div className="text-[#49617E]">Pending</div>
              <div className="text-[#FFB02C] font-semibold">18</div>
            </div>
            <div className="flex justify-between mb-4">
              <div className="text-[#49617E]">Processing</div>
              <div className="text-[#007BF9] font-semibold">24</div>
            </div>
            <Link href="/admin/orders">
              <Button variant="outline" fullWidth>
                Manage Orders
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="admin-dashboard__action-card bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
          <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-4 py-3">
            <h3 className="text-[#2B4F60] font-medium">Print Options</h3>
          </div>
          <div className="p-4">
            <div className="flex justify-between mb-3">
              <div className="text-[#49617E]">Total Groups</div>
              <div className="text-[#2B4F60] font-semibold">5</div>
            </div>
            <div className="flex justify-between mb-4">
              <div className="text-[#49617E]">Status</div>
              <div className="text-[#30BF89] font-semibold">Active</div>
            </div>
            <Link href="/admin/print-options">
              <Button variant="outline" fullWidth>
                Manage Print Options
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="admin-dashboard__action-card bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
          <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-4 py-3">
            <h3 className="text-[#2B4F60] font-medium">Quick Links</h3>
          </div>
          <div className="p-4">
            <div className="space-y-2">
              <Link href="/admin/products/new">
                <Button variant="outline" size="sm" leftIcon={<ShoppingCart size={14} />} fullWidth>
                  Add New Product
                </Button>
              </Link>
              <Link href="/admin/print-options/new">
                <Button variant="outline" size="sm" leftIcon={<Printer size={14} />} fullWidth>
                  Add Print Option
                </Button>
              </Link>
              <Link href="/admin/content">
                <Button variant="outline" size="sm" leftIcon={<Mail size={14} />} fullWidth>
                  Manage Content
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="admin-dashboard__recent-activity bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
        <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4">
          <h3 className="text-[#2B4F60] font-medium">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-[#DCE8F8] flex items-center justify-center text-[#007BF9] mr-3 shrink-0">
                <ShoppingCart size={18} />
              </div>
              <div>
                <p className="text-[#2B4F60] font-medium">New order #12458</p>
                <p className="text-sm text-[#49617E]">
                  Customer: John Doe - Total: $125.40 - Items: 3
                </p>
                <p className="text-xs text-[#6F8591] mt-1">10 minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-[#E6F6EE] flex items-center justify-center text-[#30BF89] mr-3 shrink-0">
                <ClipboardList size={18} />
              </div>
              <div>
                <p className="text-[#2B4F60] font-medium">Order #12442 status updated</p>
                <p className="text-sm text-[#49617E]">
                  Status changed from "Processing" to "Shipped"
                </p>
                <p className="text-xs text-[#6F8591] mt-1">45 minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-[#FFF4EB] flex items-center justify-center text-[#E46A11] mr-3 shrink-0">
                <Users size={18} />
              </div>
              <div>
                <p className="text-[#2B4F60] font-medium">New customer registered</p>
                <p className="text-sm text-[#49617E]">
                  Sarah Johnson (sarah.johnson@example.com)
                </p>
                <p className="text-xs text-[#6F8591] mt-1">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-[#DCE8F8] flex items-center justify-center text-[#007BF9] mr-3 shrink-0">
                <Printer size={18} />
              </div>
              <div>
                <p className="text-[#2B4F60] font-medium">Print option group updated</p>
                <p className="text-sm text-[#49617E]">
                  "Business Cards Print Options" was updated by Admin
                </p>
                <p className="text-xs text-[#6F8591] mt-1">4 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}