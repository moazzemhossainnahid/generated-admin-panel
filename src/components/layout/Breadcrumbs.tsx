'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path: string;
  isLast: boolean;
}

const Breadcrumbs = () => {
  const pathname = usePathname();
  
  // Skip the '/admin' part and map the rest of the path
  const pathSegments = pathname
    .split('/')
    .filter(segment => segment !== '' && segment !== 'admin');
  
  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Dashboard',
      path: '/admin',
      isLast: pathSegments.length === 0
    },
    ...pathSegments.map((segment, index) => {
      // Create a path up to this segment
      const path = `/admin/${pathSegments.slice(0, index + 1).join('/')}`;
      
      // Format the label (convert slug to readable format)
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      // Check if this is the last segment
      const isLast = index === pathSegments.length - 1;
      
      return { label, path, isLast };
    })
  ];

  return (
    <div className="breadcrumbs bg-white border-b border-[#E4E7EB] px-4 py-2">
      <div className="breadcrumbs__container flex items-center text-sm">
        <Link href="/admin" className="breadcrumbs__home-link text-[#007BF9] hover:text-[#10243E] transition">
          <Home size={16} />
        </Link>
        
        {breadcrumbs.map((item, index) => (
          <div key={index} className="breadcrumbs__item flex items-center">
            <ChevronRight size={16} className="mx-2 text-[#6F8591]" />
            
            {item.isLast ? (
              <span className="breadcrumbs__current text-[#10243E] font-semibold">
                {item.label}
              </span>
            ) : (
              <Link 
                href={item.path}
                className="breadcrumbs__link text-[#007BF9] hover:text-[#10243E] transition"
              >
                {item.label}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Breadcrumbs;