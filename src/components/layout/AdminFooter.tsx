'use client';

import { useEffect, useState } from 'react';

const AdminFooter: React.FC = () => {
  const [loadTime, setLoadTime] = useState<string>("0.00");
  
  useEffect(() => {
    // Calculate page load time
    const timeToLoad = (window.performance.timing.loadEventEnd - window.performance.timing.navigationStart) / 1000;
    
    // Format to 2 decimal places
    const formattedTime = timeToLoad.toFixed(2);
    setLoadTime(formattedTime);
  }, []);

  return (
    <footer className="footer border-t border-[#E4E7EB] bg-white mt-auto">
      <div className="footer__container px-4 py-3 flex justify-between items-center text-sm text-[#49617E]">
        <div className="footer__copyright">
          Copyright 2025 Copyright Druckland Inc. Version 0.01
        </div>
        <div className="footer__load-time">
          Page loaded in {loadTime} seconds
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;