'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  ClipboardList,
  Users,
  Bell,
  Mail,
  UserCog,
  Shield,
  FileText,
  Settings,
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  Truck,
  CreditCard,
  Percent,
  PackagePlus,
  Tag,
  Heart,
  MessageSquare,
  Bookmark,
  Flame,
  BarChart2,
  DollarSign,
  Globe,
  Lock,
  Database,
  Inbox,
  Languages,
  Send,
  Cloud
} from 'lucide-react';

interface SidebarMenuItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  subItems?: Array<{
    label: string;
    path: string;
  }>;
}

interface AdminSidebarProps {
  isExpanded: boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isExpanded }) => {
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['print-options']);
  
  const toggleSubMenu = (label: string) => {
    setExpandedMenus(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };
  
  const menuItems: SidebarMenuItem[] = [
    {
      label: 'Dashboard',
      path: '/admin',
      icon: <LayoutDashboard size={20} />,
    },
    {
      label: 'Products',
      path: '/admin/products',
      icon: <ShoppingCart size={20} />,
      subItems: [
        { label: 'All Products', path: '/admin/products' },
        { label: 'Flash Sale', path: '/admin/products/flash-sale' },
        { label: 'Product Collection', path: '/admin/products/collections' },
        { label: 'Product Category', path: '/admin/products/categories' },
        { label: 'Product Tags', path: '/admin/products/tags' },
        { label: 'Product Label', path: '/admin/products/labels' },
        { label: 'Product Brands', path: '/admin/products/brands' },
        { label: 'Product Reviews', path: '/admin/products/reviews' },
      ]
    },
    {
      label: 'Print Options',
      path: '/admin/print-options',
      icon: <Bookmark size={20} />,
      subItems: [
        { label: 'All Print Options', path: '/admin/print-options' },
        { label: 'Add New', path: '/admin/print-options/new' },
      ]
    },
    {
      label: 'Orders',
      path: '/admin/orders',
      icon: <ClipboardList size={20} />,
      subItems: [
        { label: 'All Orders', path: '/admin/orders' },
        { label: 'Shipping', path: '/admin/orders/shipping' },
        { label: 'Payment Methods', path: '/admin/orders/payment-methods' },
        { label: 'Tax', path: '/admin/orders/tax' },
        { label: 'Shipments', path: '/admin/orders/shipments' },
      ]
    },
    {
      label: 'Users',
      path: '/admin/users',
      icon: <Users size={20} />,
    },
    {
      label: 'Subscription',
      path: '/admin/subscription',
      icon: <Bell size={20} />,
    },
    {
      label: 'Contact',
      path: '/admin/contact',
      icon: <Mail size={20} />,
    },
    {
      label: 'Admin',
      path: '/admin/administration',
      icon: <UserCog size={20} />,
    },
    {
      label: 'Roles & Permission',
      path: '/admin/roles',
      icon: <Shield size={20} />,
    },
    {
      label: 'Website Content',
      path: '/admin/content',
      icon: <FileText size={20} />,
      subItems: [
        { label: 'All Banners', path: '/admin/content/banners' },
        { label: 'All FAQ', path: '/admin/content/faq' },
        { label: 'All Article', path: '/admin/content/articles' },
        { label: 'Promotional Banner', path: '/admin/content/promotional' },
        { label: 'Category Content', path: '/admin/content/categories' },
      ]
    },
    {
      label: 'Settings',
      path: '/admin/settings',
      icon: <Settings size={20} />,
      subItems: [
        { label: 'Website Logo', path: '/admin/settings/logo' },
        { label: 'Address', path: '/admin/settings/address' },
        { label: 'Analytics', path: '/admin/settings/analytics' },
        { label: 'Currency', path: '/admin/settings/currency' },
        { label: 'Clear Cache', path: '/admin/settings/cache' },
        { label: 'Languages', path: '/admin/settings/languages' },
        { label: 'Social Login', path: '/admin/settings/social-login' },
        { label: 'SMTP Setting', path: '/admin/settings/smtp' },
        { label: 'Media Storage', path: '/admin/settings/media' },
        { label: 'Miscellaneous', path: '/admin/settings/miscellaneous' },
        { label: 'Plugin', path: '/admin/settings/plugins' },
      ]
    },
  ];

  const isCurrentPath = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <aside className={`sidebar bg-white border-r border-[#E4E7EB] h-screen overflow-y-auto ${isExpanded ? 'w-60' : 'w-20'} transition-all duration-300 shadow-sm`}>
      <div className="sidebar__container p-2">
        <div className="sidebar__brand p-2 mb-4 flex justify-center items-center">
          {isExpanded ? (
            <span className="text-[#2B4F60] font-bold text-2xl">Druckland</span>
          ) : (
            <span className="text-[#2B4F60] font-bold text-2xl">D</span>
          )}
        </div>
        
        <nav className="sidebar__nav">
          <ul className="sidebar__menu space-y-1">
            {menuItems.map((item, index) => (
              <li key={index} className="sidebar__menu-item">
                {item.subItems ? (
                  <div className="sidebar__submenu">
                    <button
                      onClick={() => toggleSubMenu(item.label)}
                      className={`sidebar__menu-button w-full flex items-center justify-between px-3 py-2 rounded-md transition ${
                        isCurrentPath(item.path)
                          ? 'bg-[#DCE8F8] text-[#007BF9]'
                          : 'text-[#49617E] hover:bg-[#F5F5F5]'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="sidebar__menu-icon mr-2">{item.icon}</span>
                        {isExpanded && <span className="sidebar__menu-label">{item.label}</span>}
                      </div>
                      {isExpanded && (
                        expandedMenus.includes(item.label) 
                          ? <ChevronDown size={16} /> 
                          : <ChevronRight size={16} />
                      )}
                    </button>
                    
                    {isExpanded && expandedMenus.includes(item.label) && (
                      <ul className="sidebar__submenu-list pl-9 mt-1 space-y-1">
                        {item.subItems.map((subItem, subIndex) => (
                          <li key={subIndex} className="sidebar__submenu-item">
                            <Link
                              href={subItem.path}
                              className={`sidebar__submenu-link block px-3 py-1 rounded-md text-sm transition ${
                                isCurrentPath(subItem.path)
                                  ? 'text-[#007BF9] font-medium'
                                  : 'text-[#49617E] hover:text-[#007BF9]'
                              }`}
                            >
                              {subItem.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.path}
                    className={`sidebar__menu-link flex items-center px-3 py-2 rounded-md transition ${
                      isCurrentPath(item.path)
                        ? 'bg-[#DCE8F8] text-[#007BF9]'
                        : 'text-[#49617E] hover:bg-[#F5F5F5]'
                    }`}
                  >
                    <span className="sidebar__menu-icon mr-2">{item.icon}</span>
                    {isExpanded && <span className="sidebar__menu-label">{item.label}</span>}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;