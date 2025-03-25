'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Download, 
  Trash2, 
  Phone, 
  Mail, 
  Hash, 
  FileText, 
  Calendar, 
  Globe 
} from 'lucide-react';
import { toast } from 'react-toastify';
import Button from '@/components/ui/Button';
import { ContactSubmission } from '@/types/contact';

interface ContactDetailProps {
  contact: ContactSubmission;
}

const ContactDetail: React.FC<ContactDetailProps> = ({ contact }) => {
  const router = useRouter();
  const [status, setStatus] = useState<ContactSubmission['status']>(contact.status);
  const [isUpdating, setIsUpdating] = useState(false);

  // Handle status update
  const handleStatusUpdate = async () => {
    setIsUpdating(true);
    
    try {
      // API call would go here
      // await fetch(`/api/contacts/${contact.id}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status })
      // });
      
      // For now, just simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this contact submission?');
    if (!confirmed) return;
    
    try {
      // API call would go here
      // await fetch(`/api/contacts/${contact.id}`, {
      //   method: 'DELETE'
      // });
      
      // For now, just simulate a successful delete
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('Contact submission moved to trash');
      router.push('/admin/contact');
    } catch (error) {
      toast.error('Failed to delete contact submission');
    }
  };

  // Handle download attachment
  const handleDownloadAttachment = () => {
    if (!contact.attachment) return;
    
    // In a real app, this would download the file
    // window.open(contact.attachment.fileUrl, '_blank');
    
    toast.success(`Downloading ${contact.attachment.fileName}`);
  };

  return (
    <div className="contact-detail">
      {/* Header with Actions */}
      <div className="contact-detail__header flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<ArrowLeft size={16} />}
            onClick={() => router.push('/admin/contact')}
          >
            Back to List
          </Button>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="danger"
            size="sm"
            leftIcon={<Trash2 size={16} />}
            onClick={handleDelete}
          >
            Move to Trash
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Submission Information */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <div className="bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
            <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4">
              <h2 className="text-[#2B4F60] text-lg font-semibold">Submission Information</h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Submission ID */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
                <div className="w-full sm:w-1/4 text-[#49617E] font-medium">Submission ID</div>
                <div className="w-full sm:w-3/4 flex items-center">
                  <Hash size={16} className="text-[#6F8591] mr-2" />
                  <span className="text-[#333333] font-semibold">#{contact.id}</span>
                </div>
              </div>
              
              {/* Full Name */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
                <div className="w-full sm:w-1/4 text-[#49617E] font-medium">Full Name</div>
                <div className="w-full sm:w-3/4 text-[#333333]">{contact.fullName}</div>
              </div>
              
              {/* Email Address */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
                <div className="w-full sm:w-1/4 text-[#49617E] font-medium">Email Address</div>
                <div className="w-full sm:w-3/4 flex items-center">
                  <Mail size={16} className="text-[#6F8591] mr-2" />
                  <a href={`mailto:${contact.email}`} className="text-[#007BF9] hover:underline">
                    {contact.email}
                  </a>
                </div>
              </div>
              
              {/* Phone Number (if provided) */}
              {contact.phoneNumber && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
                  <div className="w-full sm:w-1/4 text-[#49617E] font-medium">Phone Number</div>
                  <div className="w-full sm:w-3/4 flex items-center">
                    <Phone size={16} className="text-[#6F8591] mr-2" />
                    <a href={`tel:${contact.phoneNumber}`} className="text-[#333333] hover:text-[#007BF9]">
                      {contact.phoneNumber}
                    </a>
                  </div>
                </div>
              )}
              
              {/* Order Number (if provided) */}
              {contact.orderNumber && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
                  <div className="w-full sm:w-1/4 text-[#49617E] font-medium">Order Number</div>
                  <div className="w-full sm:w-3/4 flex items-center">
                    <Hash size={16} className="text-[#6F8591] mr-2" />
                    <Link href={`/admin/orders/${contact.orderNumber}`} className="text-[#007BF9] hover:underline">
                      #{contact.orderNumber}
                    </Link>
                  </div>
                </div>
              )}
              
              {/* Subject */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
                <div className="w-full sm:w-1/4 text-[#49617E] font-medium">Subject</div>
                <div className="w-full sm:w-3/4 text-[#333333] font-medium">{contact.subject}</div>
              </div>
              
              {/* Message */}
              <div className="flex flex-col gap-2">
                <div className="text-[#49617E] font-medium">Message</div>
                <div className="p-4 bg-[#F8F9FA] rounded-md text-[#333333] whitespace-pre-wrap">
                  {contact.message}
                </div>
              </div>
              
              {/* Attachment (if available) */}
              {contact.attachment && (
                <div className="flex flex-col gap-2">
                  <div className="text-[#49617E] font-medium">Attachment</div>
                  <div className="p-4 bg-[#F8F9FA] rounded-md flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText size={18} className="text-[#6F8591] mr-2" />
                      <span className="text-[#333333]">{contact.attachment.fileName}</span>
                      <span className="text-[#6F8591] text-sm ml-2">({contact.attachment.fileSize})</span>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<Download size={14} />}
                      onClick={handleDownloadAttachment}
                    >
                      Download
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Right Column - Additional Information */}
        <div className="col-span-1 space-y-6">
          {/* Status */}
          <div className="bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
            <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4">
              <h2 className="text-[#2B4F60] text-lg font-semibold">Status</h2>
            </div>
            <div className="p-6 space-y-4">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ContactSubmission['status'])}
                className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
              >
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
                <option value="Spam">Spam</option>
              </select>
              
              <Button
                variant="primary"
                fullWidth
                isLoading={isUpdating}
                onClick={handleStatusUpdate}
              >
                Update Status
              </Button>
            </div>
          </div>
          
          {/* Additional Information */}
          <div className="bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
            <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4">
              <h2 className="text-[#2B4F60] text-lg font-semibold">Additional Details</h2>
            </div>
            <div className="p-6 space-y-4">
              {/* Form Type */}
              <div className="flex justify-between items-center">
                <div className="text-[#49617E]">Form:</div>
                <div className="text-[#333333] font-medium">{contact.formType}</div>
              </div>
              
              {/* Submission Date & Time */}
              <div className="flex justify-between items-center">
                <div className="text-[#49617E]">Submitted:</div>
                <div className="text-[#333333] flex items-center">
                  <Calendar size={14} className="mr-1" />
                  {new Date(contact.submittedAt).toLocaleString()}
                </div>
              </div>
              
              {/* User IP Address */}
              <div className="flex justify-between items-center">
                <div className="text-[#49617E]">IP Address:</div>
                <div className="text-[#333333] flex items-center">
                  <Globe size={14} className="mr-1" />
                  {contact.ipAddress}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetail;