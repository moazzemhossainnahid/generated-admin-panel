'use client';

import { useEffect, useState } from 'react';
import { Mail } from 'lucide-react';
import ContactList from '@/components/contact/ContactList';
import { ContactSubmission } from '@/types/contact';

// Mock data for demonstration
const mockContacts: ContactSubmission[] = [
  {
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
  },
  {
    id: '43981',
    fullName: 'Maxim Riley',
    email: 'maximriley@gmail.com',
    subject: 'I received your product but I found some issues with it',
    message: 'I received your product but I found some issues with it',
    status: 'Closed',
    formType: 'Contact Form',
    submittedAt: '2025-02-18T14:33:00Z',
    ipAddress: '104.137.80.31'
  },
  {
    id: '43980',
    fullName: 'Maxim Riley',
    email: 'maximriley@gmail.com',
    subject: 'I received your product but I found some issues with it',
    message: 'I received your product but I found some issues with it',
    status: 'Spam',
    formType: 'Contact Form',
    submittedAt: '2025-02-18T14:33:00Z',
    ipAddress: '104.137.80.31'
  },
  {
    id: '43979',
    fullName: 'Maxim Riley',
    email: 'maximriley@gmail.com',
    subject: 'I received your product but I found some issues with it',
    message: 'I received your product but I found some issues with it',
    status: 'In Progress',
    formType: 'Contact Form',
    submittedAt: '2025-02-18T14:33:00Z',
    ipAddress: '104.137.80.31'
  },
  {
    id: '43978',
    fullName: 'Maxim Riley',
    email: 'maximriley@gmail.com',
    subject: 'I received your product but I found some issues with it',
    message: 'I received your product but I found some issues with it',
    status: 'Resolved',
    formType: 'Contact Form',
    submittedAt: '2025-02-18T14:33:00Z',
    ipAddress: '104.137.80.31'
  },
  {
    id: '43977',
    fullName: 'Maxim Riley',
    email: 'maximriley@gmail.com',
    subject: 'I received your product but I found some issues with it',
    message: 'I received your product but I found some issues with it',
    status: 'Closed',
    formType: 'Contact Form',
    submittedAt: '2025-02-18T14:33:00Z',
    ipAddress: '104.137.80.31'
  },
  {
    id: '43976',
    fullName: 'Maxim Riley',
    email: 'maximriley@gmail.com',
    subject: 'I received your product but I found some issues with it',
    message: 'I received your product but I found some issues with it',
    status: 'Spam',
    formType: 'Contact Form',
    submittedAt: '2025-02-18T14:33:00Z',
    ipAddress: '104.137.80.31'
  },
  {
    id: '43975',
    fullName: 'Maxim Riley',
    email: 'maximriley@gmail.com',
    subject: 'I received your product but I found some issues with it',
    message: 'I received your product but I found some issues with it',
    status: 'In Progress',
    formType: 'Contact Form',
    submittedAt: '2025-02-18T14:33:00Z',
    ipAddress: '104.137.80.31'
  }
];

export default function ContactsPage() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call with a delay
    const fetchData = async () => {
      try {
        // In a real app, you would fetch from your API
        // const response = await fetch('/api/contacts');
        // const data = await response.json();
        
        // For now, use mock data
        setTimeout(() => {
          setContacts(mockContacts);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching contacts:', error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="contacts-page">
      <div className="contacts-page__header mb-6">
        <h1 className="text-[#2B4F60] text-2xl font-semibold flex items-center">
          <Mail className="mr-2" size={24} />
          All Contacts
        </h1>
        <p className="text-[#49617E] mt-1">
          Manage and respond to contact form submissions from your website
        </p>
      </div>
      
      {isLoading ? (
        <div className="contacts-page__loading bg-white p-8 rounded-md text-center">
          <div className="animate-spin h-8 w-8 border-4 border-[#DCE8F8] border-t-[#007BF9] rounded-full mx-auto mb-4"></div>
          <p className="text-[#49617E]">Loading contact submissions...</p>
        </div>
      ) : (
        <ContactList 
          initialContacts={contacts} 
          initialTotal={contacts.length} 
        />
      )}
    </div>
  );
}