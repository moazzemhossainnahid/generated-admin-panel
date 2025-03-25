'use client';

import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AdminHeader from '@/components/layout/AdminHeader';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminFooter from '@/components/layout/AdminFooter';
import Breadcrumbs from '@/components/layout/Breadcrumbs';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  
  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className="admin-layout min-h-screen bg-[#F5F7FA] flex">
      <AdminSidebar isExpanded={isSidebarExpanded} />
      
      <div className="admin-layout__content flex-1 flex flex-col overflow-hidden">
        <AdminHeader toggleSidebar={toggleSidebar} />
        <Breadcrumbs />
        
        <main className="admin-layout__main flex-1 p-4 overflow-auto">
          {children}
        </main>
        
        <AdminFooter />
      </div>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}