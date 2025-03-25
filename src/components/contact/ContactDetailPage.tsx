'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Eye } from 'lucide-react';
import ContactDetail from '@/components/contact/ContactDetail';
import { ContactSubmission } from '@/types/contact';
import { toast } from 'react-toastify';

// Mock data for demonstration
const mockContacts: Record<string, ContactSubmission> = {
  '43982': {
    id: '43982',
    fullName: 'Maxim Riley',
    email: 'maximriley@gmail.com',
    phoneNumber: '+880 1615030432',
    orderNumber: '78932',
    subject: 'Receive wrong product',
    message: 'I recently placed an order online, but when my package arrived, I was disappointed to find that I had received the wrong product. Instead of the item I had carefully selected, I got something completely different. This mix-up has caused an inconvenience, as I now have to go through the hassle of returning it and waiting for the correct item. I hope the company resolves this issue quickly and improves their order fulfillment process to prevent similar mistakes in the future.',
    status: 'Resolved',
    attachment: {
      fileName: 'Christmas Card.png',
      fileSize: '45MB',
      fileUrl: '/attachments/Christmas-Card.png'
    },
    formType: 'Inquiry form (4eba5fpd4)',
    submittedAt: '2025-02-25T10:15:00Z',
    ipAddress: '104.137.80.31'
  }
};

interface ContactDetailPageProps {
  params: {
    id: string;
  };
}

export default function ContactDetailPage({ params }: ContactDetailPageProps) {
  const router = useRouter();
  const [contact, setContact] = useState<ContactSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call with a delay
    const fetchData = async () => {
      try {
        // In a real app, you would fetch from your API
        // const response = await fetch(`/api/contacts/${params.id}`);
        // const data = await response.json();
        
        // For now, use mock data
        setTimeout(() => {
          const contactData = mockContacts[params.id];
          if (contactData) {
            setContact(contactData);
          } else {
            // Handle not found case
            toast.error('Contact submission not found');
            router.push('/admin/contact');
          }
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching contact details:', error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [params.id, router]);

  return (
    <div className="contact-detail-page">
      <div className="contact-detail-page__header mb-6">
        <h1 className="text-[#2B4F60] text-2xl font-semibold flex items-center">
          <Eye className="mr-2" size={24} />
          View Contact
        </h1>
        <p className="text-[#49617E] mt-1">
          View and respond to contact form submission
        </p>
      </div>
      
      {isLoading ? (
        <div className="contact-detail-page__loading bg-white p-8 rounded-md text-center">
          <div className="animate-spin h-8 w-8 border-4 border-[#DCE8F8] border-t-[#007BF9] rounded-full mx-auto mb-4"></div>
          <p className="text-[#49617E]">Loading contact details...</p>
        </div>
      ) : contact ? (
        <ContactDetail contact={contact} />
      ) : (
        <div className="contact-detail-page__not-found bg-white p-8 rounded-md text-center">
          <p className="text-[#F85464] mb-4">Contact submission not found</p>
          <button
            onClick={() => router.push('/admin/contact')}
            className="text-[#007BF9] hover:underline"
          >
            Return to Contact List
          </button>
        </div>
      )}
    </div>
  );
}