'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Menu,
  Bell,
  MessageSquare,
  ShoppingBag,
  Trash2,
  User,
  LogOut,
  ExternalLink,
  Menu as MenuIcon
} from 'lucide-react';
import { toast } from 'react-toastify';

interface AdminHeaderProps {
  toggleSidebar: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ toggleSidebar }) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  
  const handleClearCache = () => {
    // API call to clear cache would go here
    toast.success('Cache cleared successfully!');
  };

  return (
    <header className="header">
      <div className="header__container bg-white border-b border-[#E4E7EB] shadow-sm">
        <div className="header__top flex justify-between items-center px-4 py-2">
          <div className="header__left flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="header__toggle-btn text-[#384047] hover:text-[#007BF9] transition"
              aria-label="Toggle sidebar"
            >
              <MenuIcon size={24} />
            </button>
            
            <div className="header__logo">
              <Link href="/admin">
                <span className="text-[#2B4F60] font-bold text-2xl">Druckland</span>
              </Link>
            </div>
            
            <a 
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="header__view-website flex items-center gap-1 text-[#49617E] hover:text-[#007BF9] transition text-sm"
            >
              <ExternalLink size={16} />
              <span>View Website</span>
            </a>
          </div>
          
          <div className="header__right flex items-center gap-3">
            <div className="header__notifications flex items-center gap-3">
              <button className="header__notification-btn relative text-[#384047] hover:text-[#007BF9] transition">
                <Bell size={20} />
                <span className="header__notification-badge absolute -top-1 -right-1 bg-[#F85464] text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center">
                  3
                </span>
              </button>
              
              <button className="header__notification-btn relative text-[#384047] hover:text-[#007BF9] transition">
                <MessageSquare size={20} />
                <span className="header__notification-badge absolute -top-1 -right-1 bg-[#FFB02C] text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center">
                  5
                </span>
              </button>
              
              <button className="header__notification-btn relative text-[#384047] hover:text-[#007BF9] transition">
                <ShoppingBag size={20} />
                <span className="header__notification-badge absolute -top-1 -right-1 bg-[#30BF89] text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center">
                  2
                </span>
              </button>
            </div>
            
            <button 
              onClick={handleClearCache}
              className="header__clear-cache-btn bg-[#DCE8F8] hover:bg-[#B8E2F2] text-[#10243E] px-3 py-1 rounded-md text-sm transition-colors"
            >
              <Trash2 size={16} className="inline mr-1" />
              Clear Cache
            </button>
            
            <div className="header__user relative">
              <button 
                className="header__user-btn flex items-center gap-2"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
              >
                <div className="header__user-avatar bg-[#B8E2F2] text-[#2B4F60] w-8 h-8 rounded-full flex items-center justify-center">
                  <User size={18} />
                </div>
                <div className="header__user-info hidden sm:block text-left">
                  <div className="header__user-name text-[#2B4F60] text-sm font-semibold">Admin User</div>
                  <div className="header__user-email text-[#49617E] text-xs">admin@druckland.com</div>
                </div>
              </button>
              
              {showUserDropdown && (
                <div className="header__user-dropdown absolute right-0 top-full mt-1 bg-white shadow-lg rounded-md border border-[#E4E7EB] w-48 z-50">
                  <Link 
                    href="/admin/profile"
                    className="header__dropdown-item flex items-center gap-2 px-4 py-2 hover:bg-[#F5F5F5] text-[#49617E]"
                  >
                    <User size={16} />
                    <span>Profile</span>
                  </Link>
                  <Link 
                    href="/auth/logout"
                    className="header__dropdown-item flex items-center gap-2 px-4 py-2 hover:bg-[#F5F5F5] text-[#49617E]"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;